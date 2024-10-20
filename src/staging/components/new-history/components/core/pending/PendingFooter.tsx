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
  CT_PROVIDE,
  CT_PROVIDE_HISTORY_blockTimestamps,
} from "@/staging/types/transaction";
import StatusComponent from "@/staging/components/new-history/components/core/pending/StatusComponent";
import { STATUS_CONFIG } from "@/staging/constants/status";
import useMediaView from "@/hooks/mediaView/useMediaView";

const getStatusHandler = (params: {
  status: Action | CT_ACTION;
  isCanceled?: boolean;
  isUpdateFee?: boolean;
  hasMultipleUpdateFees?: boolean;
}) => {
  const { status, isCanceled, isUpdateFee } = params;
  const actionHandlers = {
    [Action.Deposit]: STATUS_CONFIG.DEPOSIT,
    [Action.Withdraw]: STATUS_CONFIG.WITHDRAW,
    [CT_ACTION.REQUEST]: isCanceled
      ? STATUS_CONFIG.REQUEST_CANCEL
      : isUpdateFee
      ? STATUS_CONFIG.REQUEST_UPDATE_FEE
      : STATUS_CONFIG.REQUEST,
    [CT_ACTION.PROVIDE]: STATUS_CONFIG.PROVIDE,
  };
  return actionHandlers[status];
};

const getBlockTimestamp = (
  transaction: TransactionHistory,
  statusKey: HISTORY_TRANSACTION_STATUS,
  isUpdateFee: boolean,
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
    if (blockTimestamps.updateFee) {
      return blockTimestamps.updateFee[blockTimestamps.updateFee.length - 1];
    }
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
  if (statusKey === CT_REQUEST_CANCEL.Completed) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_REQUEST_HISTORY_blockTimestamps;
    if (blockTimestamps.cancelRequest) return blockTimestamps.cancelRequest;
  }

  if (statusKey === CT_PROVIDE.Provide) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_PROVIDE_HISTORY_blockTimestamps;
    if (blockTimestamps.provide) return blockTimestamps.provide;
  }

  if (statusKey === CT_PROVIDE.Return) {
    const blockTimestamps =
      transaction.blockTimestamps as CT_PROVIDE_HISTORY_blockTimestamps;
    if (blockTimestamps.return) return blockTimestamps.return;
  }

  return undefined;
};

export default function PendingFooter(params: {
  transaction: TransactionHistory;
  openModal: () => void;
}) {
  const { mobileView } = useMediaView();
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
  const updateFeeCount = isUpdateFee
    ? (transactionData as CT_Request_History).transactionHashes.updateFee
        ?.length
    : 0;

  const statuses = getStatusHandler({
    status,
    isCanceled,
    isUpdateFee,
    hasMultipleUpdateFees,
  }) as HISTORY_TRANSACTION_STATUS[];

  const filteredStatuses = mobileView
    ? statuses.filter((statusKey) => statusKey === transactionData.status)
    : statuses;

  return (
    <>
      {filteredStatuses.map((statusKey) => {
        return (
          <StatusComponent
            key={`${transactionData.action}-${statusKey}`}
            label={statusKey}
            transactionData={transactionData}
            blockTimestamp={getBlockTimestamp(
              transactionData,
              statusKey,
              isUpdateFee,
            )}
            updateFeeCount={updateFeeCount}
            openModal={openModal}
          />
        );
      })}
    </>
  );
}
