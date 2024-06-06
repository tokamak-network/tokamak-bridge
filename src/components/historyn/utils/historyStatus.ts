import {
  Status,
  Action,
  TransactionStatus,
} from "@/componenets/historyn/types";

const getStatusValue = (action: Action, status: Status): number => {
  if (action === Action.Withdraw) {
    switch (status) {
      case Status.Rollup:
        return TransactionStatus.WithdrawRollup;
      case Status.Finalized:
        return TransactionStatus.WithdrawFinalized;
      case Status.Completed:
        return TransactionStatus.WithdrawCompleted;
    }
  } else if (action === Action.Deposit) {
    switch (status) {
      case Status.Finalized:
        return TransactionStatus.DepositFinalized;
      case Status.Completed:
        return TransactionStatus.DepositCompleted;
    }
  }
  return 0; // no type
};

export default getStatusValue;
