import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import {
  T_FETCH_CancelCTs,
  T_FETCH_EditCTs,
  T_FETCH_ProviderClaimCTs,
  T_FETCH_REQUEST_LIST_L2,
  T_provideCTs_L1,
  T_ProviderClaimCTs,
} from "../hooks/useCrossTrade";
import {
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  CT_REQUEST_HISTORY_blockTimestamps,
  CT_REQUEST_HISTORY_transactionHashes,
  CT_REQUEST_STATUSES,
  isInCT_REQUEST,
  isInCT_REQUEST_CANCEL,
} from "../types/transaction";
import { ZERO_ADDRESS } from "@/constant/misc";
import { is } from "date-fns/locale";

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
  return editCTs.filter((editCT) => editCT._saleCount === saleCount);
};

export const getRequestStatus = (params: {
  requestData: T_FETCH_REQUEST_LIST_L2;
  cancelCTs: T_FETCH_CancelCTs;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  editCTs: T_FETCH_EditCTs;
}): CT_REQUEST_STATUSES => {
  const { requestData, cancelCTs, providerClaimCTs, editCTs } = params;

  const isCanceled = isRequestCanceled({
    cancelCTs,
    saleCount: requestData._saleCount,
  });
  if (isCanceled) return CT_REQUEST_CANCEL.CancelRequest;

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
  cancelCTs: T_FETCH_CancelCTs;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  editCTs: T_FETCH_EditCTs;
}): CT_REQUEST_HISTORY_blockTimestamps | undefined => {
  const { status, requestData, cancelCTs, providerClaimCTs, editCTs } = parmas;

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
        if (isUpdatedFee) return undefined;
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
  }
  return undefined;
};

export const getRequestTransactionHash = (parmas: {
  status: CT_REQUEST | CT_REQUEST_CANCEL;
  requestData: T_FETCH_REQUEST_LIST_L2;
  cancelCTs: T_FETCH_CancelCTs;
  providerClaimCTs: T_FETCH_ProviderClaimCTs;
  editCTs: T_FETCH_EditCTs;
}): CT_REQUEST_HISTORY_transactionHashes | undefined => {
  const { status, requestData, cancelCTs, providerClaimCTs, editCTs } = parmas;
  const requestTransactionHash = requestData.transactionHash;
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
        const isUpdatedFee = isRequestEdited({
          editCTs,
          saleCount: requestData._saleCount,
        });
        if (isUpdatedFee) return undefined;
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
  }
  return undefined;
};

export const getTokenInfo = (parmas: {
  requestData: T_FETCH_REQUEST_LIST_L2 | T_provideCTs_L1 | T_ProviderClaimCTs;
  ctAmount?: boolean;
}): {
  address: string;
  name: string;
  symbol: string;
  amount: string;
  decimals: number;
} => {
  const { requestData, ctAmount } = parmas;
  const isETH = isZeroAddress(requestData._l2token);

  return {
    address: isETH ? ZERO_ADDRESS : requestData._l1token,
    name: isETH ? "ETH" : "TON",
    symbol: isETH ? "ETH" : "TON",
    amount: ctAmount ? requestData._ctAmount : requestData._totalAmount,
    decimals: 18,
  };
};
