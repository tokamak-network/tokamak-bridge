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

export const poolModalStatus = atom<
  "colectFee" | "increaseLiquidity" | "removeLiquidity" | null
>({
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