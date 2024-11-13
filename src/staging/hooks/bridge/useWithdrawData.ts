import { useCallback, useEffect, useState } from "react";
import {
  Action,
  HISTORY_SORT,
  StandardHistory,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId, supportedChainOnProd } from "@/types/network/supportedNetwork";
import { Resolved, SentMessages } from "@/types/activity/history";
import {
  getCurretStatus,
} from "@/utils/history/getCurrentStatus";
import { useProvier } from "@/hooks/provider/useProvider";
import { ethers } from "ethers";
import {
  getDepositStatus,
  getStatus,
  getTransaction,
  getTransactionToken,
} from "@/utils/history/getTransaction";
import { getDecodedStandardBridgeLog } from "@/utils/history/getDecodeBridgeHistoryLog";
import { useRecoilState } from "recoil";
import {
  thanosWithdrawHistory,
  titanWithdrawHistory
} from "@/recoil/history/transaction";
import {
  getThanosMessageStatuaWithSubgraph,
} from "@/staging/utils/getMessageStatus";
import {
  pendingTransactionHashes,
  thanosDepositWithdrawConfirmModalStatus,
} from "@/recoil/modal/atom";
import { getSortedTxListByDate } from "@/staging/utils/history";
import L2ThanosStandardBridgeAbi from "@/constant/abis/L2ThanosStandardBridge.json";
import L2TitanStandardBridgeAbi from "@/constant/abis/L2StandardBridge.json";
import { useThanosSubgraph } from "../subgraph/useThanosSubgraph";
import { useTitanSubgraph } from "../subgraph/useTitanSubgraph";
import { isSupportedOnProd } from "@/utils/network/checkNetwork";



