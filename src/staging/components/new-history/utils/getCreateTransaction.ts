import {
  Action,
  Status,
  Network,
  TransactionToken,
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
  inToken: TransactionToken,
  outToken: TransactionToken,
  initialCompletedTimestamp: number,
  initialTransactionHash: string,
  rollupCompletedTimestamp?: number,
  finalizedCompletedTimestamp?: number,
  rollupTransactionHash?: string,
  finalizedTransactionHash?: string
): WithdrawTransactionHistory {
  return {
    action: Action.Withdraw,
    status,
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
  };
}

// Deposit 트랜잭션 생성 함수
export function createDepositTransaction(
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
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

// Base 트랜잭션 생성 함수
export function createBaseTransaction(
  action: Action,
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
  inToken: TransactionToken,
  outToken: TransactionToken
): BaseTransactionHistory {
  return {
    action,
    status,
    inNetwork,
    outNetwork,
    inToken,
    outToken,
  };
}

export function createTransaction(
  action: Action,
  status: Status,
  inNetwork: Network,
  outNetwork: Network,
  inToken: TransactionToken,
  outToken: TransactionToken,
  initialCompletedTimestamp?: number,
  initialTransactionHash?: string,
  rollupCompletedTimestamp?: number,
  finalizedCompletedTimestamp?: number,
  rollupTransactionHash?: string,
  finalizedTransactionHash?: string
): TransactionHistory {
  if (status === Status.Initiate) {
    return createBaseTransaction(
      action,
      status,
      inNetwork,
      outNetwork,
      inToken,
      outToken
    );
  }
  if (action === Action.Withdraw) {
    return createWithdrawTransaction(
      status,
      inNetwork,
      outNetwork,
      inToken,
      outToken,
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
      inToken,
      outToken,
      initialCompletedTimestamp!,
      initialTransactionHash!,
      finalizedCompletedTimestamp,
      finalizedTransactionHash
    );
  }
}
