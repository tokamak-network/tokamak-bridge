import { actionMode } from "@/recoil/bridgeSwap/atom";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";
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

  const pathname = usePathname();
  const isPool = pathname.includes("pools");

  
  
  return {
    mode: isPool ? "Pool" :  mode,
    swapSection,
    isReady,
  };
}