export const useWithdrawData = () => {
  const { l2ThanosData, l1ThanosOptimismPortal, l1ThanosData, pollCount: pollThanosCount } = useThanosSubgraph();
  const { l2TitanData, pollCount: pollTitanCount } = useTitanSubgraph();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { L2Provider, ThanosProvider } = useProvier();
  const [thanosSepWithdrawHistory, setThanosWithdrawHistory] =
    useRecoilState(thanosWithdrawHistory);
  const [titanWithdrawalHistory, setTitanWithdrawHistory] =
    useRecoilState(titanWithdrawHistory);
  const [withdrawHistory, setWithdrawHistory] = useState<
    WithdrawTransactionHistory[] | null
  >(null);
  const [
    thanosDepositWithdrawConfirmModal,
    setThanosDepositWithdrawConfirmModal,
  ] = useRecoilState(thanosDepositWithdrawConfirmModalStatus);
  const [pendingTxHashes, setPendingTxHashes] = useRecoilState(
    pendingTransactionHashes
  );

  const fetchTitanData = useCallback(async () => {
    if (l2TitanData && isConnectedToMainNetwork !== undefined && L2Provider) {
      const l2SentMessges = l2TitanData.sentMessages;
      const result: WithdrawTransactionHistory[] = await Promise.all(
        l2SentMessges.map(async (sentMessage: SentMessages) => {
          const resolved: Resolved = {
            target: sentMessage.target,
            sender: sentMessage.sender,
            message: sentMessage.message,
            messageNonce: sentMessage.messageNonce,
            gasLimit: sentMessage.gasLimit,
            transactionHash: sentMessage.transactionHash,
          };

          const { currentStatus, stateBatchAppended, relayedMessageTx } =
            await getCurretStatus(
              Number(sentMessage.blockNumber),
              resolved,
              isConnectedToMainNetwork
            );
          const l2TxReceipt = await L2Provider.getTransactionReceipt(
            sentMessage.transactionHash
          );

          //using the logs of the tx receipt, we can determine the l1 token address and the l2 token address of the withdraw tx
          if (
            !l2TxReceipt
          ) {
            console.error(
              "Invalid transaction with l2TxReceipt.logs[3] or currentStatus"
            );
            return;
          }

          const parsedLog = getDecodedStandardBridgeLog(
            l2TxReceipt.logs,
            new ethers.utils.Interface(L2TitanStandardBridgeAbi),
            isConnectedToMainNetwork ? SupportedChainId.TITAN : SupportedChainId.TITAN_SEPOLIA
          );

          if (!parsedLog) {
            console.log(`Invalid transaction with parsedLog Error`);
            return;
          }

          const { l1TokenAddress, l2TokenAddress, amount, from, to } =
            parsedLog;
          const { l1Token, l2Token } = getTransactionToken(
            l1TokenAddress.toLowerCase(),
            l2TokenAddress.toLowerCase(),
            amount,
            true,
            isConnectedToMainNetwork
              ? SupportedChainId.MAINNET
              : SupportedChainId.SEPOLIA
          );

          if (!l1Token || !l2Token) {
            console.error(
              `Invalid transaction with {!l1Token || !l2Token} Error`
            );
            return;
          }
          const status = getStatus(currentStatus);
          const { blockTimestamps, transactionHashes } = getTransaction({
            currentStatus,
            sentMessage,
            stateBatchAppended,
            relayMessage: relayedMessageTx,
          });

          if (blockTimestamps instanceof Error) {
            return new Error("Invalid transaction with blockTimestamps");
          }

          const result: WithdrawTransactionHistory = {
            category: HISTORY_SORT.STANDARD,
            action: Action.Withdraw,
            status,
            inNetwork: isConnectedToMainNetwork
              ? SupportedChainId.TITAN
              : SupportedChainId.TITAN_SEPOLIA,
            outNetwork: isConnectedToMainNetwork
              ? SupportedChainId.MAINNET
              : SupportedChainId.SEPOLIA,
            inToken: l2Token,
            outToken: l1Token,
            blockNumber: Number(sentMessage.blockNumber),
            blockTimestamps,
            transactionHashes,
            resolved,
            stateBatchAppended,
          };

          return result;
        })
      );

      const filteredResult = result.filter(
        (tx) => !(tx instanceof Error) && tx !== undefined && tx !== null
      );
      const sortedResult = getSortedTxListByDate(
        filteredResult
      ) as WithdrawTransactionHistory[];
      if (sortedResult) {
        const newTitanWithdrawHistory = {
          ...titanWithdrawalHistory,
        };
        newTitanWithdrawHistory.history = sortedResult;
        setTitanWithdrawHistory(newTitanWithdrawHistory);
      }
    }
  }, [l2TitanData, isConnectedToMainNetwork, L2Provider]);

  const fetchThanosData = useCallback(async () => {
    if (
      l2ThanosData &&
      isConnectedToMainNetwork !== undefined &&
      ThanosProvider &&
      l1ThanosOptimismPortal &&
      l1ThanosData
    ) {
      const l2SentMessges = l2ThanosData.sentMessages;
      const latestL2OutputBlockNumber =
        l1ThanosData.outputProposeds[0].l2BlockNumber;
      const { withdrawalProvens, withdrawalFinalizeds } =
        l1ThanosOptimismPortal;
      const result: WithdrawTransactionHistory[] = await Promise.all(
        l2SentMessges.map(async (sentMessage: SentMessages) => {
          const resolved: Resolved = {
            target: sentMessage.target,
            sender: sentMessage.sender,
            message: sentMessage.message,
            messageNonce: sentMessage.messageNonce,
            gasLimit: sentMessage.gasLimit,
            transactionHash: sentMessage.transactionHash,
          };
          const l2TxReceipt = await ThanosProvider.getTransactionReceipt(
            sentMessage.transactionHash
          );
          const messagePassed = l2ThanosData.messagePasseds.find(
            (msg: any) => msg.transactionHash === sentMessage.transactionHash
          );
          const withdrawalProven = withdrawalProvens.find(
            (proven: any) =>
              proven.withdrawalHash === messagePassed.withdrawalHash
          );
          const withdrawalFinalized = withdrawalFinalizeds.find(
            (finalized: any) => {
              return finalized.withdrawalHash === messagePassed.withdrawalHash;
            }
          );
          const parsedLog = getDecodedStandardBridgeLog(
            l2TxReceipt.logs,
            new ethers.utils.Interface(L2ThanosStandardBridgeAbi),
            SupportedChainId.THANOS_SEPOLIA
          );
          if (!parsedLog) return;

          const { l1TokenAddress, l2TokenAddress, amount } = parsedLog;

          const { l1Token, l2Token } = getTransactionToken(
            l1TokenAddress.toLowerCase(),
            l2TokenAddress.toLowerCase(),
            amount,
            false,
            SupportedChainId.THANOS_SEPOLIA
          );

          const l1ChainId = SupportedChainId.SEPOLIA; // need to change when binding main net

          const l2ChainId = SupportedChainId.THANOS_SEPOLIA; // need to change when binding main net
          const status = await getThanosMessageStatuaWithSubgraph(
            withdrawalProvens,
            withdrawalFinalizeds,
            messagePassed.withdrawalHash,
            BigInt(sentMessage.blockNumber) <= BigInt(latestL2OutputBlockNumber)
          );

          const blockTimestamps = {
            initialCompletedTimestamp: Number(sentMessage.blockTimestamp),
            proveCompletedTimestamp: withdrawalProven?.blockTimestamp,
            finalizedCompletedTimestamp: withdrawalFinalized?.blockTimestamp,
          };
          const transactionHashes = {
            initialTransactionHash: sentMessage.transactionHash,
            proveTransactionHash: withdrawalProven?.transactionHash,
            finalizedTransactionHash: withdrawalFinalized?.transactionHash,
          };

          if (blockTimestamps instanceof Error || !l1Token || !l2Token) {
            console.log("Invalid transaction");
            return;
          }

          const result: WithdrawTransactionHistory = {
            category: HISTORY_SORT.STANDARD,
            action: Action.Withdraw,
            status: status,
            inNetwork: SupportedChainId.THANOS_SEPOLIA,
            outNetwork: SupportedChainId.SEPOLIA,
            inToken: l2Token,
            outToken: l1Token,
            blockNumber: Number(sentMessage.blockNumber),
            blockTimestamps,
            transactionHashes,
            resolved,
          };
          return result;
        })
      );

      const filteredResult = result.filter(
        (tx) => !(tx instanceof Error) && tx !== undefined && tx !== null
      );
      const sortedResult = getSortedTxListByDate(
        filteredResult
      ) as WithdrawTransactionHistory[];

      // Only update modal if status has changed
      if (thanosDepositWithdrawConfirmModal.isOpen && thanosDepositWithdrawConfirmModal.transaction) {
        const currentTx = thanosDepositWithdrawConfirmModal.transaction as StandardHistory;
        const updatedTx = sortedResult.find(tx =>
          tx.transactionHashes.initialTransactionHash === currentTx.transactionHashes.initialTransactionHash
        );

        if (updatedTx && updatedTx.status !== currentTx.status) {
          setThanosDepositWithdrawConfirmModal(prev => ({
            ...prev,
            transaction: updatedTx
          }));
        }
      }

      // Update history
      if (sortedResult) {
        setThanosWithdrawHistory(prev => ({
          ...prev,
          history: sortedResult
        }));
      }
    }
  }, [
    l2ThanosData,
    isConnectedToMainNetwork,
    ThanosProvider,
    l1ThanosOptimismPortal,
    l1ThanosData,
    thanosDepositWithdrawConfirmModal.isOpen,
    thanosDepositWithdrawConfirmModal.transaction
  ]);
  useEffect(() => {
    if (isConnectedToMainNetwork) {
      setThanosWithdrawHistory((prev) => {
        return {
          ...prev,
          history: [],
        };
      });
      setThanosWithdrawHistory((prev) => {
        return {
          ...prev,
          history: [],
        };
      });
    }
  }, [isConnectedToMainNetwork, setThanosWithdrawHistory, setTitanWithdrawHistory]);
  const getAllWithdrawData = useCallback(async () => {
    if (
      titanWithdrawalHistory.history ||
      thanosSepWithdrawHistory.history
    ) {

      const totalWithdrawResult = supportedChainOnProd.find((chain) => chain.chainId === SupportedChainId.THANOS_SEPOLIA) ? getSortedTxListByDate([
        ...(titanWithdrawalHistory.history ?? []),
        ...(thanosSepWithdrawHistory.history ?? []),
      ]) : getSortedTxListByDate([
        ...(titanWithdrawalHistory.history ?? []),
      ]);
      setWithdrawHistory(totalWithdrawResult as WithdrawTransactionHistory[]);
    }
  }, [titanWithdrawalHistory, thanosSepWithdrawHistory]);

  useEffect(() => {
    fetchTitanData().catch((error) => {
      console.error("Error in fetching titan withdraw data", error);
    });
  }, [fetchTitanData, pollTitanCount, isConnectedToMainNetwork]);

  useEffect(() => {
    if (pendingTxHashes.length > 0 || isConnectedToMainNetwork) return;
    if (!isSupportedOnProd(SupportedChainId.THANOS_SEPOLIA)) return;
    fetchThanosData().catch((error) => {
      console.error("Error in fetching thanos withdraw data", error);
    });
  }, [fetchThanosData, pollThanosCount, isConnectedToMainNetwork]);

  useEffect(() => {
    getAllWithdrawData();
  }, [getAllWithdrawData]);

  return { withdrawHistory };
};