import { transactionData } from "@/recoil/global/transaction";
import { useRecoilState } from "recoil";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect } from "react";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import useContract from "@/hooks/contracts/useContract";
import { useAccount } from "wagmi";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { ethers } from "ethers";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import useConnectedNetwork from "../network";
import { l2RpcProvider } from "@/config/l2Provider";
import { useNetwork } from "wagmi";
import { getProvider } from "@/config/getProvider";
import { fetchL1Transactions } from "@/components/history/utils/fetchL1Transactions";
import useGetTxLayers from "./useGetTxLayers";

export default function useGetTransaction() {
  const [tData, setTData] = useRecoilState(transactionData);
  const { provider } = useProvier();
  const { L1BRIDGE_CONTRACT } = useContract();
  const { address } = useAccount();
  const { layer, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();
  const optimismSDK = require("@eth-optimism/sdk");
  const providers = useGetTxLayers();

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
      const l1bridge = new ethers.Contract(
        L1BRIDGE_CONTRACT,
        L1BridgeAbi,
        l1Pro
      );
      const l2Bridge = new ethers.Contract(
        TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
        L2BridgeAbi,
        l2ProSDK
      );

      const userL1Transactions = await fetchL1Transactions(address);

      const l2Transactions_DepositFinalized = await l2Bridge.queryFilter(
        "DepositFinalized"
      );
      const l2Transactions_WithdrawalInitiated = await l2Bridge.queryFilter(
        "WithdrawalInitiated"
      );

      const l2Transactions = l2Transactions_WithdrawalInitiated.concat(
        l2Transactions_DepositFinalized
      );

      const userL2Transactions = l2Transactions.filter(
        (event) => event.args?._from === address
      );

      console.log("userL2Transactions", userL2Transactions);


     

      if (userL1Transactions !== undefined) {
        const l2Txs = await Promise.all(
          userL2Transactions
            .sort((tx1: any, tx2: any) => tx1.blockNumber - tx2.blockNumber)
            .map(async (tx: any) => {
              const txHash = tx.transactionHash;
              const txion = await tx.getTransaction();
              const l2block = await l2ProSDK.getBlock(tx.blockNumber);
              const txRe = await tx.getTransactionReceipt();
              const l1Block = await getProvider(providers.l1Provider)?.getBlock(
                txion.l1BlockNumber
              );
              const l1tx = userL1Transactions?.filter((l1tx:any) => {
                
                return Number(l1tx.blockNumber) ===  txion.l1BlockNumber
              })
              
              if (l1tx.length > 0) {

                const l1BlockNum = Number(l1tx[0].blockNumber);
                const l1TxHash = l1tx[0].transactionHash
                const l1timeStamp = Number(l1tx[0].blockTimestamp)
                let txCopy = {
                  ...tx,
                  l2timeStamp: l2block.timestamp,
                  l1timeStamp: l1timeStamp,
                  l1Block: l1Block,
                  l2txHash: tx.transactionHash,
                  l1txHash: l1TxHash,
                };
                return txCopy;
              }
  else {
    let txCopy = {
      ...tx,
      l2timeStamp: l2block.timestamp,
      l1timeStamp: l2block.timestamp,
      l1Block: l1Block,
      l2txHash: tx.transactionHash,
      l1txHash: tx.transactionHash,
    };
    return txCopy;
  }
             
            })
        );

console.log(l2Txs);

        const l1Txs = await Promise.all(
          userL1Transactions.map(async (tx: any) => {
            const l2tx = l2Txs.filter((l2tx: any) => {
              return l2tx.l1Block.number === Number(tx.blockNumber);
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
            } else {
              const l1Block = await l1Pro.getBlock(Number(tx.blockNumber));
              const l1timeStamp = l1Block.timestamp;

              let txCopy = {
                ...tx,

                l1timeStamp: l1timeStamp,
                l1Block: l1Block,

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
        console.log("txLogs", txLogs);

        setTData(txLogs);
      }
    }
  }, [address, layer, provider, l2RpcProvider, connectedChainId]);

  useEffect(() => {
    fetchTransactions();
  }, [address, layer, connectedChainId]);
  return tData;
}
