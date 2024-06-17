//historyStatus.ts
import { Status, Action } from "@/staging/components/new-history/types";

export enum TransactionStatus {
  WithdrawRollup = 1,
  WithdrawFinalized = 2,
  WithdrawCompleted = 3,
  DepositFinalized = 101,
  DepositCompleted = 102,
}

export const getStatusValue = (action: Action, status: Status): number => {
  if (action === Action.Withdraw) {
    switch (status) {
      case Status.Rollup:
        return TransactionStatus.WithdrawRollup;
      case Status.Finalize:
        return TransactionStatus.WithdrawFinalized;
      case Status.Completed:
        return TransactionStatus.WithdrawCompleted;
    }
  } else if (action === Action.Deposit) {
    switch (status) {
      case Status.Finalize:
        return TransactionStatus.DepositFinalized;
      case Status.Completed:
        return TransactionStatus.DepositCompleted;
    }
  }
  return 0; // no type
};
