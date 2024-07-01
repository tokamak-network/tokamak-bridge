import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Action,
  CT_ACTION,
  CT_History,
  CT_PROVIDE,
  CT_Provide_History,
  CT_REQUEST,
  CT_Request_History,
  DepositTransactionHistory,
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
} from "@/graphql/history";
import { Resolved, SentMessages } from "@/types/activity/history";
import {
  getCurrentDepositStatus,
  getCurretStatus,
} from "@/utils/history/getCurrentStatus";
import { useProvier } from "@/hooks/provider/useProvider";
import { utils } from "ethers";
import { getDecodeLog } from "@/utils/history/getDecodeLog";
import { formatAddress } from "@/utils/trim/formatAddress";
import {
  getStatus,
  getTransaction,
  getTransactionToken,
} from "@/utils/history/getTransaction";

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
          if (l2TxReceipt.logs[3] === undefined || !currentStatus) {
            return new Error("Invalid transaction");
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
            false
          );
          const status = getStatus(currentStatus);
          const { blockTimestamps, transactionHashes } = getTransaction({
            currentStatus,
            sentMessage,
            stateBatchAppended,
            relayMessage: relayedMessageTx,
          });

          if (blockTimestamps instanceof Error) {
            return;
          }

          const result: WithdrawTransactionHistory = {
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
        (tx) => !(tx instanceof Error) || tx !== undefined
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
          if (!l1TxReceipt || !currentStatus) {
            new Error(`Invalid transaction (${sentMessage.transactionHash})`);
            return;
          }

          const logIndex = l1TxReceipt.logs.length - 1;
          const isERC20Deposit = logIndex > 2;
          const log = l1TxReceipt.logs[logIndex];
          const { l1TokenAddress, l2TokenAddress, amount } = getDecodeLog(
            isERC20Deposit,
            log
          );

          const { l1Token, l2Token } = getTransactionToken(
            l1TokenAddress,
            l2TokenAddress,
            amount,
            true
          );

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
            action: Action.Deposit,
            status: status,
            inNetwork: SupportedChainId.MAINNET,
            outNetwork: SupportedChainId.TITAN,
            inToken: l2Token,
            outToken: l1Token,
            blockTimestamps,
            transactionHashes,
          };
          return result;
        })
      );

      const filteredResult = result.filter((tx) => {
        if (!(tx instanceof Error) || tx !== undefined) return tx;
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

export const useRequestData = () => {
  const [requestHistory, setRequestHistory] = useState<
    CT_Request_History[] | [] | null
  >(null);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { l1Data } = useSubgraph();

  useEffect(() => {
    setRequestHistory([
      {
        action: CT_ACTION.REQUEST,
        status: CT_REQUEST.Completed,
        blockTimestamps: {
          request: 0,
          updateFee: [0],
          waitForReceive: 0,
          completed: 0,
        },
        inNetwork: SupportedChainId.MAINNET,
        outNetwork: SupportedChainId.TITAN,
        inToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        outToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        transactionHashes: {
          request: "",
          updateFee: [""],
          waitForReceive: "",
          completed: "",
        },
      },
      {
        action: CT_ACTION.REQUEST,
        status: CT_REQUEST.WaitForReceive,
        blockTimestamps: {
          request: 0,
          updateFee: [0],
          waitForReceive: 0,
        },
        inNetwork: SupportedChainId.MAINNET,
        outNetwork: SupportedChainId.TITAN,
        inToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        outToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        transactionHashes: {
          request: "",
          updateFee: [""],
          waitForReceive: "",
        },
      },
    ]);
  }, []);

  return { requestHistory };
};

export const useProvideData = () => {
  const [provideHistory, setProvideHistory] = useState<
    CT_Provide_History[] | [] | null
  >(null);
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { l1Data } = useSubgraph();

  useEffect(() => {
    setProvideHistory([
      {
        action: CT_ACTION.PROVIDE,
        status: CT_PROVIDE.Completed,
        blockTimestamps: {
          provide: 0,
          return: 0,
          completed: 0,
        },
        inNetwork: SupportedChainId.MAINNET,
        outNetwork: SupportedChainId.TITAN,
        inToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        outToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        transactionHashes: {
          provide: "",
          return: "",
          completed: "",
        },
      },
      {
        action: CT_ACTION.PROVIDE,
        status: CT_PROVIDE.Provide,
        blockTimestamps: {
          provide: 0,
        },
        inNetwork: SupportedChainId.MAINNET,
        outNetwork: SupportedChainId.TITAN,
        inToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        outToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        transactionHashes: {
          provide: "",
        },
      },
    ]);
  }, []);

  return { provideHistory };
};

export const useBridgeHistory = () => {
  const { depositHistory } = useDepositData();
  const { withdrawHistory } = useWithdrawData();
  const { requestHistory } = useRequestData();
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
