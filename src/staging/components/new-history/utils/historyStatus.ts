//historyStatus.ts
import {
  Status,
  Action,
  CT_ACTION,
  CT_Status,
  CT_REQUEST_CANCEL,
  CT_PROVIDE,
} from "@/staging/types/transaction";

export enum TransactionStatus {
  WithdrawInitiate = 0,
  WithdrawRollup = 1,
  WithdrawFinalized = 2,
  WithdrawCompleted = 3,
  DepositFinalized = 101,
  DepositCompleted = 102,
  REQUEST_CANCEL,
  RETURN_NOT_COMPLETED,
}

export const getStatusValue = (
  action: Action | CT_ACTION,
  status: Status | CT_Status
): number => {
  if (action === Action.Withdraw) {
    switch (status) {
      case Status.Initiate:
      case Status.Rollup:
        return TransactionStatus.WithdrawRollup;
      case Status.Finalize:
        return TransactionStatus.WithdrawFinalized;
      case Status.Completed:
        return TransactionStatus.WithdrawCompleted;
    }
  }
  if (action === Action.Deposit) {
    switch (status) {
      case Status.Finalize:
        return TransactionStatus.DepositFinalized;
      case Status.Completed:
        return TransactionStatus.DepositCompleted;
    }
  }
  if (status === CT_REQUEST_CANCEL.Refund) {
    return TransactionStatus.REQUEST_CANCEL;
  }
  if (status === CT_PROVIDE.Return) {
    return TransactionStatus.RETURN_NOT_COMPLETED;
  }
  return 0; // no type
};
