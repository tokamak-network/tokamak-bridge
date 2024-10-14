import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Action,
  CT_ACTION,
  CT_History,
  CT_Provide_History,
  CT_Request_History,
  DepositTransactionHistory,
  HISTORY_SORT,
  isInCT_REQUEST_CANCEL,
  StandardHistory,
  Status,
  TransactionHistory,
  WithdrawTransactionHistory,
} from "../types/transaction";
import { ApolloError, useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { subgraphApolloClientsForHistory } from "@/graphql/thegraph/apolloForHistory";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  MAINNET_CONTRACTS,
  SEPOLIA_CONTRACTS,
  THANOS_SEPOLIA_CONTRACTS,
} from "@/constant/contracts";
import {
  FETCH_USER_TRANSACTIONS_L1_THANOS,
  FETCH_USER_TRANSACTIONS_L1_TITAN,
  FETCH_USER_TRANSACTIONS_L2,
  FETCH_USER_TRANSACTIONS_L2_THANOS,
} from "@/graphql/queries/history";
import { Resolved, SentMessages } from "@/types/activity/history";
import {
  getCurrentDepositStatus,
  getCurrentThanosDepositStatus,
  getCurretStatus,
  getThanosDepositMsgHashes,
} from "@/utils/history/getCurrentStatus";
import { useProvier } from "@/hooks/provider/useProvider";
import { utils } from "ethers";
import {
  getDecodedValueFromThanosLogs,
  getDecodeLog,
} from "@/utils/history/getDecodeLog";
import { formatAddress } from "@/utils/trim/formatAddress";
import {
  getStatus,
  getTransaction,
  getTransactionToken,
} from "@/utils/history/getTransaction";
import { useCrossTradeData_L1, useCrossTradeData_L2 } from "./useCrossTrade";
import {
  getEditCTTransaction,
  getProvideErrorMessage,
  getRequestBlockTimestamp,
  getRequestErrorMessage,
  getRequestStatus,
  getRequestTransactionHash,
  getTokenInfo,
  isRequestEdited,
} from "../utils/getRequestStatus";
import {
  getL2TransactionsBySaleCount,
  getProvideBlockTimestamp,
  getProvideStatus,
  getProvideTransactionHash,
} from "../utils/getProvideStatus";
import { getDecodedStandardBridgeLog } from "@/utils/history/getDecodeBridgeHistoryLog";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  historyRefetch,
  thanosSepoliaDepositHistory,
  thanosSepoliaWithdrawHistory,
  titanSepoliaDepositHistory,
} from "@/recoil/history/transaction";
import {
  getBridgeL1ChainId,
  getBridgeL2ChainId,
} from "../components/new-confirm/utils";
import {
  getThanosMessageStatuaWithSubgraph,
  getThanosMessageStatus,
} from "../utils/getMessageStatus";
import {
  GET_RelayedMessages,
  GET_SentMessageExtensions,
  GET_withdrawalProvens_withdrawalFinalizeds,
} from "@/graphql/data/queries";
import { transactionData } from "@/recoil/global/transaction";
import {
  pendingTransactionHashes,
  thanosDepositWithdrawConfirmModalStatus,
} from "@/recoil/modal/atom";
import useDepositWithdrawConfirm from "../components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import { getSortedTxHistory, getSortedTxListByDate } from "../utils/history";
import { mock_cancelRequest } from "@/test/crosstrade/_mock/mockdata";
import { l2Provider } from "@/config/l2Provider";
import L1ThanosBridgeAbi from "@/abis/L1ThanosStandardBridge.json";
import L1TitanBridgeAbi from "@/abis/L1StandardBridge.json";
import L2ThanosStandardBridgeAbi from "@/constant/abis/L2ThanosStandardBridge.json";
import { ethers } from "ethers";

const getApolloClient = (chainId: number) => {
  return subgraphApolloClientsForHistory[chainId];
};

