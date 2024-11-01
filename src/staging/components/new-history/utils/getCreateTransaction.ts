import {
  Action,
  Status,
  TransactionToken,
  WithdrawTransactionHistory,
  DepositTransactionHistory,
  TransactionHistory,
  HISTORY_SORT,
  StandardHistory,
  DepositWithdrawType,
} from "@/staging/types/transaction";

import { Resolved } from "@/types/activity/history";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { BigNumber } from "ethers";

export const getDepositWithdrawTransactionType = (symbol: string) => {
  switch (symbol) {
    case "ETH":
      return DepositWithdrawType.ETH;
    case "TON":
      return DepositWithdrawType.NativeToken;
    case "USDC":
      return DepositWithdrawType.USDC;
    default:
      return DepositWithdrawType.ERC20;
  }
};

// Withdraw 트랜잭션 생성 함수
export function createWithdrawTransaction(
  status: Status,
  amount: string,
  symbol: string,
  inNetwork: SupportedChainId,
  outNetwork: SupportedChainId,
  inToken: TransactionToken,
  outToken: TransactionToken,
  initialCompletedTimestamp: number,
  initialTransactionHash: string,
  resolved: Resolved,
  blockNumber: number,
  rollupCompletedTimestamp?: number,
  finalizedCompletedTimestamp?: number,
  rollupTransactionHash?: string,
  finalizedTransactionHash?: string
): WithdrawTransactionHistory {
  return {
    action: Action.Withdraw,
    amount: BigNumber.from(amount),
    withdrawType: getDepositWithdrawTransactionType(symbol),
    status,
    category: HISTORY_SORT.STANDARD,
    inNetwork,
    outNetwork,
    inToken,
    outToken,
    blockTimestamps: {
      initialCompletedTimestamp,
      rollupCompletedTimestamp,
      finalizedCompletedTimestamp,
    },
    transactionHashes: {
      initialTransactionHash,
      rollupTransactionHash,
      finalizedTransactionHash,
    },
    resolved,
    blockNumber,
  };
}

// Deposit 트랜잭션 생성 함수
export function createDepositTransaction(
  status: Status,
  inNetwork: SupportedChainId,
  outNetwork: SupportedChainId,
  inToken: TransactionToken,
  outToken: TransactionToken,
  initialCompletedTimestamp: number,
  initialTransactionHash: string,
  finalizedCompletedTimestamp?: number,
  finalizedTransactionHash?: string
): DepositTransactionHistory {
  return {
    action: Action.Deposit,
    status,
    category: HISTORY_SORT.STANDARD,
    inNetwork,
    outNetwork,
    inToken,
    outToken,
    blockTimestamps: {
      initialCompletedTimestamp,
      finalizedCompletedTimestamp,
    },
    transactionHashes: {
      initialTransactionHash,
      finalizedTransactionHash,
    },
  };
}

export function createTransaction(
  action: Action,
  status: Status,
  inNetwork: SupportedChainId,
  outNetwork: SupportedChainId,
  inToken: TransactionToken,
  outToken: TransactionToken,
  initialCompletedTimestamp?: number,
  initialTransactionHash?: string,
  resolved?: Resolved,
  blockNumber?: number,
  rollupCompletedTimestamp?: number,
  finalizedCompletedTimestamp?: number,
  rollupTransactionHash?: string,
  finalizedTransactionHash?: string
): StandardHistory {
  if (action === Action.Withdraw) {
    return createWithdrawTransaction(
      status,
      inToken.amount,
      inToken.symbol,
      inNetwork,
      outNetwork,
      inToken,
      outToken,
      initialCompletedTimestamp!,
      initialTransactionHash!,
      resolved!,
      blockNumber!,
      rollupCompletedTimestamp,
      finalizedCompletedTimestamp,
      rollupTransactionHash,
      finalizedTransactionHash
    );
  } else {
    return createDepositTransaction(
      status,
      inNetwork,
      outNetwork,
      inToken,
      outToken,
      initialCompletedTimestamp!,
      initialTransactionHash!,
      finalizedCompletedTimestamp,
      finalizedTransactionHash
    );
  }
}
