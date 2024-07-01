import {
  TransactionHistory,
  Status,
  Action,
  CT_ACTION,
  HISTORY_TRANSACTION_STATUS,
} from "@/staging/types/transaction";
import StatusComponent from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { STATUS_CONFIG } from "@/staging/constants/status";

const getStatusHandler = (status: Action | CT_ACTION) => {
  const actionHandlers = { 
    [Action.Deposit]: STATUS_CONFIG.DEPOSIT,
    [Action.Withdraw]: STATUS_CONFIG.WITHDRAW,
    [CT_ACTION.REQUEST]: STATUS_CONFIG.REQUEST,
    [CT_ACTION.PROVIDE]: STATUS_CONFIG.PROVIDE,
  };
  return actionHandlers[status];
};

export default function PendingFooter(transaction: TransactionHistory) {
  const transactionData = transaction;

  const statuses: HISTORY_TRANSACTION_STATUS[] = getStatusHandler(
    transactionData.action
  );
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
