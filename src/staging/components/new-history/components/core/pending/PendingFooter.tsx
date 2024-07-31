import {
  TransactionHistory,
  Status,
  Action,
  CT_ACTION,
  HISTORY_TRANSACTION_STATUS,
  getCancelValueFromCTRequestHistory,
  isInCT_REQUEST,
  CT_REQUEST_HISTORY_blockTimestamps,
  CT_REQUEST,
  CT_Request_History,
  CT_REQUEST_CANCEL,
} from "@/staging/types/transaction";
import StatusComponent from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { STATUS_CONFIG } from "@/staging/constants/status";

const getStatusHandler = (params: {
  status: Action | CT_ACTION;
  isCanceled?: boolean;
  isUpdateFee?: boolean;
  hasMultipleUpdateFees?: boolean;
}) => {
  const { status, isCanceled, isUpdateFee, hasMultipleUpdateFees } = params;
  const actionHandlers = {
    [Action.Deposit]: STATUS_CONFIG.DEPOSIT,
    [Action.Withdraw]: STATUS_CONFIG.WITHDRAW,
    [CT_ACTION.REQUEST]: isCanceled
      ? STATUS_CONFIG.REQUEST_CANCEL
      : isUpdateFee
      ? hasMultipleUpdateFees
        ? STATUS_CONFIG.REQUEST_UPDATE_FEES
        : STATUS_CONFIG.REQUEST_UPDATE_FEE
      : STATUS_CONFIG.REQUEST,
    [CT_ACTION.PROVIDE]: STATUS_CONFIG.PROVIDE,
  };
  return actionHandlers[status];
};

const getBlockTimestamp = (
  transaction: TransactionHistory,
  statusKey: HISTORY_TRANSACTION_STATUS,
  isUpdateFee: boolean,
  hasMultipleUpdateFees?: boolean
) => {
  if (
    statusKey === CT_REQUEST.Request &&
    transaction &&
    transaction.blockTimestamps
  ) {
    // statusKey가 "CT_REQ_REQUEST"와 일치하는지 확인
    const blockTimestamps =
      transaction.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
    if (blockTimestamps.request) {
      return blockTimestamps.request;
    }
    return undefined;
  }
  if (isUpdateFee) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
    if (blockTimestamps.updateFee) return blockTimestamps.updateFee[0];
  }

  if (statusKey === CT_REQUEST_CANCEL.CancelRequest) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
    if (blockTimestamps.cancelRequest) return blockTimestamps.cancelRequest;
  }
  if (statusKey === CT_REQUEST_CANCEL.Refund) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
    if (blockTimestamps.cancelRequest) return blockTimestamps.cancelRequest;
  }

  return undefined;
};

export default function PendingFooter(params: {
  transaction: TransactionHistory;
  openModal: () => void;
}) {
  const { transaction, openModal } = params;
  const transactionData = transaction;
  const status = transactionData.action;
  const isCanceled = getCancelValueFromCTRequestHistory(transactionData);
  const isRequest = isInCT_REQUEST(transactionData.status);
  const isUpdateFee = isRequest
    ? (transactionData as CT_Request_History).isUpdateFee
    : false;
  const hasMultipleUpdateFees = isUpdateFee
    ? (transactionData as CT_Request_History).hasMultipleUpdateFees
    : false;

  const statuses = getStatusHandler({
    status,
    isCanceled,
    isUpdateFee,
    hasMultipleUpdateFees,
  });

  return (
    <>
      {statuses.map((statusKey, index) => (
        <StatusComponent
          key={index}
          label={statusKey}
          transactionData={transactionData}
          blockTimestamp={getBlockTimestamp(
            transactionData,
            statusKey,
            isUpdateFee,
            hasMultipleUpdateFees
          )}
          openModal={openModal}
        />
      ))}
    </>
  );
}
