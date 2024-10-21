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
  TransactionHistory,
  WithdrawTransactionHistory,
} from "../types/transaction";
import { ApolloError, useQuery } from "@apollo/client";
import { useAccount } from "wagmi";
import { subgraphApolloClientsForHistory } from "@/graphql/thegraph/apolloForHistory";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { MAINNET_CONTRACTS, SEPOLIA_CONTRACTS } from "@/constant/contracts";
import {
  FETCH_USER_TRANSACTIONS_L1,
  FETCH_USER_TRANSACTIONS_L2,
} from "@/graphql/queries/history";
import { Resolved, SentMessages } from "@/types/activity/history";
import {
  getCurrentDepositStatus,
  getCurretStatus,
} from "@/utils/history/getCurrentStatus";
import { useProvier } from "@/hooks/provider/useProvider";
import { ethers, utils } from "ethers";
import { formatAddress } from "@/utils/trim/formatAddress";
import {
  getDepositStatus,
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
import { mock_cancelRequest } from "@/test/crosstrade/_mock/mockdata";
import L1TitanBridgeAbi from "@/abis/L1StandardBridge.json";
import { getDecodedDepositLog } from "@/utils/history/getDecodedDepositLog";
import { mock_depositRequest } from "@/test/deposit/_mock/mockdata";
import { mock_withdrawData } from "@/test/withdraw/_mock/mockdata";

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
      };
    }
    return {
      L1_CLIENT: getApolloClient(SupportedChainId.SEPOLIA),
      L2_CLIENT: getApolloClient(SupportedChainId.TITAN_SEPOLIA),
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
  const { L1_CLIENT, L2_CLIENT } = useGetApolloClient();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  const L1Bridge = isConnectedToMainNetwork
    ? MAINNET_CONTRACTS.L1Bridge
    : SEPOLIA_CONTRACTS.L1Bridge_TITAN_SEPOLIA;

  const {
    data: _l1Data,
    loading: _l1Loading,
    error: _l1Error,
  } = useQuery(FETCH_USER_TRANSACTIONS_L1, {
    variables: {
      formattedAddress: formatAddress(address),
      L1Bridge,
      account: address,
    },
    pollInterval: 13000,
    client: L1_CLIENT,
  });
  const {
    data: _l2Data,
    loading: _l2Loading,
    error: _l2Error,
  } = useQuery(FETCH_USER_TRANSACTIONS_L2, {
    variables: {
      formattedAddress: formatAddress(address),
      L1Bridge,
      account: address,
    },
    pollInterval: 13000,
    client: L2_CLIENT,
  });

  useEffect(() => {
    if (_l1Error) {
      errorHandler(_l1Error);
    }
    if (_l2Error) {
      errorHandler(_l2Error);
    }
  }, [_l1Error, _l2Error]);

  return {
    l1Data: _l1Data,
    l1Loading: _l1Loading,
    l1error: _l1Error,
    l2Data: _l2Data,
    l2Loading: _l2Loading,
    l2_error: _l2Error,
  };
};

export const useWithdrawData = () => {
  const [withdrawHistory, setWithdrawHistory] = useState<
    WithdrawTransactionHistory[] | [] | null
  >(null);

  const { l2Data } = useSubgraph();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { L2Provider } = useProvier();

  const fetchData = useCallback(async () => {
    if (l2Data && isConnectedToMainNetwork !== undefined && L2Provider) {
      const l2SentMessges = l2Data.sentMessages;
      const result: WithdrawTransactionHistory[] = await Promise.all(
        l2SentMessges.map(async (sentMessage: SentMessages) => {
          const resolved: Resolved = {
            target: sentMessage.target,
            sender: sentMessage.sender,
            message: sentMessage.message,
            messageNonce: sentMessage.messageNonce,
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
            status,
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
  }, [l2Data, isConnectedToMainNetwork, L2Provider]);

  useEffect(() => {
    fetchData().catch((error) => {
      console.error("Error in fetching withdraw data", error);
    });
  }, [l2Data, isConnectedToMainNetwork, L2Provider]);

  return { withdrawHistory };
};

export const useDepositData = () => {
  const [depositHistory, setDepositHistory] = useState<
    DepositTransactionHistory[] | [] | null
  >(null);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { l1Data } = useSubgraph();
  const { L1Provider } = useProvier();

  const fetchData = useCallback(async () => {
    if (l1Data && isConnectedToMainNetwork !== undefined && L1Provider) {
      const l1SentMessges = l1Data.sentMessages;
      const result: DepositTransactionHistory[] = await Promise.all(
        l1SentMessges.map(async (sentMessage: SentMessages) => {
          const resolved: Resolved = {
            target: sentMessage.target,
            sender: sentMessage.sender,
            message: sentMessage.message,
            messageNonce: sentMessage.messageNonce,
          };
          const { currentStatus, relayedMessageTx } =
            await getCurrentDepositStatus(resolved, isConnectedToMainNetwork);

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

          const parsedLog = getDecodedDepositLog(
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

          const { l1TokenAddress, l2TokenAddress, amount } = parsedLog;

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
            inNetwork: SupportedChainId.MAINNET,
            outNetwork: SupportedChainId.TITAN,
            inToken: l1Token,
            outToken: l2Token,
            blockTimestamps,
            transactionHashes,
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
      if (sortedResult) return setDepositHistory(sortedResult);
      return setDepositHistory([]);
    }
  }, [l1Data, isConnectedToMainNetwork, L1Provider]);

  useEffect(() => {
    fetchData().catch((error) => {
      console.error("Error in fetching deposit data", error);
    });
  }, [l1Data, isConnectedToMainNetwork, L1Provider]);

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
        const inToken = getTokenInfo({ requestData, isConnectedToMainNetwork });
        const outToken = getTokenInfo({
          requestData,
          ctAmount: true,
          _editedctAmount: isUpdateFee ? editCT._ctAmount : undefined,
          isConnectedToMainNetwork,
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
          isConnectedToMainNetwork,
        });
        const outToken = getTokenInfo({
          requestData: provideCT,
          isConnectedToMainNetwork,
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
