import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import {
  T_FETCH_CancelCTs,
  T_FETCH_CancelCTs_L1,
  T_FETCH_EditCTs,
  T_FETCH_ProvideCTs_L1,
  T_FETCH_ProviderClaimCTs,
  T_FETCH_REQUEST_LIST_L2,
  T_provideCTs_L1,
  T_ProviderClaimCTs,
} from "../hooks/useCrossTrade";
import {
  CT_PROVIDE,
  CT_PROVIDE_HISTORY_blockTimestamps,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  CT_REQUEST_HISTORY_blockTimestamps,
  CT_REQUEST_HISTORY_transactionHashes,
  CT_REQUEST_STATUSES,
  ERROR_CODE,
  isInCT_Provide,
  isInCT_REQUEST,
  isInCT_REQUEST_CANCEL,
} from "../types/transaction";
import { ZERO_ADDRESS } from "@/constant/misc";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";

export const isRequestProvidedOnL1 = (params: {
  provideCTs: T_FETCH_ProvideCTs_L1;
  saleCount: string;
}) => {
  const { provideCTs, saleCount } = params;
  return provideCTs.some((provideCT) => provideCT._saleCount === saleCount);
};

export const isRequestProvided = (params: {
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  saleCount: string;
}) => {
  const { providerClaimCTs, saleCount } = params;
  return providerClaimCTs.some((claimCT) => claimCT._saleCount === saleCount);
};

export const getTransaction_providerClaimCT = (params: {
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  saleCount: string;
}) => {
  const { providerClaimCTs, saleCount } = params;
  return providerClaimCTs.filter((claimCT) => {
    if (claimCT._saleCount === saleCount) return claimCT;
  })[0];
};

export const isRequestCanceled = (params: {
  cancelCTs: T_FETCH_CancelCTs | T_FETCH_CancelCTs_L1;
  saleCount: string;
}) => {
  const { cancelCTs, saleCount } = params;
  return cancelCTs.some((cancelCT) => cancelCT._saleCount === saleCount);
};

export const isRequestCancelCompleted = (params: {
  cancelCTs: T_FETCH_CancelCTs;
  saleCount: string;
}) => {
  const { cancelCTs, saleCount } = params;
  return cancelCTs.some((cancelCT) => cancelCT._saleCount === saleCount);
};

export const isRequestEdited = (params: {
  editCTs: T_FETCH_EditCTs;
  saleCount: string;
}) => {
  const { editCTs, saleCount } = params;
  return editCTs.some((editCT) => editCT._saleCount === saleCount);
};

export const getEditCTTransaction = (params: {
  editCTs: T_FETCH_EditCTs;
  saleCount: string;
}) => {
  const { editCTs, saleCount } = params;
  return editCTs
    .filter((editCT) => editCT._saleCount === saleCount)
    .sort((a: any, b: any) => b.blockNumber - a.blockNumber);
};

export const getCancelCTTransaction = (params: {
  cancelCTs: T_FETCH_CancelCTs | T_FETCH_CancelCTs_L1;
  saleCount: string;
}) => {
  const { cancelCTs, saleCount } = params;
  return cancelCTs.filter((cancelCT) => cancelCT._saleCount === saleCount);
};

export const getRequestStatus = (params: {
  requestData: T_FETCH_REQUEST_LIST_L2;
  cancelCTs: T_FETCH_CancelCTs;
  l1CancelCTs: T_FETCH_CancelCTs_L1;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  editCTs: T_FETCH_EditCTs;
}): CT_REQUEST_STATUSES => {
  const { requestData, cancelCTs, l1CancelCTs, providerClaimCTs, editCTs } =
    params;

  const isCanceled = isRequestCanceled({
    cancelCTs: l1CancelCTs,
    saleCount: requestData._saleCount,
  });
  if (isCanceled) {
    const isCompleted = isRequestCancelCompleted({
      cancelCTs,
      saleCount: requestData._saleCount,
    });
    if (isCompleted) return CT_REQUEST_CANCEL.Completed;
    return CT_REQUEST_CANCEL.Refund;
  }

  const isProvided = isRequestProvided({
    providerClaimCTs,
    saleCount: requestData._saleCount,
  });
  if (isProvided) return CT_REQUEST.Completed;

  // const isUpdateFee = isRequestEdited({
  //   editCTs,
  //   saleCount: requestData._saleCount,
  // });
  // if (isUpdateFee) return CT_REQUEST.UpdateFee;

  return CT_REQUEST.WaitForReceive;
};

