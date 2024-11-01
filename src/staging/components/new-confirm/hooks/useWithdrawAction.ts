import useConnectWallet from "@/hooks/account/useConnectWallet";
import {
  StandardHistory,
  Status,
  TransactionHistory,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { getBridgeL1ChainId, getBridgeL2ChainId } from "../utils";
import { useCallback, useEffect } from "react";
import { providerByChainId } from "@/config/getProvider";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { txPendingStatus } from "@/recoil/global/transaction";
import { thanosWithdrawHistory } from "@/recoil/history/transaction";
import { useProvier } from "@/hooks/provider/useProvider";
import {
  pendingTransactionHashes,
  thanosDepositWithdrawConfirmModalStatus,
} from "@/recoil/modal/atom";
const thanosSDK = require("@tokamak-network/thanos-sdk");

export const useWithdrawAction = () => {
  const { isConnected, address } = useAccount();
  const { connectToWallet } = useConnectWallet();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const [thanosWithdrawalHistory, setThanosSepoliaWithdrawHistory] =
    useRecoilState(thanosWithdrawHistory);
  const [pendingTxHashes, setPendingTxHashes] = useRecoilState(
    pendingTransactionHashes
  );
  const { L1Provider, provider: l1Provider } = useProvier();
  const [
    thanosDepositWithdrawConfirmModal,
    setThanosDepositWithdrawConfirmModal,
  ] = useRecoilState(thanosDepositWithdrawConfirmModalStatus);

  const updateWithdrawHistory = (
    transactionData: WithdrawTransactionHistory,
    status: Status,
    txHash: string,
    blockTimestamp: number
  ) => {
    const oldHistory = { ...thanosWithdrawalHistory };
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
              proveTransactionHash: txHash,
            },
            blockTimestamps: {
              ...tx.blockTimestamps,
              proveCompletedTimestamp: blockTimestamp,
            },
          };
          setThanosDepositWithdrawConfirmModal((prev) => ({
            ...prev,
            transaction: newTx,
          }));
          return newTx;
        }
        if (status === Status.Finalize) {
          const newTx = {
            ...tx,
            status: Status.Completed,
            transactionHashes: {
              ...tx.transactionHashes,
              finalizedTransactionHash: txHash,
            },
            blockTimestamps: {
              ...tx.blockTimestamps,
              finalizedCompletedTimestamp: blockTimestamp,
            },
          };
          setThanosDepositWithdrawConfirmModal((prev) => ({
            ...prev,
            transaction: newTx,
          }));
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
        // const l1Provider = new ethers.providers.Web3Provider(window.ethereum);
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
            setPendingTxHashes((prev) => [
              ...prev,
              tx.transactionHashes.initialTransactionHash,
            ]);
            const proveTx = await cm.proveMessage(
              tx.transactionHashes.initialTransactionHash
            );
            const proveReceipt = await proveTx.wait();
            const block = await L1Provider.getBlock(proveReceipt.blockNumber);
            const blockTimestamp = block.timestamp;
            updateWithdrawHistory(
              tx,
              Status.Prove,
              proveReceipt.transactionHash,
              blockTimestamp
            );
            setPendingTxHashes((prev) =>
              [...prev].filter(
                (hash) => hash !== tx.transactionHashes.initialTransactionHash
              )
            );
          } else if (tx.status === Status.Finalize) {
            if (!tx.transactionHashes?.initialTransactionHash) return; // Thanos Cross domain messenger is not available.
            setPendingTxHashes((prev) => [
              ...prev,
              tx.transactionHashes.initialTransactionHash,
            ]);
            const finalizeTxResponse = await cm.finalizeMessage(
              tx.transactionHashes?.initialTransactionHash
            );
            const finalizeTxReceipt = await finalizeTxResponse.wait();
            const block = await L1Provider.getBlock(
              finalizeTxReceipt.blockNumber
            );
            const blockTimestamp = block.timestamp;
            updateWithdrawHistory(
              tx,
              Status.Finalize,
              finalizeTxReceipt.transactionHash,
              blockTimestamp
            );
            setPendingTxHashes((prev) =>
              [...prev].filter(
                (hash) => hash !== tx.transactionHashes.initialTransactionHash
              )
            );
          }
        } catch (error) {
          console.log(`Error occured while transaction proving.${error}`);
          setPendingTxHashes((prev) =>
            [...prev].filter(
              (hash) => hash !== tx.transactionHashes.initialTransactionHash
            )
          );
          return;
        }
      }
    },
    [
      isConnected,
      chain,
      switchNetwork,
      thanosWithdrawalHistory,
      thanosDepositWithdrawConfirmModal,
    ]
  );
  return { handleWithdrawTxAction };
};
