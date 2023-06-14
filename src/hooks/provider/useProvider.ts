import { getL1Provider } from "@/config/l1Provider";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";
import { useInOutNetwork } from "../network";
import { getL2Provider } from "@/config/l2Provider";

export function useProvier() {
  const { inNetwork } = useInOutNetwork();
  const provider =
    inNetwork?.layer === "L1" ? getL1Provider() : getL2Provider();

  return { provider };
}