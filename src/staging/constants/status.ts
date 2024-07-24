import {
  CT_PROVIDE,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  Status,
} from "@/staging/types/transaction";

export const STATUS_CONFIG = {
  WITHDRAW: [Status.Initiate, Status.Rollup, Status.Finalize],
  DEPOSIT: [Status.Initiate, Status.Finalize],
  REQUEST: [CT_REQUEST.Request, CT_REQUEST.WaitForReceive],
  REQUEST_CANCEL: [
    CT_REQUEST_CANCEL.Request,
    CT_REQUEST_CANCEL.CancelRequest,
    CT_REQUEST_CANCEL.Refund,
  ],
  PROVIDE: [CT_PROVIDE.Provide, CT_PROVIDE.Return],
};
