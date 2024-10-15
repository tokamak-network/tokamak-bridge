import {
  Status,
  TransactionToken,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import { supportedTokens } from "@/types/token/supportedToken";
import {
  CurrentStatus,
  RelayMessage,
  StateBatchAppended,
} from "./getCurrentStatus";
import { TITAN_CHALLENGE_PERIOD } from "@/constant/network/titan";
import { SentMessages } from "@/types/activity/history";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { OVM_ETH_BRIDGE } from "@/constant/contracts";

const getTokenInfo = (tokenAddress: string, chainId: number) => {
  if (tokenAddress === OVM_ETH_BRIDGE) {
    return {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    };
  }

  for (const token of supportedTokens) {
    for (const [network, address] of Object.entries(token.address)) {
      if (
        address?.toLowerCase() === tokenAddress.toLowerCase() &&
        SupportedChainId[network as keyof typeof SupportedChainId] === chainId
      ) {
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

export const getTransactionToken = (
  l1TokenAddress: string,
  l2TokenAddress: string,
  amount: string,
  isL1: boolean,
  chainId: number,
): { l1Token: TransactionToken; l2Token: TransactionToken } => {
  const tokenInfo = getTokenInfo(
    isL1 ? l1TokenAddress : l2TokenAddress,
    chainId,
  );
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

export const getStatus = (currentStatus: CurrentStatus) => {
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

export const getTransactionTimestamp = (params: {
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

export const getTransactionHash = (params: {
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

export const getTransaction = (params: {
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
