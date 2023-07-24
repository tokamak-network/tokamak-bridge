import { useRecoilState } from "recoil";
import { useInOutTokens } from "../token/useInOutTokens";
import {
  atMaxTick,
  atMinTick,
  poolFeeStatus,
} from "@/recoil/pool/setPoolPosition";
import { useCallback } from "react";

export function useInitialize() {
  const { initializeTokenPair } = useInOutTokens();
  const [, setPoolFee] = useRecoilState(poolFeeStatus);
  const [, setAtMinTick] = useRecoilState(atMinTick);
  const [, setAtMaxTick] = useRecoilState(atMaxTick);

  const initialzePoolValues = useCallback(() => {
    setAtMinTick(false);
    setAtMaxTick(false);
    initializeTokenPair();
    return setPoolFee(undefined);
  }, [initializeTokenPair, setPoolFee]);

  return { initialzePoolValues };
}
