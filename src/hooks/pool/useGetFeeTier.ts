import { poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { useRecoilValue } from "recoil";

export function useGetFeeTier() {
  const feeTier = useRecoilValue(poolFeeStatus);

  return { feeTier };
}
