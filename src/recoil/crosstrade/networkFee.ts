import { atom } from "recoil";

export const ATOM_CT_GAS_provideCT = atom<bigint | undefined>({
  key: "ATOM_CT_GAS_provideCT",
  default: undefined,
});
