import { atom } from "recoil";

export const handUiOpenedStatus = atom<boolean>({
  key: "handUiOpenStatus",
  default: false,
});
