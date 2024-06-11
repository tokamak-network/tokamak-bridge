import {
  TransactionHistory,
  Status,
  Action,
} from "@/components/historyn/types";
import StatusComponent from "@/components/historyn/drawer/pending/StatusComponent";
import { STATUS_CONFIG } from "@/components/historyn/constants";

export default function PendingFooter(transaction: TransactionHistory) {
  const transactionData = transaction;

  const statuses =
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
