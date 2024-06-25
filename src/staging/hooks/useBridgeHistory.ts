import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Action,
  DepositTransactionHistory,
  Network,
  Status,
  TransactionToken,
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
  CurrentStatus,
  RelayMessage,
  StateBatchAppended,
  getCurrentDepositStatus,
  getCurretStatus,
} from "@/utils/history/getCurrentStatus";
import { useProvier } from "@/hooks/provider/useProvider";
import { utils, providers } from "ethers";
import {
  USDC_ADDRESS_BY_CHAINID,
  USDT_ADDRESS_BY_CHAINID,
} from "@/constant/contracts/tokens";
import { supportedTokens } from "@/types/token/supportedToken";
import { TITAN_CHALLENGE_PERIOD } from "@/constant/network/titan";
import { getDecodeLog } from "@/utils/history/getDecodeLog";
import { formatAddress } from "@/utils/trim/formatAddress";

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

const isStableCoin = (tokenAddress: string) => {
  const isUSDT = Object.values(USDT_ADDRESS_BY_CHAINID).some(
    (tokenAddress) => tokenAddress !== undefined
  );
  const isUSDC = Object.values(USDC_ADDRESS_BY_CHAINID).some(
    (tokenAddress) => tokenAddress !== undefined
  );
  return isUSDT || isUSDC;
};

const getTokenInfo = (tokenAddress: string) => {
  for (const token of supportedTokens) {
    for (const [network, address] of Object.entries(token.address)) {
      if (address?.toLowerCase() === tokenAddress.toLowerCase()) {
        return {
          name: token.tokenName as string,
          symbol: token.tokenSymbol as string,
          decimals: token.decimals,
        };
      }
    }
  }
  throw new Error(`Token address(${tokenAddress}) not found`);
};

const getTransactionToken = (
  l1TokenAddress: string,
  l2TokenAddress: string,
  amount: string
): { l1Token: TransactionToken; l2Token: TransactionToken } => {
  const tokenInfo = getTokenInfo(l2TokenAddress);
  const l2Token: TransactionToken = {
    ...tokenInfo,
    address: l2TokenAddress,
    amount,
  };
  const l1Token: TransactionToken = {
    ...tokenInfo,
    address: l1TokenAddress,
    amount,
  };
  return {
    l1Token,
    l2Token,
  };
};

const getStatus = (currentStatus: CurrentStatus) => {
  switch (currentStatus) {
    case 0:
      return Status.Initiate;
    case 1:
      return Status.Prove;
    case 2:
      return Status.Rollup;
    case 3:
      return Status.Finalize;
    case 4:
      return Status.Completed;
  }
};

const getTransactionTimestamp = (params: {
  currentStatus: CurrentStatus;
  sentMessageTimestamp: number;
  stateBatchTimestamp?: number;
  relayedMessageTimestamp?: number;
}): WithdrawTransactionHistory["blockTimestamps"] | Error => {
  const {
    currentStatus,
    sentMessageTimestamp,
    stateBatchTimestamp,
    relayedMessageTimestamp,
  } = params;

  if (currentStatus > 0 && !sentMessageTimestamp) {
    return new Error("SentMessage's timestamp is missing");
  }
  if (currentStatus >= 4 && !relayedMessageTimestamp) {
    return new Error("Relay's timestamp is missing");
  }

  const initialCompletedTimestamp = sentMessageTimestamp;
  const rollupCompletedTimestamp =
    stateBatchTimestamp ?? 0 + TITAN_CHALLENGE_PERIOD;
  const finalizedCompletedTimestamp = relayedMessageTimestamp;

  switch (currentStatus) {
    case 0:
      return {
        initialCompletedTimestamp,
      };
    case 1:
    case 2:
      return {
        initialCompletedTimestamp,
        rollupCompletedTimestamp,
      };
    case 3:
      return {
        initialCompletedTimestamp,
        rollupCompletedTimestamp,
      };
    case 4:
      return {
        initialCompletedTimestamp,
        rollupCompletedTimestamp,
        finalizedCompletedTimestamp,
      };
  }
};

const getTransactionHash = (params: {
  sentMessageTxhash: string;
  stateBatchTxhash?: string;
  relayedMessageTxhash?: string;
}): WithdrawTransactionHistory["transactionHashes"] => {
  const { sentMessageTxhash, stateBatchTxhash, relayedMessageTxhash } = params;

  const initialTransactionHash = sentMessageTxhash;
  const rollupTransactionHash = stateBatchTxhash;
  const finalizedTransactionHash = relayedMessageTxhash;

  return {
    initialTransactionHash,
    rollupTransactionHash,
    finalizedTransactionHash,
  };
};

const getTransaction = (params: {
  currentStatus: CurrentStatus;
  sentMessage: SentMessages;
  stateBatchAppended?: StateBatchAppended;
  relayMessage?: RelayMessage;
}) => {
  const { currentStatus, sentMessage, stateBatchAppended, relayMessage } =
    params;
  const blockTimestamps = getTransactionTimestamp({
    currentStatus,
    sentMessageTimestamp: Number(sentMessage.blockTimestamp),
    stateBatchTimestamp: stateBatchAppended?.blockTimestamp,
    relayedMessageTimestamp: relayMessage?.blockTimestamp,
  });
  const transactionHashes = getTransactionHash({
    sentMessageTxhash: sentMessage.transactionHash,
    stateBatchTxhash: stateBatchAppended?.transactionHash,
    relayedMessageTxhash: relayMessage?.transactionHash,
  });

  return { blockTimestamps, transactionHashes };
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

          const { currentStatus, stateBatchAppendeds, relayedMessageTx } =
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
            amount
          );
          const status = getStatus(currentStatus);
          const { blockTimestamps, transactionHashes } = getTransaction({
            currentStatus,
            sentMessage,
            stateBatchAppended: stateBatchAppendeds,
            relayMessage: relayedMessageTx,
          });

          if (blockTimestamps instanceof Error) {
            return;
          }

          const result: WithdrawTransactionHistory = {
            action: Action.Withdraw,
            status: status,
            inNetwork: Network.Mainnet,
            outNetwork: Network.Titan,
            inToken: l2Token,
            outToken: l1Token,
            blockTimestamps,
            transactionHashes,
          };

          return result;
        })
      );

      const filteredResult = result.filter(
        (tx) => !(tx instanceof Error) || tx !== undefined
      );

      if (filteredResult) return setWithdrawHistory(filteredResult);
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
            return new Error("Invalid transaction");
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
            amount
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
            inNetwork: Network.Mainnet,
            outNetwork: Network.Titan,
            inToken: l2Token,
            outToken: l1Token,
            blockTimestamps,
            transactionHashes,
          };

          return result;
        })
      );

      const filteredResult = result.filter(
        (tx) => !(tx instanceof Error) || tx !== undefined
      );

      if (filteredResult) return setDepositHistory(filteredResult);
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

export const useBridgeHistory = () => {
  const { depositHistory } = useDepositData();
  const { withdrawHistory } = useWithdrawData();

  return { depositHistory, withdrawHistory };
};