const useGetApolloClient = () => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const apolloClient = useMemo(() => {
    if (isConnectedToMainNetwork) {
      return {
        L1_CLIENT: getApolloClient(SupportedChainId.MAINNET),
        L2_CLIENT: getApolloClient(SupportedChainId.TITAN),
        L2_THANOS_CLIENT: getApolloClient(SupportedChainId.THANOS_SEPOLIA), // need to update when thanos main net comes out
      };
    }
    return {
      L1_CLIENT: getApolloClient(SupportedChainId.SEPOLIA),
      L2_CLIENT: getApolloClient(SupportedChainId.TITAN_SEPOLIA),
      L2_THANOS_CLIENT: getApolloClient(SupportedChainId.THANOS_SEPOLIA),
    };
  }, [isConnectedToMainNetwork]);

  return apolloClient;
};

const errorHandler = (error: ApolloError) => {
  if (error) {
    // Log the error to the console for debugging
    console.error("Apollo Error occurred:", error);

    // Check for GraphQL errors
    if (error.graphQLErrors.length > 0) {
      error.graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    // Check for network errors
    if (error.networkError) {
      console.log(`[Network error]: ${error.networkError}`);
    }

    // Here, you can also update your UI accordingly
    // For example, show an error message to the user
  }
};

export const useSubgraph = () => {
  const { address } = useAccount();
  const { L1_CLIENT, L2_CLIENT, L2_THANOS_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const [thanosSepoliaDipositHistory, setThanosSepoliaDipositHistory] =
    useRecoilState(thanosSepoliaDepositHistory);

  const [titanSepoliaDipositHistory, setTitanSepoliaDipositHistory] =
    useRecoilState(titanSepoliaDepositHistory);

  const [thanosSepWithdrawHistory, setThanosSepoliaWithdrawHistory] =
    useRecoilState(thanosSepoliaWithdrawHistory);

  const L1Bridge = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Bridge
    : SEPOLIA_CONTRACTS.L1Bridge_TITAN_SEPOLIA;

  const L1StandardBridgeForThanos = SEPOLIA_CONTRACTS.L1Bridge_THANOS_SEPOLIA;
  const L1USDCBridgeForThanos = SEPOLIA_CONTRACTS.L1USDCBridge_THANOS_SEPOLIA;

  const {
    data: _l1TitanData,
    loading: _l1TitanLoading,
    error: _l1TitanError,
  } = useQuery(FETCH_USER_TRANSACTIONS_L1_TITAN, {
    variables: {
      formattedAddress: formatAddress(address),
      L1Bridge,
      account: address,
      blockNumber: titanSepoliaDipositHistory.latestBlockNumber,
    },
    pollInterval: 13000,
    client: L1_CLIENT[0],
  });
  const {
    data: _l2Titan,
    loading: _l2TitanLoading,
    error: _l2TitanError,
  } = useQuery(FETCH_USER_TRANSACTIONS_L2, {
    variables: {
      formattedAddress: formatAddress(address),
      L1Bridge,
      account: address,
    },
    pollInterval: 13000,
    client: L2_CLIENT[0],
  });
  const {
    data: _l1ThanosData,
    loading: _l1ThanosLoading,
    error: _l1ThanosError,
  } = useQuery(FETCH_USER_TRANSACTIONS_L1_THANOS, {
    variables: {
      formattedAddress: formatAddress(address),
      L1StandardBridge: L1StandardBridgeForThanos,
      L1UsdcBridge: L1USDCBridgeForThanos,
      account: address,
      remoteToken: THANOS_SEPOLIA_CONTRACTS.TON_ADDRESS,
      blockNumber: thanosSepoliaDipositHistory.latestRelayedBlockNumber,
    },
    pollInterval: 5000,
    client: L1_CLIENT[1],
  });
  const l1ThanosDepositSentMessages = !_l1ThanosData
    ? null
    : _l1ThanosData?.sentMessages ?? [];
  const l1ThanosDepositTxHashes = !l1ThanosDepositSentMessages
    ? null
    : l1ThanosDepositSentMessages.map((msg: any) => msg.transactionHash);
  const {
    data: _l1ThanosSentMessageExtensionsData,
    loading: _l1ThanosSentMessageExtensionsLoading,
    error: _l1ThanosSentMessageExtensionsError,
  } = useQuery(GET_SentMessageExtensions, {
    variables: {
      transactionHashes: l1ThanosDepositTxHashes,
      blockNumber: thanosSepoliaDipositHistory.latestRelayedBlockNumber,
    },
    pollInterval: 5000,
    client: L1_CLIENT[1],
    skip: !l1ThanosDepositTxHashes,
  });
  const l1ThanosDepositMessageHashes = getThanosDepositMsgHashes(
    l1ThanosDepositSentMessages,
    _l1ThanosSentMessageExtensionsData?.sentMessageExtension1S ?? []
  );
  const {
    data: _l2ThanosRelayedMessageData,
    loading: _l2ThanosRelayedMessageLoading,
    error: _l2ThanosRelayedMessageError,
  } = useQuery(GET_RelayedMessages, {
    variables: {
      msgHashes: l1ThanosDepositMessageHashes,
    },
    pollInterval: 5000,
    client: L2_THANOS_CLIENT[0],
    skip: !l1ThanosDepositMessageHashes,
  });

  const {
    data: _l2Thanos,
    loading: _l2ThanosLoading,
    error: _l2ThanosError,
  } = useQuery(FETCH_USER_TRANSACTIONS_L2_THANOS, {
    variables: {
      formattedAddress: formatAddress(address),
      L1StandardBridge: L1StandardBridgeForThanos,
      account: address,
    },
    pollInterval: 5000,
    client: L2_THANOS_CLIENT[0],
  });

  const messagePasseds = _l2Thanos?.messagePasseds ?? [];
  const withdrawalHashes = messagePasseds.map((msg: any) => msg.withdrawalHash);
  const {
    data: _l1ThanosOptimismPortal,
    loading: _l1ThanosOptimismPortalLoading,
    error: _l1ThanosOptimismPortalError,
  } = useQuery(GET_withdrawalProvens_withdrawalFinalizeds, {
    variables: { withdrawalHashes: withdrawalHashes },
    pollInterval: 1000,
    client: L1_CLIENT[1],
    // skip: !_l2Thanos?.messagePassed,
  });

  useEffect(() => {
    if (_l1TitanError) {
      errorHandler(_l1TitanError);
    }
    if (_l2TitanError) {
      errorHandler(_l2TitanError);
    }
    if (_l1ThanosError) {
      errorHandler(_l1ThanosError);
    }
    if (_l2ThanosError) {
      errorHandler(_l2ThanosError);
    }
    if (_l1ThanosOptimismPortalError) {
      errorHandler(_l1ThanosOptimismPortalError);
    }
    if (_l1ThanosSentMessageExtensionsError) {
      errorHandler(_l1ThanosSentMessageExtensionsError);
    }
    if (_l2ThanosRelayedMessageError) {
      errorHandler(_l2ThanosRelayedMessageError);
    }
  }, [
    _l1TitanError,
    _l2TitanError,
    _l2ThanosError,
    _l1ThanosOptimismPortalError,
    _l1ThanosSentMessageExtensionsError,
    _l2ThanosRelayedMessageError,
  ]);
  return {
    l1TitanData: _l1TitanData,
    l1TitanLoading: _l1TitanLoading,
    l1Titanerror: _l1TitanError,
    l1ThanosData: _l1ThanosData,
    l1ThanosLoading: _l1ThanosLoading,
    l1Thanoserror: _l1ThanosError,
    l2TitanData: _l2Titan,
    l2ThanosData: _l2Thanos,
    l1ThanosOptimismPortal: _l1ThanosOptimismPortal,
    l1ThanosSentMsgExtensions: _l1ThanosSentMessageExtensionsData,
    l2ThanosRelayedMessages: _l2ThanosRelayedMessageData,
  };
};

export const useWithdrawData = () => {
  const [withdrawHistory, setWithdrawHistory] = useState<
    WithdrawTransactionHistory[] | [] | null
  >(null);
  const [refetchHistory, setRefetchHistory] = useRecoilState(historyRefetch);

  const { l2TitanData, l2ThanosData, l1ThanosOptimismPortal, l1ThanosData } =
    useSubgraph();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { L2Provider, ThanosProvider } = useProvier();
  const [thanosSepWithdrawHistory, setThanosSepoliaWithdrawHistory] =
    useRecoilState(thanosSepoliaWithdrawHistory);
  const [
    thanosDepositWithdrawConfirmModal,
    setThanosDepositWithdrawConfirmModal,
  ] = useRecoilState(thanosDepositWithdrawConfirmModalStatus);
  const [pendingTxHashes, setPendingTxHashes] = useRecoilState(
    pendingTransactionHashes
  );

  const fetchData = useCallback(async () => {
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
            l2TxReceipt.logs[3] === undefined ||
            currentStatus === undefined
          ) {
            return new Error(
              "Invalid transaction with l2TxReceipt.logs[3] or currentStatus"
            );
          }

          const logs = utils.defaultAbiCoder.decode(
            ["address", "uint256", "bytes"],
            l2TxReceipt.logs[3] && l2TxReceipt.logs[3]?.data
          );
          const l1TokenAddress = utils.defaultAbiCoder.decode(
            ["address"],
            l2TxReceipt.logs[3] && l2TxReceipt.logs[3]?.topics[1]
          )[0];
          const l2TokenAddress = utils.defaultAbiCoder.decode(
            ["address"],
            l2TxReceipt.logs[3] && l2TxReceipt.logs[3]?.topics[2]
          )[0];
          const amount = BigInt(logs[1]).toString();
          const { l1Token, l2Token } = getTransactionToken(
            l1TokenAddress,
            l2TokenAddress,
            amount,
            false,
            isConnectedToMainNetwork
              ? SupportedChainId.TITAN
              : SupportedChainId.TITAN_SEPOLIA
          );
          if (!l1Token || !l2Token) return;
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
            status: status,
            inNetwork: SupportedChainId.TITAN,
            outNetwork: SupportedChainId.MAINNET,
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
      const sortedResult = filteredResult.sort(
        (currentTx, previousTx) =>
          previousTx.blockTimestamps.initialCompletedTimestamp -
          currentTx.blockTimestamps.initialCompletedTimestamp
      );

      if (sortedResult) return setWithdrawHistory(sortedResult);
      return setWithdrawHistory([]);
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
            sentMessage.blockNumber <= latestL2OutputBlockNumber
          );
          // const status = Status.Initiate;

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
      const updatedTxOnConfirmModal = sortedResult.find(
        (tx) =>
          tx.transactionHashes.initialTransactionHash ===
          (thanosDepositWithdrawConfirmModal.transaction as StandardHistory)
            ?.transactionHashes.initialTransactionHash
      );
      if (updatedTxOnConfirmModal && thanosDepositWithdrawConfirmModal.isOpen)
        setThanosDepositWithdrawConfirmModal((prev) => ({
          ...prev,
          transaction: updatedTxOnConfirmModal,
        }));
      if (sortedResult) {
        const newThanosWithdrawHistory = {
          ...thanosSepWithdrawHistory,
        };
        newThanosWithdrawHistory.history = sortedResult;
        setThanosSepoliaWithdrawHistory(newThanosWithdrawHistory);
      }
    }
  }, [
    l2ThanosData,
    isConnectedToMainNetwork,
    ThanosProvider,
    l1ThanosOptimismPortal,
    l1ThanosData,
    refetchHistory,
    thanosDepositWithdrawConfirmModal.transaction,
  ]);

  // useEffect(() => {
  //   fetchData().catch((error) => {
  //     console.error("Error in fetching withdraw data", error);
  //   });
  // }, [l2TitanData, isConnectedToMainNetwork, L2Provider]);

  useEffect(() => {
    if (pendingTxHashes.length > 0) return;
    fetchThanosData().catch((error) => {
      console.error("Error in fetching withdraw data", error);
    });
  }, [
    l2ThanosData,
    isConnectedToMainNetwork,
    ThanosProvider,
    l1ThanosOptimismPortal,
    refetchHistory,
  ]);

  return { withdrawHistory: thanosSepWithdrawHistory.history };
};

