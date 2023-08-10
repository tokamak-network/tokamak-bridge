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
import { fetchL1Transactions } from "@/components/history/utils/fetchL1Transactions";
import useGetTxLayers from "./useGetTxLayers";
// import titanSDK from "@tokamak-network/titan-sdk";
import { ethers } from "ethers";

export default function useGetTransaction() {
  const [tDataDeposit, setTDataDeposit] = useState<any[]>([]);
  const { provider } = useProvier();
  const { L1BRIDGE_CONTRACT } = useContract();
  const { address } = useAccount();
  const { layer, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();
  const optimismSDK = require("@eth-optimism/sdk");
  const providers = useGetTxLayers();
  const titanSDK = require("@tokamak-network/titan-sdk");
  const l2ProSDK = optimismSDK.asL2Provider(getProvider(providers.l2Provider));
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
        TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
        L2BridgeAbi,
        l2ProSDK
      );

      const crossChainMessenger = new titanSDK.BatchCrossChainMessenger({
        l1ChainId: providers.l1ChainID,
        l2ChainId: providers.l2ChainID,
        l1SignerOrProvider: new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_INFURA_RPC_GOERLI
        ).getSigner(),
        l2SignerOrProvider: l2Pro.getSigner(),
      });

      console.log("crossChainMessenger", crossChainMessenger);

      const userL1Transactions = await fetchL1Transactions(address);

      const l2Transactions_DepositFinalized = await l2Bridge.queryFilter(
        "DepositFinalized"
      );

      const l2Transactions = l2Transactions_DepositFinalized;
      const userL2Transactions = l2Transactions.filter(
        (event) => event.args?._from === address
      );

      if (userL1Transactions !== undefined) {
        const l2WithdrawTxs = await Promise.all(
          userL1Transactions.formattedWithdraw.map(async (tx: any) => {
            const resolved = await crossChainMessenger.toCrossChainMessage(
              tx.transactionHash
            );

            const receipt = await crossChainMessenger.getMessageReceipt(
              resolved
            );

            if (receipt != null && receipt.transactionReceipt != null) {
              const matchTx = receipt.transactionReceipt.transactionHash;              
              const l1tx = userL1Transactions.formattedL1WithdrawResults.filter((tx:any) => {                
              return  tx.transactionHash === matchTx
              })[0]

              console.log('l1tx',l1tx);
              
            }



            // const l2tx = await l2ProSDK.getTransactionReceipt(tx.transactionHash);
            // console.log("l2tx", l2tx);
            // const messageTxReceipt = await titanSDK.getChallengePeriodSeconds()
            // console.log('messageTxReceipt',messageTxReceipt);
            // console.log('messageTxReceipt',messageTxReceipt);

            // const messageTxReceipt =
            //   await titanSDK.l2Provider.getTransactionReceipt(
            //     tx.transactionHash
            //   );
            // console.log("messageTxReceipt", messageTxReceipt);
          })
        );

        const l2Txs = await Promise.all(
          userL2Transactions
            .sort((tx1: any, tx2: any) => tx1.blockNumber - tx2.blockNumber)
            .map(async (tx: any) => {
              const txion = await tx.getTransaction();
              const l2block = await l2ProSDK.getBlock(tx.blockNumber);
              const l1Block = await getProvider(providers.l1Provider)?.getBlock(
                txion.l1BlockNumber
              );
              const l1tx = userL1Transactions.formattedL1DepositResults?.filter(
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

        const l1Txs = await Promise.all(
          userL1Transactions.formattedL1DepositResults.map(async (tx: any) => {
            const l2tx = l2Txs.filter((l2tx: any) => {
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
        const txLogs =
          layer == "L1"
            ? l1Txs.sort(
                (tx1: any, tx2: any) => tx2.l1timeStamp - tx1.l1timeStamp
              )
            : l2Txs.sort(
                (tx1: any, tx2: any) => tx2.l1timeStamp - tx1.l1timeStamp
              );
        setTDataDeposit(txLogs);
      }
    }
  }, [address, layer, provider, l2RpcProvider, connectedChainId]);

  useEffect(() => {
    fetchTransactions();
  }, [address, layer, connectedChainId]);
  return { depositTxs: tDataDeposit };
}
