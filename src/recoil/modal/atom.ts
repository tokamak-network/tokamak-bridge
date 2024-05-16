import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { FwConfirmModalType, ModalType } from "@/components/fw/types";
import { atom } from "recoil";

type withdrawModal = {
  isOpen: boolean;
  modalData?: any;
};
export const transactionModalStatus = atom<
  "confirming" | "confirmed" | "error" | null
>({
  key: "transactionModalStatus",
  default: null,
});

export const claimModalStatus = atom<boolean>({
  key: "claimModalStatus",
  default: false,
});
export const transactionModalOpenStatus = atom<boolean>({
  key: "transactionModalOpenStatus",
  default: false,
});

export const confirmModalStatus = atom<boolean>({
  key: "confirmModalStatus",
  default: false,
});

export const accountDrawerStatus = atom<boolean>({
  key: "accountDrawerStatus",
  default: false,
});

export type T_PoolModal =
  | "collectFee"
  | "increaseLiquidity"
  | "removeLiquidity"
  | "addLiquidity"
  | null;

export const poolModalStatus = atom<T_PoolModal>({
  key: "poolModalStatus",
  default: null,
});

export const confirmWithdrawData = atom<any>({
  key: "confirmWithdrawData",
  default: {
    modalData: null,
  },
});
export const confirmWithdrawStats = atom<withdrawModal>({
  key: "confirmWithdrawStats",
  default: {
    isOpen: false,
  },
});

export const poolModalProp = atom<PoolCardDetail | undefined>({
  key: "poolModalPropStatus",
  default: undefined,
});

export const mobileMenuStatus = atom<boolean>({
  key: "mobileMenuStatus",
  default: false,
});

export const actionMethodStatus = atom<boolean>({
  key: "actionMethodStatus",
  default: true,
});

export const swapSettingStatus = atom<boolean>({
  key: "swapSettingStatus",
  default: false,
});

export const fwConfirmModalStatus = atom<FwConfirmModalType>({
  key: "fwConfirmModalStatus",
  default: {
    isOpen: false,
    type: ModalType.Trade,
  },
});

export const fwOptionModalStatus = atom<boolean>({
  key: "fwOptionModalStatus",
  default: false,
});

export const fwUpdateFeeModalStatus = atom<boolean>({
  key: "fwUpdateFeeModalStatus",
  default: false,
});
