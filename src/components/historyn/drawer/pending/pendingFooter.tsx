import {
  TransactionHistory,
  Status,
  Action,
} from "@/components/historyn/types";
import StatusComponent from "@/components/historyn/drawer/pending/StatusComponent";

export default function PendingFooter(transaction: TransactionHistory) {
  const transactionData = transaction;

  const statusConfig = {
    withdraw: [Status.Initial, Status.Rollup, Status.Finalized],
    deposit: [Status.Initial, Status.Finalized],
  };

  const statuses =
    transactionData.action === Action.Withdraw
      ? statusConfig.withdraw
      : statusConfig.deposit;

  return (
    <>
      {statuses.map((statusKey, index) => (
        <StatusComponent
          key={index}
          label={statusKey}
          transactionData={transactionData}
        />
      ))}
    </>
  );
}
