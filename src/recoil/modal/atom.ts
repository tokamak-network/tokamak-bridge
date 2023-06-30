import { atom } from "recoil";

export const transactionModalStatus = atom<
  "confirming" | "confirmed" | "error" | null
>({
  key: "transactionModalStatus",
  default: null,
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