export const useDepositData = () => {
  const [thanosSepoliaDipositHistory, setThanosSepoliaDipositHistory] =
    useRecoilState(thanosSepoliaDepositHistory);
  const [titanSepoliaDipositHistory, setTitanSepoliaDipositHistory] =
    useRecoilState(titanSepoliaDepositHistory);
  const [depositHistory, setDepositHistory] = useState<
    DepositTransactionHistory[] | null
  >(null);
  const [refetchHistory, setRefetchHistory] = useRecoilState(historyRefetch);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const {
    l1TitanData,
    l1ThanosData,
    l2ThanosRelayedMessages,
    l1ThanosSentMsgExtensions,
  } = useSubgraph();
  const { L1Provider } = useProvier();

  const fetchTitanData = useCallback(async () => {
    if (l1TitanData && isConnectedToMainNetwork !== undefined && L1Provider) {
      const l1SentMessges = l1TitanData.sentMessages;
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
            await getCurrentDepositStatus(
              resolved,
              isConnectedToMainNetwork,
              "Titan",
              "0"
            );

          const l1TxReceipt = await L1Provider.getTransactionReceipt(
            sentMessage.transactionHash
          );

          //using the logs of the tx receipt, we can determine the l1 token address and the l2 token address of the withdraw tx
          if (!l1TxReceipt || !currentStatus) {
            new Error(`Invalid transaction (${sentMessage.transactionHash})`);
            return;
          }

          const parsedLog = getDecodedStandardBridgeLog(
            l1TxReceipt.logs,
            new ethers.utils.Interface(L1TitanBridgeAbi),
            isConnectedToMainNetwork
              ? SupportedChainId.TITAN
              : SupportedChainId.TITAN_SEPOLIA
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
            inNetwork: SupportedChainId.MAINNET,
            outNetwork: SupportedChainId.TITAN,
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
      if (filteredResult) {
        const newTitanDipositHistory = {
          ...titanSepoliaDipositHistory,
        };
        newTitanDipositHistory.latestBlockNumber =
          (l1TitanData?.sentMessages?.length ?? 0) > 0
            ? l1TitanData.sentMessages[0].blockNumber
            : newTitanDipositHistory.latestBlockNumber;
        newTitanDipositHistory.history = [
          ...(newTitanDipositHistory.history ?? []),
          ...filteredResult,
        ];
        setTitanSepoliaDipositHistory(newTitanDipositHistory);
      }
    }
  }, [l1TitanData, isConnectedToMainNetwork, L1Provider]);

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
        thanosSepoliaDipositHistory.latestRelayedBlockNumber ?? "0";
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
            getCurrentThanosDepositStatus(
              resolved,
              msgExt.value,
              relayedMessages
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
          ...thanosSepoliaDipositHistory,
        };
        newThanosDipositHistory.latestBlockNumber =
          (l1ThanosData?.sentMessages?.length ?? 0) > 0
            ? l1ThanosData.sentMessages[0].blockNumber
            : newThanosDipositHistory.latestBlockNumber;
        newThanosDipositHistory.history = updatedHistory(
          thanosSepoliaDipositHistory.history,
          sortedResult
        ) as DepositTransactionHistory[];
        newThanosDipositHistory.latestRelayedBlockNumber =
          latestRelayedBlockNumber;
        setThanosSepoliaDipositHistory(newThanosDipositHistory);
      }
    }
  }, [
    l1ThanosData,
    isConnectedToMainNetwork,
    L1Provider,
    refetchHistory,
    l2ThanosRelayedMessages,
  ]);

  const getAllDepositeData = useCallback(async () => {
    if (
      titanSepoliaDipositHistory.history &&
      thanosSepoliaDipositHistory.history
    ) {
      const totalDepositResult = getSortedTxListByDate([
        ...(titanSepoliaDipositHistory.history ?? []),
        ...(thanosSepoliaDipositHistory.history ?? []),
      ]);
      setDepositHistory(totalDepositResult as DepositTransactionHistory[]);
    }
  }, [titanSepoliaDipositHistory, thanosSepoliaDipositHistory]);

  useEffect(() => {
    if (isConnectedToMainNetwork) {
      setThanosSepoliaDipositHistory((prev) => {
        return {
          ...prev,
          history: [],
        };
      });
    }
  }, [isConnectedToMainNetwork, setThanosSepoliaDipositHistory]);

  useEffect(() => {
    fetchTitanData().catch((error) => {
      console.error("Error in fetching titan deposit data", error);
    });
  }, [fetchTitanData]);

  useEffect(() => {
    fetchThanosData().catch((error) => {
      console.error("Error in fetching thanos deposit data", error);
    });
  }, [fetchThanosData]);

  useEffect(() => {
    getAllDepositeData();
  }, [getAllDepositeData]);

  return { depositHistory };
};

