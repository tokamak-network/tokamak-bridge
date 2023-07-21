import { useRecoilState } from "recoil";
import { useInOutTokens } from "../token/useInOutTokens";
import { poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { useCallback } from "react";

export function useInitialize() {
  const { initializeTokenPair } = useInOutTokens();
  const [, setPoolFee] = useRecoilState(poolFeeStatus);

  const initialzePoolValues = useCallback(() => {
    initializeTokenPair();
    return setPoolFee(undefined);
  }, [initializeTokenPair, setPoolFee]);

  return { initialzePoolValues };
}
