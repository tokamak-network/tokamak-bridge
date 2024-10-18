import { atom, selector } from "recoil";

export const claimTx = atom<any>({
  key: "claimTx",
  default: undefined,
});