export const getRequestBlockTimestamp = (parmas: {
  status: CT_REQUEST | CT_REQUEST_CANCEL;
  requestData: T_FETCH_REQUEST_LIST_L2;
  l1CancelCTs: T_FETCH_CancelCTs_L1;
  cancelCTs: T_FETCH_CancelCTs;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  editCTs: T_FETCH_EditCTs;
}): CT_REQUEST_HISTORY_blockTimestamps | undefined => {
  const {
    status,
    requestData,
    cancelCTs,
    l1CancelCTs,
    providerClaimCTs,
    editCTs,
  } = parmas;

  const requestBlockTimestamp = Number(requestData.blockTimestamp);

  if (isInCT_REQUEST(status)) {
    switch (status) {
      case CT_REQUEST.WaitForReceive: {
        const isUpdatedFee = isRequestEdited({
          editCTs,
          saleCount: requestData._saleCount,
        });
        if (isUpdatedFee) {
          const editHistory = getEditCTTransaction({
            editCTs,
            saleCount: requestData._saleCount,
          });
          const updateFee = editHistory.map((edit) =>
            Number(edit.blockTimestamp)
          );
          return {
            request: requestBlockTimestamp,
            updateFee,
          };
        }
        return { request: requestBlockTimestamp };
      }
      case CT_REQUEST.Completed: {
        const isUpdatedFee = isRequestEdited({
          editCTs,
          saleCount: requestData._saleCount,
        });
        if (isUpdatedFee) {
          const editHistory = getEditCTTransaction({
            editCTs,
            saleCount: requestData._saleCount,
          });
          const updateFee = editHistory.map((edit) =>
            Number(edit.blockTimestamp)
          );
          const providerClaimCT = getTransaction_providerClaimCT({
            providerClaimCTs,
            saleCount: requestData._saleCount,
          });
          return {
            request: requestBlockTimestamp,
            updateFee,
            completed: Number(providerClaimCT.blockTimestamp),
          };
        }
        const providerClaimCT = getTransaction_providerClaimCT({
          providerClaimCTs,
          saleCount: requestData._saleCount,
        });
        if (providerClaimCT)
          return {
            request: requestBlockTimestamp,
            completed: Number(providerClaimCT.blockTimestamp),
          };
      }
    }
  }
  if (isInCT_REQUEST_CANCEL(status)) {
    const cancelCT = getCancelCTTransaction({
      cancelCTs: l1CancelCTs,
      saleCount: requestData._saleCount,
    });
    const cancelBlockTimestamp = Number(cancelCT[0].blockTimestamp);
    const isUpdatedFee = isRequestEdited({
      editCTs,
      saleCount: requestData._saleCount,
    });
    const editHistory = getEditCTTransaction({
      editCTs,
      saleCount: requestData._saleCount,
    });
    const updateFee = editHistory.map((edit) => Number(edit.blockTimestamp));
    switch (status) {
      case CT_REQUEST_CANCEL.Refund: {
        const isUpdatedFee = isRequestEdited({
          editCTs,
          saleCount: requestData._saleCount,
        });
        //Need to plus 500sec(5mins)
        //It's the waiting time for the user to confirm the refund
        if (isUpdatedFee) {
          return {
            request: requestBlockTimestamp,
            updateFee,
            cancelRequest: cancelBlockTimestamp,
            refund: cancelBlockTimestamp + 300,
          };
        }
        return {
          request: requestBlockTimestamp,
          cancelRequest: cancelBlockTimestamp,
          refund: cancelBlockTimestamp + 300,
        };
      }
      case CT_REQUEST_CANCEL.Completed: {
        if (isUpdatedFee)
          return {
            request: requestBlockTimestamp,
            updateFee,
            cancelRequest: cancelBlockTimestamp,
            completed: cancelBlockTimestamp,
          };
        return {
          request: requestBlockTimestamp,
          cancelRequest: cancelBlockTimestamp,
          completed: cancelBlockTimestamp,
        };
      }
    }
  }
  return undefined;
};

