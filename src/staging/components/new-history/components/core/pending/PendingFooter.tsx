import {
  TransactionHistory,
  Status,
  Action,
} from "@/staging/types/transaction";
import StatusComponent from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { STATUS_CONFIG } from "@/staging/constants/status";

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
