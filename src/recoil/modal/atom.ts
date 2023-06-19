import { atom } from "recoil";

export const transactionModalStatus = atom<
  "confirming" | "confirmed" | "error" | null
>({
  key: "transactionModalStatus",
  default: null,
});

export const accountDrawerStatus = atom<boolean>({
  key: "accountDrawerStatus",
  default: false,
});

export const poolModalStatus = atom<
  "colectFee" | "increaseLiquidity" | "removeLiquidity" | null
>({
  key: "transactionModalStatus",
  default: null,
});