export const getRequestTransactionHash = (parmas: {
  status: CT_REQUEST | CT_REQUEST_CANCEL;
  requestData: T_FETCH_REQUEST_LIST_L2;
  l1CancelCTs: T_FETCH_CancelCTs_L1;
  cancelCTs: T_FETCH_CancelCTs;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  editCTs: T_FETCH_EditCTs;
}): CT_REQUEST_HISTORY_transactionHashes | undefined => {
  const {
    status,
    requestData,
    l1CancelCTs,
    cancelCTs,
    providerClaimCTs,
    editCTs,
  } = parmas;
  const requestTransactionHash = requestData.transactionHash;
  if (isInCT_REQUEST(status)) {
    const isUpdatedFee = isRequestEdited({
      editCTs,
      saleCount: requestData._saleCount,
    });
    switch (status) {
      case CT_REQUEST.WaitForReceive: {
        if (isUpdatedFee) {
          const editHistory = getEditCTTransaction({
            editCTs,
            saleCount: requestData._saleCount,
          });
          const updateFee = editHistory.map((edit) => edit.transactionHash);
          return {
            request: requestTransactionHash,
            updateFee,
            waitForReceive: "",
          };
        }
        return {
          request: requestTransactionHash,
          waitForReceive: "",
        };
      }
      case CT_REQUEST.Completed: {
        if (isUpdatedFee) {
          const editHistory = getEditCTTransaction({
            editCTs,
            saleCount: requestData._saleCount,
          });
          const updateFee = editHistory.map((edit) => edit.transactionHash);
          const providerClaimCT = getTransaction_providerClaimCT({
            providerClaimCTs,
            saleCount: requestData._saleCount,
          });
          return {
            request: requestTransactionHash,
            updateFee,
            completed: providerClaimCT.transactionHash,
          };
        }
        const providerClaimCT = getTransaction_providerClaimCT({
          providerClaimCTs,
          saleCount: requestData._saleCount,
        });
        return {
          request: requestTransactionHash,
          completed: providerClaimCT.transactionHash,
        };
      }
    }
  }
  if (isInCT_REQUEST_CANCEL(status)) {
    const isUpdatedFee = isRequestEdited({
      editCTs,
      saleCount: requestData._saleCount,
    });
    switch (status) {
      case CT_REQUEST_CANCEL.Refund: {
        const cancelCT = getCancelCTTransaction({
          cancelCTs: l1CancelCTs,
          saleCount: requestData._saleCount,
        });
        if (isUpdatedFee) {
          const editHistory = getEditCTTransaction({
            editCTs,
            saleCount: requestData._saleCount,
          });
          const updateFee = editHistory.map((edit) => edit.transactionHash);
          return {
            request: requestTransactionHash,
            updateFee,
            cancelRequest: cancelCT[0].transactionHash,
          };
        }
        return {
          request: requestTransactionHash,
          cancelRequest: cancelCT[0].transactionHash,
        };
      }
      case CT_REQUEST_CANCEL.Completed: {
        const cancelCT = getCancelCTTransaction({
          cancelCTs: l1CancelCTs,
          saleCount: requestData._saleCount,
        });
        const completed = getCancelCTTransaction({
          cancelCTs,
          saleCount: requestData._saleCount,
        });

        if (isUpdatedFee) {
          const editHistory = getEditCTTransaction({
            editCTs,
            saleCount: requestData._saleCount,
          });
          const updateFee = editHistory.map((edit) => edit.transactionHash);
          return {
            request: requestTransactionHash,
            updateFee,
            cancelRequest: cancelCT[0].transactionHash,
            completed: completed[0].transactionHash,
          };
        }
        return {
          request: requestTransactionHash,
          cancelRequest: cancelCT[0].transactionHash,
          completed: completed[0].transactionHash,
        };
      }
    }
  }
  return undefined;
};

export const getTokenInfo = (parmas: {
  requestData: T_FETCH_REQUEST_LIST_L2 | T_provideCTs_L1 | T_ProviderClaimCTs;
  ctAmount?: boolean;
  _editedctAmount?: string;
  isL1Token?: boolean;
}): {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
} => {
  const { requestData, ctAmount, _editedctAmount, isL1Token } = parmas;
  const isETH = isZeroAddress(requestData._l2token);
  const tokenInfo = getSupportedTokenForCT(
    isL1Token ? requestData._l1token : requestData._l2token
  );

  return {
    address: isETH ? ZERO_ADDRESS : requestData._l1token,
    name: isETH ? "ETH" : (tokenInfo?.tokenName as string),
    symbol: isETH ? "ETH" : (tokenInfo?.tokenSymbol as string),
    amount: ctAmount
      ? _editedctAmount ?? requestData._ctAmount
      : requestData._totalAmount,
    decimals: isETH ? 18 : (tokenInfo?.decimals as number),
  };
};

export const getRequestErrorMessage = (
  status: CT_REQUEST_STATUSES,
  blockTimestamp: CT_REQUEST_HISTORY_blockTimestamps
) => {
  if (isInCT_REQUEST_CANCEL(status)) {
    const _blockTimestamp =
      blockTimestamp as CT_REQUEST_HISTORY_blockTimestamps;
    console.log("_blockTimestamp", _blockTimestamp);
    if (_blockTimestamp.cancelRequest) {
      const isPassedCancelWaitingTime =
        _blockTimestamp.cancelRequest + 300 < Math.floor(Date.now() / 1000);
      return isPassedCancelWaitingTime
        ? ERROR_CODE.CT_REFUND_NOT_COMPLETED
        : undefined;
    }
  }

  return undefined;
};

export const getProvideErrorMessage = (
  status: CT_PROVIDE,
  blockTimestamp: CT_PROVIDE_HISTORY_blockTimestamps
) => {
  if (isInCT_Provide(status)) {
    const _blockTimestamp =
      blockTimestamp as CT_PROVIDE_HISTORY_blockTimestamps;
    if (_blockTimestamp.provide) {
      const isPassedProvideWaitingTime =
        _blockTimestamp.provide + 500 < Math.floor(Date.now() / 1000);
      return isPassedProvideWaitingTime
        ? ERROR_CODE.CT_LIQUIDITY_NOT_RETURNED
        : undefined;
    }
  }
  return undefined;
};
