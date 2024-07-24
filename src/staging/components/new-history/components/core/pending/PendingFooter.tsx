import {
  TransactionHistory,
  Status,
  Action,
  CT_ACTION,
  HISTORY_TRANSACTION_STATUS,
  getCancelValueFromCTRequestHistory,
  isInCT_REQUEST,
  CT_REQUEST_HISTORY_blockTimestamps,
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

const getBlockTimestamp = (
  transaction: TransactionHistory,
  statusKey: HISTORY_TRANSACTION_STATUS
) => {
  // statusKey가 "CT_REQ_REQUEST"와 일치하는지 확인
  if (
    statusKey === "CT_REQ_REQUEST" &&
    transaction &&
    transaction.blockTimestamps
  ) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
    if (blockTimestamps.request) {
      return blockTimestamps.request;
    }
    return undefined;
  }
  return undefined;
};

export default function PendingFooter(params: {
  transaction: TransactionHistory;
  openModal: () => void;
}) {
  const { transaction, openModal } = params;
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
          transactionData={transactionData}
          blockTimestamp={getBlockTimestamp(transactionData, statusKey)}
          openModal={openModal}
        />
      ))}
    </>
  );
}
