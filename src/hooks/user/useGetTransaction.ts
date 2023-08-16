import { transactionData } from "@/recoil/global/transaction";
import { useRecoilState } from "recoil";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect, useState } from "react";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import useContract from "@/hooks/contracts/useContract";
import { useAccount } from "wagmi";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import useConnectedNetwork from "../network";
import { l2RpcProvider } from "@/config/l2Provider";
import { useNetwork } from "wagmi";
import { getProvider } from "@/config/getProvider";
import useGetTxLayers from "./useGetTxLayers";
import { fetchUserTransactions } from "@/components/history/utils/fetchUserTransactions";
import { ethers } from "ethers";

export default function useGetTransaction() {
  const [tDataDeposit, setTDataDeposit] = useState<any[]>([]);
  const [crossMessenger, setCrossMessenger] = useState<any>();
  const { provider } = useProvier();
  const { L2BRIDGE_CONTRACT } = useContract();
  const { address } = useAccount();
  const { layer, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();
  const optimismSDK = require("@eth-optimism/sdk");
  const providers = useGetTxLayers();
  const titanSDK = require("@tokamak-network/tokamak-layer2-sdk");

  const l2ProSDK = titanSDK.asL2Provider(getProvider(providers.l2Provider));
  const l2Pro = layer === "L2" ? provider : getProvider(providers.l2Provider);
  const l1Pro = layer === "L1" ? provider : getProvider(providers.l1Provider);

  const fetchTransactions = useCallback(async () => {
    if (
      chain?.id &&
      l2ProSDK !== undefined &&
      l1Pro !== undefined &&
      l2Pro !== undefined
    ) {
      const l2Bridge = new ethers.Contract(
        L2BRIDGE_CONTRACT,
        L2BridgeAbi,
        l2ProSDK
      );
      const crossChainMessenger = new titanSDK.CrossChainMessenger({
        l1ChainId: providers.l1ChainID,
        l2ChainId: providers.l2ChainID,
        l1SignerOrProvider: layer === "L1" ? l1Pro.getSigner(address): new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
        ).getSigner(address),
        l2SignerOrProvider: l2Pro.getSigner(address),
      });
      setCrossMessenger(crossChainMessenger);
      const userAllTransactions = await fetchUserTransactions(address);

      const l2Transactions_DepositFinalized = await l2Bridge.queryFilter(
        "DepositFinalized"
      );

      const l2Transactions = l2Transactions_DepositFinalized;
      const userL2Transactions = l2Transactions.filter(
        (event) => event.args?._from === address
      );

      if (userAllTransactions !== undefined) {
        const l2WithdrawTxs = await Promise.all(
          userAllTransactions.formattedWithdraw.map(async (tx: any) => {
            const resolved = await crossChainMessenger.toCrossChainMessage(
              tx.transactionHash
            );

            const currentStatus = await crossChainMessenger.getMessageStatus(
              resolved
            );
            const l2TxReceipt = await l2Pro.getTransaction(tx.transactionHash); //l2 tx receipt


            // const receipt = await crossChainMessenger.getMessageReceipt(
            //   resolved
            // );

            console.log('currentStatus',currentStatus);
            

// if currentStatus is 2 then the tx is still in rollup period ( wait 5 mins for rollup). 
//if status is 4, rollup is finish and tx ready for challenge period

            if (( currentStatus === 2 || currentStatus === 3 ) && l2TxReceipt !== undefined ) {
              const messageTxReceipt = await l2Pro.getTransactionReceipt(
                resolved.transactionHash
              );
              const logs = await ethers.utils.defaultAbiCoder.decode(
                ["address", "uint256", "bytes"],
                messageTxReceipt.logs[3].data
              );
              const l1Token = ethers.utils.defaultAbiCoder.decode(
                ["address"],
                messageTxReceipt.logs[3].topics[1]
              )[0];
              const l2Token = ethers.utils.defaultAbiCoder.decode(
                ["address"],
                messageTxReceipt.logs[3].topics[2]
              )[0];
              const amnt = BigInt(logs[1]).toString();

              let copy = {
                ...tx,
                event: "withdraw",
                l2timeStamp: tx.blockTimestamp,
                l2txHash: tx.transactionHash,
                _l1Token: l1Token,
                _l2Token: l2Token,
                _amount: amnt,
                l2TxReceipt: l2TxReceipt,
                currentStatus: currentStatus,
                resolved:resolved
              };
              return copy;

            }
            

            // if current status is 4, then tx is in challenge period 
            else if (currentStatus  === 4 && l2TxReceipt.blockNumber !== undefined )   { 
              const messageTxIndex = l2TxReceipt.blockNumber - 1;

              const stateBatchAppendedEvent =
                await crossChainMessenger.getStateBatchAppendedEventByTransactionIndex(
                  messageTxIndex
                );

                const bn = stateBatchAppendedEvent.blockNumber;

                const block = await l1Pro.getBlock(bn);
  
                const challengePeriod =
                  await crossChainMessenger.getChallengePeriodSeconds();
                const timeReadyForRelay = block.timestamp + challengePeriod;
                console.log('timeReadyForRelay',timeReadyForRelay);
                
                
            }

            else  { 

            }
            //
            

            /// if the receipt is not null, then the message is relayed

            // if (

            //   l2TxReceipt.blockNumber !== undefined &&
            //   receipt != null &&
            //   receipt.transactionReceipt != null
            // ) {
            //   const matchTx = receipt.transactionReceipt.transactionHash;
            //   const l1tx =
            //     userAllTransactions.formattedL1WithdrawResults.filter(
            //       (tx: any) => {
            //         return tx.transactionHash === matchTx;
            //       }
            //     )[0];
            //   const messageTxIndex = l2TxReceipt.blockNumber - 1;

            //   const stateBatchAppendedEvent =
            //     await crossChainMessenger.getStateBatchAppendedEventByTransactionIndex(
            //       messageTxIndex
            //     );

            //   const bn = stateBatchAppendedEvent.blockNumber;

            //   const block = await l1Pro.getBlock(bn);

            //   const challengePeriod =
            //     await crossChainMessenger.getChallengePeriodSeconds();
            //   const timeReadyForRelay = block.timestamp + challengePeriod;
            //   const currentStatus = await crossChainMessenger.getMessageStatus(
            //     resolved
            //   );

            //   console.log("currentStatus", currentStatus);

            //   let copy = {
            //     ...tx,
            //     ...l1tx,
            //     l2TxReceipt: l2TxReceipt,
            //     l2timeStamp: tx.blockTimestamp,
            //     l1timeStamp: l1tx.blockTimestamp,
            //     l1Block: l1tx.blockNumber,
            //     l2txHash: tx.transactionHash,
            //     l1txHash: l1tx.transactionHash,
            //     event: "withdraw",
            //     _amount: l1tx._amount,
            //     _l1Token: l1tx._l1Token,
            //     _l2Token: l1tx._l2Token,
            //     timeReadyForRelay: timeReadyForRelay,
            //     currentStatus: currentStatus,
            //     resolved:resolved
            //     // timeReadyForRelay:1692685734
            //   };
            //   return copy;
            // } else if (receipt === null) {
            //   const messageTxReceipt = await l2Pro.getTransactionReceipt(
            //     resolved.transactionHash
            //   );
            //   const logs = await ethers.utils.defaultAbiCoder.decode(
            //     ["address", "uint256", "bytes"],
            //     messageTxReceipt.logs[3].data
            //   );
            //   const l1Token = ethers.utils.defaultAbiCoder.decode(
            //     ["address"],
            //     messageTxReceipt.logs[3].topics[1]
            //   )[0];
            //   const l2Token = ethers.utils.defaultAbiCoder.decode(
            //     ["address"],
            //     messageTxReceipt.logs[3].topics[2]
            //   )[0];

            //   const currentStatus = await crossChainMessenger.getMessageStatus(
            //     resolved
            //   );

            //   console.log("currentStatus", currentStatus);
            //   if (l2TxReceipt.blockNumber) {
            //     const messageTxIndex = l2TxReceipt.blockNumber - 1;
            //     console.log("messageTxIndex", messageTxIndex);

            //     if (currentStatus> 2) {
            //       const stateBatchAppendedEvent =
            //       await crossChainMessenger.getStateBatchAppendedEventByTransactionIndex(
            //         messageTxIndex
            //       );

            //     console.log("stateBatchAppendedEvent", stateBatchAppendedEvent);

            //     const bn = stateBatchAppendedEvent.blockNumber;

            //     const block = await l1Pro.getBlock(bn);
            //     console.log("block", block);

            //     const challengePeriod =
            //       await crossChainMessenger.getChallengePeriodSeconds();
            //     console.log("challengePeriod", challengePeriod);

            //     const timeReadyForRelay = block.timestamp + challengePeriod;
            //     console.log("timeReadyForRelay", timeReadyForRelay);
            //   }
            //     }
                

            //   const amnt = BigInt(logs[1]).toString();
            //   let copy = {
            //     ...tx,
            //     event: "withdraw",
            //     l2timeStamp: tx.blockTimestamp,
            //     l2txHash: tx.transactionHash,
            //     _l1Token: l1Token,
            //     _l2Token: l2Token,
            //     _amount: amnt,
            //     l2TxReceipt: l2TxReceipt,
            //     currentStatus: currentStatus,
            //     resolved:resolved
            //   };
            //   return copy;
            // }
          })
        );

        console.log("l2WithdrawTxs", l2WithdrawTxs);

        const l2DepTxs = await Promise.all(
          userL2Transactions
            .sort((tx1: any, tx2: any) => tx1.blockNumber - tx2.blockNumber)
            .map(async (tx: any) => {
              const txion = await tx.getTransaction();
              const l2block = await l2ProSDK.getBlock(tx.blockNumber);
              const l1Block = await getProvider(providers.l1Provider)?.getBlock(
                txion.l1BlockNumber
              );
              const l1tx =
                userAllTransactions.formattedL1DepositResults?.filter(
                  (l1tx: any) => {
                    return Number(l1tx.messageNonce) === txion.nonce;
                  }
                );

              if (l1tx.length > 0) {
                const l1BlockNum = Number(l1tx[0].blockNumber);
                const l1TxHash = l1tx[0].transactionHash;
                const l1timeStamp = Number(l1tx[0].blockTimestamp);
                let txCopy = {
                  ...tx,
                  ...txion,
                  l2timeStamp: l2block.timestamp,
                  l1timeStamp: l1timeStamp,
                  l1Block: l1Block,
                  l2txHash: tx.transactionHash,
                  l1txHash: l1TxHash,
                  event: "deposit",
                  _amount: l1tx[0]._amount,
                  _l1Token: l1tx[0]._l1Token,
                  _l2Token: l1tx[0]._l2Token,
                };
                return txCopy;
              }
            })
        );

        const l1DepTxs = await Promise.all(
          userAllTransactions.formattedL1DepositResults.map(async (tx: any) => {
            const l2tx = l2DepTxs.filter((l2tx: any) => {
              return l2tx.nonce === Number(tx.messageNonce);
            });
            if (l2tx.length > 0) {
              const l2BlockNum = l2tx[0].blockNumber;
              const l2Block = await l2Pro.getBlock(l2BlockNum);
              const l2timestamp = await l2Block.timestamp;
              const l1Block = await l1Pro.getBlock(Number(tx.blockNumber));
              const l1timeStamp = l1Block.timestamp;
              let txCopy = {
                ...tx,
                l2timeStamp: l2timestamp,
                l1timeStamp: l1timeStamp,
                l1Block: l1Block,
                l2txHash: l2tx[0].transactionHash,
                l1txHash: tx.transactionHash,
              };
              return txCopy;
            }
          })
        );

        const txLogs = layer == "L1" ? l1DepTxs : l2DepTxs;
        const allTxs =
          layer == "L1"
            ? l2WithdrawTxs
                .concat(txLogs)
                .sort(
                  (tx1: any, tx2: any) =>
                    Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
                )
            : l2WithdrawTxs
                .concat(txLogs)
                .sort(
                  (tx1: any, tx2: any) =>
                    Number(tx2.l2timeStamp) - Number(tx1.l2timeStamp)
                );
        setTDataDeposit(allTxs);
        console.log("crossChainMessenger", crossChainMessenger);

        
      }
    }
  }, [address, layer, connectedChainId]);

  useEffect(() => {
    fetchTransactions();
    console.log("dsdsdsdsdsdqwedaㄴㅇㄴㄹㅇ", crossMessenger);
  }, [address, layer, connectedChainId]);
  return { depositTxs: tDataDeposit, crossChainMessenger: crossMessenger };
}
