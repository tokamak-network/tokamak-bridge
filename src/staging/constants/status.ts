import { CT_PROVIDE, CT_REQUEST, Status } from "@/staging/types/transaction";

export const STATUS_CONFIG = {
  WITHDRAW: [Status.Initiate, Status.Rollup, Status.Finalize],
  DEPOSIT: [Status.Initiate, Status.Finalize],
  REQUEST: [
    CT_REQUEST.Request,
    CT_REQUEST.UpdateFee,
    CT_REQUEST.WaitForReceive,
  ],
  PROVIDE: [CT_PROVIDE.Provide, CT_PROVIDE.Return],
};
