import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { atom } from "recoil";
import {
  Duration,
} from "date-fns";

type withdrawModal = {
  isOpen: boolean;
  modalData?: any;
}
export const transactionModalStatus = atom<
  "confirming" | "confirmed" | "error" | null
>({
  key: "transactionModalStatus",
  default: null,
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

export const confirmWithdraw = atom <withdrawModal>({
  key: "confirmWithdraw",
  default: {
    isOpen:false,
    modalData :null

  },
})
export const poolModalProp = atom<PoolCardDetail | undefined>({
  key: "poolModalPropStatus",
  default: undefined,
});
