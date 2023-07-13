import { atom } from "recoil";

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

export const confirmWithdraw = atom <boolean>({
  key: "confirmWithdraw",
  default: false,
})