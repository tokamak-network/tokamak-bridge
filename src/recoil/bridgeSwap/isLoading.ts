import { atom } from "recoil";

export const loadingStatus = atom<boolean>({
  key: "loadingStatus",
  default: false,
});

export const mobileLoadingStatus = atom<boolean>({
  key: "mobileLoadingStatus",
  default: false,
});
