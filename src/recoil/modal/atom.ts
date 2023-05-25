import { atom } from "recoil";

export const transactionModalStatus = atom<"confirming" | "confirmed" | null>({
  key: "transactionModalStatus",
  default: null,
});

export const accountDrawerStatus = atom<boolean>({
  key: "accountDrawerStatus",
  default: false,
});