export const useRequestHistoryData = () => {
  const [requestHistory, setRequestHistory] = useState<
    CT_Request_History[] | [] | null
  >(null);
  const { data: l2Data } = useCrossTradeData_L2({
    isHistory: true,
  });
  const { data: l1Data } = useCrossTradeData_L1({
    isHistory: true,
  });
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  useEffect(() => {
    if (l2Data && l1Data) {
      const requestCTs = l2Data.requestCTs;
      const cancelCTs = l2Data.cancelCTs;
      const providerClaimCTs = l2Data.providerClaimCTs;
      const editCTs = l1Data.editCTs;
      const l1CancelCTs = l1Data.l1CancelCTs;

      const trimedData = requestCTs.map((requestData) => {
        const {
          _l1token,
          _l2token,
          _requester,
          _totalAmount,
          _ctAmount,
          _saleCount,
          _hashValue,
          _l2chainId,
          blockTimestamp,
        } = requestData;

        const status = getRequestStatus({
          requestData,
          cancelCTs,
          l1CancelCTs,
          providerClaimCTs,
          editCTs,
        });

        const isUpdateFee = isRequestEdited({
          editCTs,
          saleCount: _saleCount,
        });
        const editCT = getEditCTTransaction({
          editCTs,
          saleCount: _saleCount,
        })[0];

        const blockTimestamps = getRequestBlockTimestamp({
          status,
          requestData,
          l1CancelCTs,
          cancelCTs,
          providerClaimCTs,
          editCTs,
        });
        const inToken = getTokenInfo({ requestData });
        const outToken = getTokenInfo({
          requestData,
          ctAmount: true,
          _editedctAmount: isUpdateFee ? editCT._ctAmount : undefined,
        });
        const transactionHashes = getRequestTransactionHash({
          status,
          requestData,
          l1CancelCTs,
          cancelCTs,
          providerClaimCTs,
          editCTs,
        });

        const ctAmount = isUpdateFee
          ? BigInt(editCT._ctAmount)
          : BigInt(_ctAmount);
        const serviceFee = BigInt(_totalAmount) - ctAmount;

        if (!blockTimestamps || !transactionHashes) return null;

        const hasMultipleUpdateFees = () => {
          if (!isUpdateFee) return false;
          if (blockTimestamps && blockTimestamps.updateFee)
            return blockTimestamps.updateFee.length > 1;
        };

        const result: CT_Request_History = {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.REQUEST,
          isCanceled: isInCT_REQUEST_CANCEL(status),
          status,
          blockTimestamps,
          inNetwork: Number(_l2chainId),
          outNetwork: isConnectedToMainNetwork
            ? SupportedChainId.MAINNET
            : SupportedChainId.SEPOLIA,
          inToken,
          outToken,
          transactionHashes,
          serviceFee,
          L2_subgraphData: requestData,
          isUpdateFee,
          hasMultipleUpdateFees: hasMultipleUpdateFees(),
          errorMessage: getRequestErrorMessage(status, blockTimestamps),
        };
        return result;
      });

      const result = trimedData.filter((data) => data !== null);
      // const result = [mock_cancelRequest];
      setRequestHistory(result as CT_Request_History[]);
    }
  }, [l1Data, l2Data, isConnectedToMainNetwork]);

  return { requestHistory };
};

