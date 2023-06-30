import { atom } from "recoil";

export const txProgressModal = atom<boolean>({
  key: "txProgressModal",
  default: false,
});
