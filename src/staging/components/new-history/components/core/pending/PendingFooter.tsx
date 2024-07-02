import {
  TransactionHistory,
  Status,
  Action,
  CT_ACTION,
  HISTORY_TRANSACTION_STATUS,
  getCancelValueFromCTRequestHistory,
} from "@/staging/types/transaction";
import StatusComponent from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { STATUS_CONFIG } from "@/staging/constants/status";

const getStatusHandler = (status: Action | CT_ACTION, isCanceled?: boolean) => {
  const actionHandlers = {
    [Action.Deposit]: STATUS_CONFIG.DEPOSIT,
    [Action.Withdraw]: STATUS_CONFIG.WITHDRAW,
    [CT_ACTION.REQUEST]: isCanceled
      ? STATUS_CONFIG.REQUEST_CANCEL
      : STATUS_CONFIG.REQUEST,
    [CT_ACTION.PROVIDE]: STATUS_CONFIG.PROVIDE,
  };
  return actionHandlers[status];
};

export default function PendingFooter(transaction: TransactionHistory) {
  const transactionData = transaction;
  const statuses: HISTORY_TRANSACTION_STATUS[] = getStatusHandler(
    transactionData.action,
    getCancelValueFromCTRequestHistory(transactionData)
  );

  const endIndex =
    statuses.findIndex((statusKey) => statusKey === transactionData.status) + 1;
  const limitedStatuses = statuses.slice(
    0,
    endIndex > 0 ? endIndex : undefined
  );

  
  return (
    <>
      {limitedStatuses.map((statusKey, index) => (
        <StatusComponent
          key={index}
          label={statusKey}
          order={index}
          transactionData={transactionData}
        />
      ))}
    </>
  );
}
