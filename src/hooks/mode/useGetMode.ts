import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export function useGetMode() {
  const { mode, isReady } = useRecoilValue(actionMode);
  const swapSection = useMemo(() => {
    return (
      mode === "Swap" ||
      mode === "Wrap" ||
      mode === "Unwrap" ||
      mode === "ETH-Wrap" ||
      mode === "ETH-Unwrap"
    );
  }, [mode]);

  return { mode, swapSection, isReady };
}
