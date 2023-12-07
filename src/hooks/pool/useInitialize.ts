import { useRecoilState } from "recoil";
import { useInOutTokens } from "../token/useInOutTokens";
import {
  atMaxTick,
  atMinTick,
  initialPrice,
  maxPrice,
  minPrice,
  poolFeeStatus,
  removeAmount,
} from "@/recoil/pool/setPoolPosition";
import { useCallback } from "react";
import { estimatedGasFee } from "@/recoil/global/transaction";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";

export function useInitialize() {
  const { initializeTokenPair, initializeTokenPairAmount } = useInOutTokens();
  const [, setPoolFee] = useRecoilState(poolFeeStatus);
  const [, setAtMinTick] = useRecoilState(atMinTick);
  const [, setAtMaxTick] = useRecoilState(atMaxTick);
  const [, setMinPrice] = useRecoilState(minPrice);
  const [, setMaxPrice] = useRecoilState(maxPrice);
  const [, setInitialPrice] = useRecoilState(initialPrice);
  const [, setAmountPercentage] = useRecoilState(removeAmount);
  const [, setEstimatedGasFee] = useRecoilState(estimatedGasFee);
  const initialzePoolValues = useCallback(() => {
    setAtMinTick(false);
    setAtMaxTick(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    initializeTokenPair();
    setInitialPrice("0");
    setAmountPercentage(0);
    setEstimatedGasFee(undefined);
    return setPoolFee(undefined);
  }, [initializeTokenPair, setPoolFee]);

  const initializePoolValuesForSelectingFee = useCallback(() => {
    setAtMinTick(false);
    setAtMaxTick(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setInitialPrice("0");
    initializeTokenPairAmount();
  }, [initializeTokenPair, setPoolFee]);

  const [, setCollectAsWETH] = useRecoilState(ATOM_collectWethOption);

  const initializeInfoValues = useCallback(() => {
    setCollectAsWETH(false);
  }, [setCollectAsWETH]);

  return {
    initialzePoolValues,
    initializePoolValuesForSelectingFee,
    initializeInfoValues,
  };
}
