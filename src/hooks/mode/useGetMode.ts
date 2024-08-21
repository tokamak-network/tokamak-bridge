import { actionMode } from "@/recoil/bridgeSwap/atom";
import { ATOM_pool_page, ButtonType_Pools } from "@/recoil/pool/pages";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
export function useGetMode() {
  const { mode, isReady } = useRecoilValue(actionMode);
  const poolsPage = useRecoilValue(ATOM_pool_page);

  const swapSection = useMemo(() => {
    if (mode) {
      return (
        mode === "Swap" ||
        mode === "Wrap" ||
        mode === "Unwrap" ||
        mode === "ETH-Wrap" ||
        mode === "ETH-Unwrap"
      );
    }
  }, [mode]);

  const pathname = usePathname();
  const isPool = pathname?.includes("pools");
  const add = pathname?.includes("add");
  const increase = pathname?.includes("increase");
  const remove = pathname?.includes("remove");
  const claim = pathname?.includes("claim");
  const ctPools = poolsPage === ButtonType_Pools.CROSS_TRADE;

  return {
    mode: isPool ? "Pool" : mode,
    swapSection,
    isReady,
    subMode: {
      add,
      increase,
      remove,
      claim,
      ctPools,
    },
  };
}
