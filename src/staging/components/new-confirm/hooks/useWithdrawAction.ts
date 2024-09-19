import useConnectWallet from "@/hooks/account/useConnectWallet";
import {
  StandardHistory,
  Status,
  TransactionHistory,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { getBridgeL1ChainId, getBridgeL2ChainId } from "../utils";
import { useCallback } from "react";
import { providerByChainId } from "@/config/getProvider";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { txPendingStatus } from "@/recoil/global/transaction";
import { thanosSepoliaWithdrawHistory } from "@/recoil/history/transaction";
const thanosSDK = require("@tokamak-network/thanos-sdk");

export const useWithdrawAction = () => {
  const { isConnected, address } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [, setTxPending] = useRecoilState(txPendingStatus);
  const [thanosSepWithdrawHistory, setThanosSepoliaWithdrawHistory] =
    useRecoilState(thanosSepoliaWithdrawHistory);
  const updateWithdrawHistory = (
    transactionData: WithdrawTransactionHistory,
    status: Status,
    txReceipt: any
  ) => {
    const oldHistory = { ...thanosSepWithdrawHistory };
    if (!oldHistory.history) return;
    const newTransactionList = oldHistory.history.map(
      (tx: WithdrawTransactionHistory) => {
        if (
          tx.transactionHashes.initialTransactionHash !==
          transactionData.transactionHashes.initialTransactionHash
        )
          return tx;
        if (status === Status.Prove) {
          const newTx = {
            ...tx,
            status: Status.Proved,
            transactionHashes: {
              ...tx.transactionHashes,
              proveTransactionHash: txReceipt.transactionHash,
            },
            blockTimestamps: {
              ...tx.blockTimestamps,
              proveCompletedTimestamp: txReceipt.blockTimestamp,
            },
          };
          console.log(newTx);
          return newTx;
        }
        if (status === Status.Finalize) {
          const newTx = {
            ...tx,
            status: Status.Completed,
            transactionHashes: {
              ...tx.transactionHashes,
              finalizedTransactionHash: txReceipt.transactionHash,
            },
            blockTimestamps: {
              ...tx.blockTimestamps,
              finalizedCompletedTimestamp: txReceipt.blockTimestamp,
            },
          };
          console.log(newTx);
          return newTx;
        }
        return tx;
      }
    );
    setThanosSepoliaWithdrawHistory({
      history: newTransactionList,
      latestBlockNumber: oldHistory.latestBlockNumber,
    });
  };
  const handleWithdrawTxAction = useCallback(
    async (tx: WithdrawTransactionHistory) => {
      if (!isConnected) connectToWallet();
      const l1ChainId = getBridgeL1ChainId(tx);
      const l2ChainId = getBridgeL2ChainId(tx);
      if (!l1ChainId || !l2ChainId || !switchNetwork) return;
      if (chain?.id !== l1ChainId && switchNetwork) {
        await switchNetwork(l1ChainId);
      } else if (chain?.id === l1ChainId) {
        const l1Provider = new ethers.providers.Web3Provider(window.ethereum);
        const l2Provider = providerByChainId[l2ChainId];
        const cm = new thanosSDK.CrossChainMessenger({
          bedrock: true,
          l1ChainId: l1ChainId,
          l2ChainId: l2ChainId,
          l1SignerOrProvider: l1Provider.getSigner(),
          l2SignerOrProvider: l2Provider,
        });
        try {
          if (tx.status === Status.Prove) {
            if (!tx.transactionHashes?.initialTransactionHash) return; // Thanos Cross domain messenger is not available.
            setTxPending(true);
            const proveTx = await cm.proveMessage(
              tx.transactionHashes.initialTransactionHash
            );
            console.log(proveTx);
            const proveReceipt = await proveTx.wait(3);
            console.log(
              "Proved transaction hash (on L1):",
              proveReceipt.transactionHash
            );
            updateWithdrawHistory(tx, Status.Prove, proveReceipt);
          } else if (tx.status === Status.Finalize) {
            if (!tx.transactionHashes?.initialTransactionHash) return; // Thanos Cross domain messenger is not available.
            setTxPending(true);
            const finalizeTxResponse = await cm.finalizeMessage(
              tx.transactionHashes?.initialTransactionHash
            );
            console.log(finalizeTxResponse);
            const finalizeTxReceipt = await finalizeTxResponse.wait();
            console.log(
              "Finalized transaction hash (on L1):",
              finalizeTxReceipt.transactionHash
            );
            updateWithdrawHistory(tx, Status.Finalize, finalizeTxReceipt);
          }
          setTxPending(false);
        } catch (error) {
          console.log(`Error occured while transaction proving.${error}`);
          setTxPending(false);
          return;
        }
      }
    },
    [isConnected, chain, switchNetwork]
  );
  return { handleWithdrawTxAction };
};
