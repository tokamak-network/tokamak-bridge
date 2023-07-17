import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { atom } from "recoil";

export const ATOM_positions = atom<PoolCardDetail[] | undefined>({
  key: "poistions",
  default: undefined,
});

export const ATOM_manuallyInverted = atom<boolean>({
  key: "manuallyInverted",
  default: false,
});
