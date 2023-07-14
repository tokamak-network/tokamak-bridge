import { PoolCardDetail } from "@/app/pools/components/PoolCard";
import { atom } from "recoil";

export const ATOM_positions = atom<PoolCardDetail[] | undefined>({
  key: "poistions",
  default: undefined,
});
