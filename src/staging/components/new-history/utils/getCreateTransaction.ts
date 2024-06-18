import {
  Action,
  Status,
  Network,
  WithdrawTransactionHistory,
  DepositTransactionHistory,
  TransactionHistory,
  BaseTransactionHistory,
} from "@/staging/types/transaction";

// Withdraw 트랜잭션 생성 함수
export function createWithdrawTransaction(
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
  tokenSymbol: string,
  amount: string,
  initialCompletedTimestamp: string,
  initialTransactionHash: string,
  rollupCompletedTimestamp?: string,
  finalizedCompletedTimestamp?: string,
  rollupTransactionHash?: string,
  finalizedTransactionHash?: string
): WithdrawTransactionHistory {
  return {
    action: Action.Withdraw,
    status,
    inNetwork,
    outNetwork,
    tokenSymbol,
    amount,
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
  };
}

// Deposit 트랜잭션 생성 함수
export function createDepositTransaction(
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
  tokenSymbol: string,
  amount: string,
  initialCompletedTimestamp: string,
  initialTransactionHash: string,
  finalizedCompletedTimestamp?: string,
  finalizedTransactionHash?: string
): DepositTransactionHistory {
  return {
    action: Action.Deposit,
    status,
    inNetwork,
    outNetwork,
    tokenSymbol,
    amount,
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

// Base 트랜잭션 생성 함수
export function createBaseTransaction(
  action: Action,
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
  tokenSymbol: string,
  amount: string
): BaseTransactionHistory {
  return {
    action,
    status,
    inNetwork,
    outNetwork,
    tokenSymbol,
    amount,
  };
}

export function createTransaction(
  action: Action,
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
  tokenSymbol: string,
  amount: string,
  initialCompletedTimestamp?: string,
  initialTransactionHash?: string,
  rollupCompletedTimestamp?: string,
  finalizedCompletedTimestamp?: string,
  rollupTransactionHash?: string,
  finalizedTransactionHash?: string
): TransactionHistory {
  if (status === Status.Initiate) {
    return createBaseTransaction(
      action,
      status,
      inNetwork,
      outNetwork,
      tokenSymbol,
      amount
    );
  } else if (action === Action.Withdraw) {
    return createWithdrawTransaction(
      status,
      inNetwork,
      outNetwork,
      tokenSymbol,
      amount,
      initialCompletedTimestamp!,
      initialTransactionHash!,
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
      tokenSymbol,
      amount,
      initialCompletedTimestamp!,
      initialTransactionHash!,
      finalizedCompletedTimestamp,
      finalizedTransactionHash
    );
  }
}
