import { atom } from "recoil";

export const ATOM_CT_GAS_provideCT = atom<bigint | undefined>({
  key: "ATOM_CT_GAS_provideCT",
  default: undefined,
});

export const ATOM_CT_GAS_editCT = atom<bigint | undefined>({
  key: "ATOM_CT_GAS_editCT",
  default: undefined,
});

export const ATOM_CT_GAS_cancelCT = atom<bigint | undefined>({
  key: "ATOM_CT_GAS_cancelCT",
  default: undefined,
});
