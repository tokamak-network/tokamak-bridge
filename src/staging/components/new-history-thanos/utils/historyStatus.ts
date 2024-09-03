//historyStatus.ts
import {
  Status,
  Action,
  CT_ACTION,
  CT_Status,
  CT_REQUEST_CANCEL,
  CT_PROVIDE,
  ProgressStatus,
} from "@/staging/types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export enum TransactionStatus {
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

export const getDipositWithdrawStatues = (
  actionType: Action,
  chain: SupportedChainId
) => {
  switch (actionType) {
    case Action.Deposit:
      return [Status.Initiate, Status.Finalize];
    case Action.Withdraw:
      return [
        Status.Initiate,
        chain === SupportedChainId.THANOS_SEPOLIA
          ? Status.Prove
          : Status.Rollup,
        Status.Finalize,
      ];
  }
};

export const getCurrentProgressStatus = (
  actionType: Action,
  completedStatus: Status,
  status: Status,
  chain: SupportedChainId
): ProgressStatus => {
  const statuses = getDipositWithdrawStatues(actionType, chain);
  const diff = statuses.indexOf(status) - statuses.indexOf(completedStatus);
  return diff === 0
    ? ProgressStatus.Doing
    : diff > 0
    ? ProgressStatus.Todo
    : ProgressStatus.Done;
};
