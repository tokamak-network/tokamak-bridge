import { transactionData } from "@/recoil/global/transaction";
import { useRecoilValue, useRecoilState } from "recoil";
import { useProvier } from "../provider/useProvider";
import { useCallback, useEffect } from "react";
import { getContract } from "viem";
import L1BridgeAbi from "@/abis/L1StandardBridge.json";
import useContract from "@/hooks/contracts/useContract";
import { useAccount, useConnect } from "wagmi";
import L2BridgeAbi from "@/abis/L2StandardBridge.json";
import { useContractWrite, usePublicClient } from "wagmi";
import { ethers } from "ethers";
import { TOKAMAK_GOERLI_CONTRACTS } from "@/constant/contracts";
import useConnectedNetwork from "../network";
import { supportedChain } from "@/types/network/supportedNetwork";
import { l2RpcProvider } from "@/config/l2Provider";
import { getL1Provider } from "@/config/l1Provider";
import { useNetwork } from "wagmi";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getProvider } from "@/config/getProvider";

export default function useGetTransaction() {
  const [tData, setTData] = useRecoilState(transactionData);
  const { provider } = useProvier();
  const { L1BRIDGE_CONTRACT } = useContract();
  const { isConnected, address } = useAccount();
  const { layer, chainName, connectedChainId } = useConnectedNetwork();
  const { chain } = useNetwork();
  const optimismSDK = require("@eth-optimism/sdk");

  const returnProvider = (chainName: string | undefined) => {
    let l1Provider, l2Provider;
    switch (chainName) {
      case "DARIUS":
        l1Provider = supportedChain.filter((e) => e.chainName === "GOERLI")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "DARIUS")[0];

        return { l1Provider, l2Provider };

      case "TITAN":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        return { l1Provider, l2Provider };

      case "GOERLI":
        l1Provider = supportedChain.filter((e) => e.chainName === "GOERLI")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "DARIUS")[0];
        return { l1Provider, l2Provider };

      case "MAINNET":
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];

        return { l1Provider, l2Provider };
      default:
        l1Provider = supportedChain.filter((e) => e.chainName === "MAINNET")[0];
        l2Provider = supportedChain.filter((e) => e.chainName === "TITAN")[0];
        return { l1Provider, l2Provider };
    }
  };

  const providers = returnProvider(chainName);

  const l2Pro = optimismSDK.asL2Provider(getProvider(providers.l2Provider));
  ;
  const l1Pro = layer === "L1" ? provider : getProvider(providers.l1Provider);

  const fetchTransactions = useCallback(async () => {
    if (chain?.id && l2Pro !== undefined && l1Pro !== undefined) {
      // console.log("l2Pro", l2Pro);
      // console.log("l1Pro", l1Pro);

      const l1bridge = new ethers.Contract(
        L1BRIDGE_CONTRACT,
        L1BridgeAbi,
        l1Pro
      );
      const l2Bridge = new ethers.Contract(
        TOKAMAK_GOERLI_CONTRACTS.L2Bridge,
        L2BridgeAbi,
        l2Pro
      );
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

      console.log('userL2Transactions',userL2Transactions);
      

      const l2Txs = await Promise.all(
        userL2Transactions
          .sort((tx1: any, tx2: any) => tx1.blockNumber - tx2.blockNumber)
          .map(async (tx: any) => {
         
            
            const txHash = tx.transactionHash;
            const txion = await tx.getTransaction();
            const l2block = await l2Pro.getBlock(tx.blockNumber);
            const txRe = await tx.getTransactionReceipt()                        
            const l1Block = await getProvider(providers.l1Provider)?.getBlock(
              txion.l1BlockNumber
            );

            let txCopy = {
              ...tx,
              l2timeStamp: l2block.timestamp,
              l1timeStamp: l1Block?.timestamp,
              l1Block: l1Block,
            };
            return txCopy;
          })
      );

      const latestBlock = await l1Pro.getBlockNumber();
      const fromBlock = latestBlock - 50000;

      const l1transactions =
        layer === "L2"
          ? await l1bridge.queryFilter({}, fromBlock, "latest")
          : await l1bridge.queryFilter({});
      // l1bridge.queryFilter(l1bridge.filters);
      const userL1Transactions = l1transactions.filter(
        (event) => event.args?._from === address
      );
      // console.log("userL1Transactions", userL1Transactions, l2Txs);

      const l1Txs = await Promise.all(
        userL1Transactions.map(async (tx: any) => {
          // console.log(tx);

          const l2tx = l2Txs.filter(
            (l2tx: any) =>
              {
                l2tx.data === tx.data && l2tx.l1Block.number === tx.blockNumber}
          );
       

          const block = await provider.getBlock(tx.blockNumber);

          let txCopy = {
            ...tx,
            
          };
          return txCopy;
        })
      );

      // console.log('l1Txs',l1Txs);

      const txLogs = layer == "L1" ? userL1Transactions : l2Txs;
      console.log("txLogs", l2Txs);

      setTData(l2Txs);
    }
  }, [address, layer, provider, l2RpcProvider, connectedChainId]);

  useEffect(() => {
    fetchTransactions();
  }, [address, layer, connectedChainId]);
  return tData;
}
