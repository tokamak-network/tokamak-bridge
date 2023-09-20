import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { atom } from "recoil";

export const ATOM_positions = atom<PoolCardDetail[] | undefined>({
  key: "poistions",
  default: undefined,
});

export const ATOM_positionForInfo = atom<PoolCardDetail[] | undefined>({
  key: "poistionsForInfo",
  default: undefined,
});

export const ATOM_positionForInfo_loading = atom<boolean>({
  key: "poistionsForInfoLoading",
  default: false,
});

export const ATOM_positions_loading = atom<boolean>({
  key: "positionsLoading",
  default: false,
});

export const ATOM_manuallyInverted = atom<boolean>({
  key: "manuallyInverted",
  default: false,
});

export const ATOM_collectWethOption = atom<boolean>({
  key: "collectWethOption",
  default: false,
});

export const ATOM_addInverted = atom<boolean>({
  key: "addInterted",
  default: false,
});