export const useProvideData = () => {
  const [provideHistory, setProvideHistory] = useState<
    CT_Provide_History[] | [] | null
  >(null);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data: l1Data } = useCrossTradeData_L1({
    isHistory: true,
  });
  const { data: l2Data } = useCrossTradeData_L2({
    isHistory: true,
  });

  useEffect(() => {
    if (l1Data && l2Data) {
      const requestCTs = l2Data.requestCTs;
      const providerClaimCTs = l2Data.providerClaimCTs;
      const provideCTs = l1Data.provideCTs;

      const trimedData: CT_Provide_History[] = provideCTs.map((provideCT) => {
        const {
          _l1token,
          _l2token,
          _provider,
          _totalAmount,
          _ctAmount,
          _saleCount,
          _l2chainId,
          blockTimestamp,
        } = provideCT;
        const saleCount = _saleCount;

        const status = getProvideStatus({
          providerClaimCTs,
          provideCT,
        });
        const providerClaimCTTransaction = getL2TransactionsBySaleCount({
          transactions: providerClaimCTs,
          saleCount,
        });
        const blockTimestamps = getProvideBlockTimestamp({
          status,
          provideCT,
          providerClaimCT: providerClaimCTTransaction,
        });
        const inToken = getTokenInfo({
          requestData: provideCT,
          ctAmount: true,
        });
        const outToken = getTokenInfo({
          requestData: provideCT,
        });
        const transactionHashes = getProvideTransactionHash({
          status,
          provideCT,
          providerClaimCT: providerClaimCTTransaction,
        });
        const serviceFee = BigInt(_totalAmount) - BigInt(_ctAmount);

        return {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.PROVIDE,
          status,
          blockTimestamps,
          inNetwork: isConnectedToMainNetwork
            ? SupportedChainId.MAINNET
            : SupportedChainId.SEPOLIA,
          outNetwork: Number(_l2chainId),
          inToken,
          outToken,
          transactionHashes,
          serviceFee,
          errorMessage: getProvideErrorMessage(status, blockTimestamps),
          L1_subgraphData: provideCT,
        };
      });

      setProvideHistory(trimedData);
    }
  }, [l1Data, l2Data]);

  return { provideHistory };
};

