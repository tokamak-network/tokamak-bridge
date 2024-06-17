import {
  TransactionHistory,
  Status,
  Action,
} from "@/staging/components/new-history/types";
import StatusComponent from "@/staging/components/new-history/drawer/pending/StatusComponent";
import { STATUS_CONFIG } from "@/staging/components/new-history/constants";

export default function PendingFooter(transaction: TransactionHistory) {
  const transactionData = transaction;

  const statuses: Status[] =
    transactionData.action === Action.Withdraw
      ? STATUS_CONFIG.WITHDRAW
      : STATUS_CONFIG.DEPOSIT;

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
