import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";

export function useGetMode() {
  const { mode } = useRecoilValue(actionMode);

  return { mode };
}
