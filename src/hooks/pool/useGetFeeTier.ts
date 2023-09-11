import { poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export function useGetFeeTier() {
  const feeTier = useRecoilValue(poolFeeStatus);

  return useMemo(() => {
    return { feeTier };
  }, [feeTier]);
}
