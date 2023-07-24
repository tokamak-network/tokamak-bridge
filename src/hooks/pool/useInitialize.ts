import { useRecoilState } from "recoil";
import { useInOutTokens } from "../token/useInOutTokens";
import {
  atMaxTick,
  atMinTick,
  maxPrice,
  minPrice,
  poolFeeStatus,
} from "@/recoil/pool/setPoolPosition";
import { useCallback } from "react";

export function useInitialize() {
  const { initializeTokenPair } = useInOutTokens();
  const [, setPoolFee] = useRecoilState(poolFeeStatus);
  const [, setAtMinTick] = useRecoilState(atMinTick);
  const [, setAtMaxTick] = useRecoilState(atMaxTick);
  const [, setMinPrice] = useRecoilState(minPrice);
  const [, setMaxPrice] = useRecoilState(maxPrice);

  const initialzePoolValues = useCallback(() => {
    setAtMinTick(false);
    setAtMaxTick(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    initializeTokenPair();
    return setPoolFee(undefined);
  }, [initializeTokenPair, setPoolFee]);

  return { initialzePoolValues };
}
