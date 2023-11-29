import { atom } from "recoil";

export const handUiOpenedStatus = atom<boolean>({
  key: "searchTokenStatus",
  default: false,
});
