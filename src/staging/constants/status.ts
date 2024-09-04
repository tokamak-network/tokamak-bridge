import {
  CT_PROVIDE,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  Status,
} from "@/staging/types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { isThanosChain } from "@/utils/network/checkNetwork";

export const STATUS_CONFIG = {
  WITHDRAW: [Status.Initiate, Status.Rollup, Status.Finalize],
  DEPOSIT: [Status.Initiate, Status.Finalize],
  REQUEST: [CT_REQUEST.Request, CT_REQUEST.WaitForReceive],
  REQUEST_UPDATE_FEE: [
    CT_REQUEST.Request,
    CT_REQUEST.UpdateFee,
    CT_REQUEST.WaitForReceive,
  ],
  REQUEST_UPDATE_FEES: [
    CT_REQUEST.Request,
    CT_REQUEST.UpdateFee,
    CT_REQUEST.UpdateFee,
    CT_REQUEST.WaitForReceive,
  ],
  REQUEST_CANCEL: [
    CT_REQUEST_CANCEL.Request,
    CT_REQUEST_CANCEL.CancelRequest,
    CT_REQUEST_CANCEL.Refund,
  ],
  REQUEST_CANCEL_FEE: [
    CT_REQUEST_CANCEL.Request,
    CT_REQUEST.UpdateFee,
    CT_REQUEST_CANCEL.CancelRequest,
    CT_REQUEST_CANCEL.Refund,
  ],
  REQUEST_CANCEL_FEES: [
    CT_REQUEST_CANCEL.Request,
    CT_REQUEST.UpdateFee,
    CT_REQUEST.UpdateFee,
    CT_REQUEST_CANCEL.CancelRequest,
    CT_REQUEST_CANCEL.Refund,
  ],
  PROVIDE: [CT_PROVIDE.Provide, CT_PROVIDE.Return],
};

export const getStatusConfig = (
  inNetwork: SupportedChainId,
  outNetwork: SupportedChainId
) => {
  if (isThanosChain(inNetwork) || isThanosChain(outNetwork))
    return {
      ...STATUS_CONFIG,
      WITHDRAW: [Status.Initiate, Status.Prove, Status.Finalize],
    };
  return STATUS_CONFIG;
};
