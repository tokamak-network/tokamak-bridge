import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import { useRecoilValue } from "recoil";
import { usePositionInfo } from "./useGetPositionIds";
import { useMemo } from "react";

export function useConvertWETH() {
  const { info } = usePositionInfo();
  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);

  const token0Symbol = useMemo(() => {
    if (collectAsWETH === true && info?.token0.symbol === "ETH") {
      return "WETH";
    }
    return info?.token0.symbol;
  }, [info?.token0.symbol, collectAsWETH]);

  const token1Symbol = useMemo(() => {
    if (collectAsWETH === true && info?.token1.symbol === "ETH") {
      return "WETH";
    }
    return info?.token1.symbol;
  }, [info?.token1.symbol, collectAsWETH]);

  return { token0Symbol, token1Symbol };
}
