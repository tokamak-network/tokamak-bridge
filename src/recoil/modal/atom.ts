import { atom } from "recoil";

export const transactionModalStatus = atom<"confirming" | "confirmed" | null>({
  key: "transactionModalStatus",
  default: null,
});
