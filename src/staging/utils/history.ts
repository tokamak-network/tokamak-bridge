import {
  isDepositTransactionHistory,
  StandardHistory,
  Status,
} from "../types/transaction";

export const getSortedTxHistory = (list: StandardHistory[]) => {
  const actionItems = list.filter((tx) => isActiveTxItem(tx.status));
  const nonActiveItems = list.filter((tx) => !isActiveTxItem(tx.status));
  const sortedActiveItems = getSortedTxListByDate(actionItems);
  const sortedNonActiveItems = getSortedTxListByDate(nonActiveItems);
  return [...sortedActiveItems, ...sortedNonActiveItems];
};

export const isActiveTxItem = (status: Status) => {
  return status !== Status.Completed;
};

export const getSortedTxListByDate = (transactions: StandardHistory[]) => {
  return transactions.sort((a, b) => {
    // Get the latest timestamp for transaction a
    const latestA = isDepositTransactionHistory(a)
      ? Math.max(
          a.blockTimestamps.initialCompletedTimestamp,
          a.blockTimestamps?.finalizedCompletedTimestamp ?? 0
        )
      : Math.max(
          a.blockTimestamps.initialCompletedTimestamp,
          a.blockTimestamps.rollupCompletedTimestamp ?? 0,
          a.blockTimestamps.proveCompletedTimestamp ?? 0,
          a.blockTimestamps.finalizedCompletedTimestamp ?? 0
        );

    // Get the latest timestamp for transaction b
    const latestB = isDepositTransactionHistory(b)
      ? Math.max(
          b.blockTimestamps.initialCompletedTimestamp,
          b.blockTimestamps?.finalizedCompletedTimestamp ?? 0
        )
      : Math.max(
          b.blockTimestamps.initialCompletedTimestamp,
          b.blockTimestamps?.rollupCompletedTimestamp ?? 0,
          b.blockTimestamps?.proveCompletedTimestamp ?? 0,
          b.blockTimestamps.finalizedCompletedTimestamp ?? 0
        );

    // Sort in descending order (latest first)
    return latestB - latestA;
  });
};