export const useBridgeHistory = () => {
  const { depositHistory } = useDepositData();
  const { withdrawHistory } = useWithdrawData();
  const { requestHistory } = useRequestHistoryData();
  const { provideHistory } = useProvideData();

  const bridgeHistoryData = useMemo(() => {
    if (depositHistory && withdrawHistory) {
      // Ensure both arrays are of a compatible type
      const combinedHistory: TransactionHistory[] = [
        ...(depositHistory as TransactionHistory[]),
        ...(withdrawHistory as TransactionHistory[]),
      ];

      return combinedHistory;
    }
  }, [depositHistory, withdrawHistory]);

  const CT_HistoryData = useMemo(() => {
    if (requestHistory && provideHistory) {
      // Ensure both arrays are of a compatible type
      const combinedHistory: CT_History[] = [
        ...(requestHistory as CT_Request_History[]),
        ...(provideHistory as CT_Provide_History[]),
      ];

      return combinedHistory;
    }
  }, [requestHistory, provideHistory]);

  return {
    depositHistory,
    withdrawHistory,
    bridgeHistoryData,
    requestHistory,
    provideHistory,
    CT_HistoryData,
  };
};

const updatedHistory = (
  legacyHistory: StandardHistory[] | null,
  historyToUpdate: StandardHistory[]
) => {
  if (historyToUpdate.length === 0) return legacyHistory ?? [];
  const firstBlocktimeStampToUpdate =
    historyToUpdate[historyToUpdate.length - 1].blockTimestamps;

  return [
    ...historyToUpdate,
    ...(legacyHistory ?? []).filter(
      (tx) =>
        tx.blockTimestamps.initialCompletedTimestamp <
        firstBlocktimeStampToUpdate.initialCompletedTimestamp
    ),
  ];
};
