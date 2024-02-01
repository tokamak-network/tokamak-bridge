import { atom } from "recoil";

export const inputTokenAmountOpenedStatus = atom<boolean>({
  key: "inputTokenAmountOpenStatus",
  default: false,
});
