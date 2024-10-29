import { thanosDepositHistory, titanDepositHistory } from "@/recoil/history/transaction";
import { Action, DepositTransactionHistory, HISTORY_SORT } from "@/staging/types/transaction";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { useTitanSubgraph } from "../subgraph/useTitanSubgraph";
import { useProvier } from "@/hooks/provider/useProvider";
import { useThanosSubgraph } from "../subgraph/useThanosSubgraph";
import useConnectedNetwork from "@/hooks/network";
import { Resolved, SentMessages } from "@/types/activity/history";
import { getCurrentDepositStatus } from "@/utils/history/getCurrentStatus";
import { getDecodedStandardBridgeLog } from "@/utils/history/getDecodeBridgeHistoryLog";
import { ethers } from "ethers";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import L1ThanosBridgeAbi from "@/abis/L1ThanosStandardBridge.json";
import L1TitanBridgeAbi from "@/abis/L1StandardBridge.json";
import L2ThanosStandardBridgeAbi from "@/constant/abis/L2ThanosStandardBridge.json";
import L2TitanStandardBridgeAbi from "@/constant/abis/L2StandardBridge.json";
import {
  getDepositStatus,
  getStatus,
  getTransaction,
  getTransactionToken,
} from "@/utils/history/getTransaction";
import { updatedHistory } from "./useBridgeHistory";
import { getSortedTxListByDate } from "@/staging/utils/history";

export const useDepositData = () => {
  const [thanosDipositHistory, setThanosDipositHistory] =
    useRecoilState(thanosDepositHistory);
  const [titanDipositHistory, setTitanDipositHistory] =
    useRecoilState(titanDepositHistory);
  const [depositHistory, setDepositHistory] = useState<
    DepositTransactionHistory[] | null
  >(null);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const {
    l1TitanData,
    pollCount: pollTitanCount,
    l2TitanRelayedMessages
  } = useTitanSubgraph();
  const { l1ThanosData, l2ThanosRelayedMessages, l1ThanosSentMsgExtensions, pollCount: pollThanosCount } = useThanosSubgraph();
  const { L1Provider } = useProvier();

  const fetchTitanData = useCallback(async () => {
    if (l1TitanData && isConnectedToMainNetwork !== undefined && L1Provider && l2TitanRelayedMessages) {

      const l1SentMessges = l1TitanData.sentMessages;
      const relayedMessages = l2TitanRelayedMessages.relayedMessages;
      let latestRelayedBlockNumber =
        titanDipositHistory.latestRelayedBlockNumber ?? "0";
      const result: DepositTransactionHistory[] = await Promise.all(
        l1SentMessges.map(async (sentMessage: SentMessages) => {
          const resolved: Resolved = {
            target: sentMessage.target,
            sender: sentMessage.sender,
            message: sentMessage.message,
            messageNonce: sentMessage.messageNonce,
            gasLimit: sentMessage.gasLimit,
            transactionHash: sentMessage.transactionHash,
          };
          const { currentStatus, relayedMessageTx } =
            getCurrentDepositStatus(
              resolved,
              "0",
              relayedMessages,
              "Titan"
            );

          const l1TxReceipt = await L1Provider.getTransactionReceipt(
            sentMessage.transactionHash
          );

          //using the logs of the tx receipt, we can determine the l1 token address and the l2 token address of the withdraw tx
          if (!l1TxReceipt) {
            console.error(
              `Invalid transaction (${sentMessage.transactionHash} with l1TxReceipt)`
            );
            return;
          }
          if (currentStatus > 3)
            latestRelayedBlockNumber = Math.max(
              Number(latestRelayedBlockNumber),
              Number(sentMessage.blockNumber)
            ).toString();

          const parsedLog = getDecodedStandardBridgeLog(
            l1TxReceipt.logs,
            new ethers.utils.Interface(L1TitanBridgeAbi),
            isConnectedToMainNetwork
              ? SupportedChainId.TITAN
              : SupportedChainId.TITAN_SEPOLIA
          );

          if (!parsedLog) {
            console.error(`Invalid transaction with parsedLog Error`);
            return;
          }

          const { l1TokenAddress, l2TokenAddress, amount, from, to } =
            parsedLog;

          const { l1Token, l2Token } = getTransactionToken(
            l1TokenAddress,
            l2TokenAddress,
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

          const status = getDepositStatus(currentStatus);
          const { blockTimestamps, transactionHashes } = getTransaction({
            currentStatus,
            sentMessage,
            relayMessage: relayedMessageTx,
          });

          if (blockTimestamps instanceof Error) {
            console.error(`Invalid transaction with blockTimestamps Error`);
            return;
          }

          const result: DepositTransactionHistory = {
            category: HISTORY_SORT.STANDARD,
            action: Action.Deposit,
            status: status,
            inNetwork: isConnectedToMainNetwork
              ? SupportedChainId.MAINNET
              : SupportedChainId.SEPOLIA,
            outNetwork: isConnectedToMainNetwork
              ? SupportedChainId.TITAN
              : SupportedChainId.TITAN_SEPOLIA,
            inToken: l1Token,
            outToken: l2Token,
            blockTimestamps,
            transactionHashes,
            fromAddress: from,
            toAddress: to,
          };
          return result;
        })
      );

      const filteredResult = result.filter((tx) => {
        if (!(tx instanceof Error) && tx !== undefined && tx !== null)
          return tx;
      });
      const sortedResult = filteredResult.sort(
        (currentTx, previousTx) =>
          previousTx.blockTimestamps.initialCompletedTimestamp -
          currentTx.blockTimestamps.initialCompletedTimestamp
      );
      if (filteredResult) {
        const newTitanDipositHistory = {
          ...titanDipositHistory,
        };
        newTitanDipositHistory.latestBlockNumber =
          (l1TitanData?.sentMessages?.length ?? 0) > 0
            ? l1TitanData.sentMessages[0].blockNumber
            : newTitanDipositHistory.latestBlockNumber;
        newTitanDipositHistory.history = updatedHistory(
          titanDipositHistory.history,
          sortedResult
        ) as DepositTransactionHistory[];
        newTitanDipositHistory.latestRelayedBlockNumber = latestRelayedBlockNumber;
        setTitanDipositHistory(newTitanDipositHistory);
      }
    }
  }, [l1TitanData, isConnectedToMainNetwork, L1Provider, pollTitanCount, l2TitanRelayedMessages]);

  const fetchThanosData = useCallback(async () => {
    if (
      l1ThanosData &&
      isConnectedToMainNetwork !== undefined &&
      !isConnectedToMainNetwork &&
      L1Provider &&
      l2ThanosRelayedMessages &&
      l1ThanosSentMsgExtensions
    ) {
      const l1SentMessges = l1ThanosData.sentMessages;
      const relayedMessages = l2ThanosRelayedMessages.relayedMessages;
      const msgExtentions = l1ThanosSentMsgExtensions.sentMessageExtension1S;
      let latestRelayedBlockNumber =
        thanosDipositHistory.latestRelayedBlockNumber ?? "0";
      const result: DepositTransactionHistory[] = await Promise.all(
        l1SentMessges.map(async (sentMessage: SentMessages) => {
          const resolved: Resolved = {
            target: sentMessage.target,
            sender: sentMessage.sender,
            message: sentMessage.message,
            messageNonce: sentMessage.messageNonce,
            gasLimit: sentMessage.gasLimit,
            transactionHash: sentMessage.transactionHash,
          };
          const msgExt = msgExtentions.find(
            (msg: any) => msg.transactionHash === resolved.transactionHash
          );
          const { currentStatus, relayedMessageTx } =
            getCurrentDepositStatus(
              resolved,
              msgExt.value,
              relayedMessages,
              "Thanos"
            );
          const l1TxReceipt = await L1Provider.getTransactionReceipt(
            sentMessage.transactionHash
          );

          if (currentStatus > 3)
            latestRelayedBlockNumber = Math.max(
              Number(latestRelayedBlockNumber),
              Number(sentMessage.blockNumber)
            ).toString();
          const parsedLog = getDecodedStandardBridgeLog(
            l1TxReceipt.logs,
            new ethers.utils.Interface(L1ThanosBridgeAbi),
            SupportedChainId.THANOS_SEPOLIA
          );
          if (!parsedLog) return;
          const { l1TokenAddress, l2TokenAddress, amount, from, to } =
            parsedLog;
          const { l1Token, l2Token } = getTransactionToken(
            l1TokenAddress,
            l2TokenAddress,
            amount,
            true,
            isConnectedToMainNetwork
              ? SupportedChainId.MAINNET
              : SupportedChainId.SEPOLIA
          );
          if (!l1Token || !l2Token) return;

          const status = getStatus(currentStatus);
          const { blockTimestamps, transactionHashes } = getTransaction({
            currentStatus,
            sentMessage,
            relayMessage: relayedMessageTx,
          });

          if (blockTimestamps instanceof Error) {
            return;
          }

          const result: DepositTransactionHistory = {
            category: HISTORY_SORT.STANDARD,
            action: Action.Deposit,
            status: status,
            inNetwork: SupportedChainId.SEPOLIA,
            outNetwork: SupportedChainId.THANOS_SEPOLIA,
            inToken: l2Token,
            outToken: l1Token,
            blockTimestamps,
            transactionHashes,
            fromAddress: from,
            toAddress: to,
          };
          return result;
        })
      );
      const filteredResult = result.filter((tx) => {
        if (!(tx instanceof Error) && tx !== undefined && tx !== null)
          return tx;
      });
      const sortedResult = filteredResult.sort(
        (currentTx, previousTx) =>
          previousTx.blockTimestamps.initialCompletedTimestamp -
          currentTx.blockTimestamps.initialCompletedTimestamp
      );
      if (sortedResult) {
        const newThanosDipositHistory = {
          ...thanosDipositHistory,
        };
        newThanosDipositHistory.latestBlockNumber =
          (l1ThanosData?.sentMessages?.length ?? 0) > 0
            ? l1ThanosData.sentMessages[0].blockNumber
            : newThanosDipositHistory.latestBlockNumber;
        newThanosDipositHistory.history = updatedHistory(
          thanosDipositHistory.history,
          sortedResult
        ) as DepositTransactionHistory[];
        newThanosDipositHistory.latestRelayedBlockNumber =
          latestRelayedBlockNumber;
        setThanosDipositHistory(newThanosDipositHistory);
      }
    }
  }, [
    l1ThanosData,
    isConnectedToMainNetwork,
    L1Provider,
    l2ThanosRelayedMessages,
    pollThanosCount
  ]);

  const getAllDepositeData = useCallback(async () => {
    if (
      titanDipositHistory.history &&
      thanosDipositHistory.history
    ) {
      const totalDepositResult = getSortedTxListByDate([
        ...(titanDipositHistory.history ?? []),
        ...(thanosDipositHistory.history ?? []),
      ]);
      setDepositHistory(totalDepositResult as DepositTransactionHistory[]);
    }
  }, [titanDipositHistory, thanosDipositHistory]);

  useEffect(() => {
    if (isConnectedToMainNetwork) {
      setThanosDipositHistory((prev) => {
        return {
          ...prev,
          history: [],
        };
      });
    }
  }, [isConnectedToMainNetwork, setThanosDipositHistory, setTitanDipositHistory]);

  useEffect(() => {
    fetchTitanData().catch((error) => {
      console.error("Error in fetching titan deposit data", error);
    });
  }, [fetchTitanData, pollTitanCount]);

  useEffect(() => {
    if (isConnectedToMainNetwork) return;
    fetchThanosData().catch((error) => {
      console.error("Error in fetching thanos deposit data", error);
    });
  }, [fetchThanosData, pollThanosCount]);

  useEffect(() => {
    getAllDepositeData();
  }, [getAllDepositeData]);

  return { depositHistory };
};
