import { useMemo, useState } from "react";
import { useGetFeeTier } from "./useGetFeeTier";
import { useInOutTokens } from "../token/useInOutTokens";
import { useRecoilValue } from "recoil";
import {
  initialPrice,
  maxPrice,
  minPrice,
} from "@/recoil/pool/setPoolPosition";
import { usePool } from "./usePool";
import { PoolState } from "@/types/pool/pool";

export function useAddLiquidityCondition() {
  const { feeTier } = useGetFeeTier();
  const { inToken, outToken } = useInOutTokens();
  //first step check
  //network, fee, token pair selected
  const firstStepPassed: boolean = useMemo(() => {
    if (feeTier && inToken && outToken) return true;
    return false;
  }, [feeTier, inToken, outToken]);

  const minPriceInput = useRecoilValue(minPrice);
  const maxPriceInput = useRecoilValue(maxPrice);
  const inputIntialPrice = useRecoilValue(initialPrice);

  const [poolStatus] = usePool();

  //second step check
  //price range selected
  const secondStepPassed: boolean = useMemo(() => {
    if (
      poolStatus === PoolState.NOT_EXISTS &&
      Number(inputIntialPrice) !== 0 &&
      minPriceInput &&
      maxPriceInput
    )
      return true;
    if (firstStepPassed && minPriceInput && maxPriceInput) return true;
    return false;
  }, [
    firstStepPassed,
    minPriceInput,
    maxPriceInput,
    poolStatus,
    inputIntialPrice,
  ]);

  const priceInitialized = useMemo(() => {
    if (poolStatus === PoolState.NOT_EXISTS && Number(inputIntialPrice) !== 0)
      return true;
    if (poolStatus !== PoolState.NOT_EXISTS) return true;
    return false;
  }, [poolStatus, inputIntialPrice]);

  //third step check
  //token input selected
  const [thirdStepPassed, setThirdStepPassed] = useState<boolean>(false);

  return {
    firstStepPassed,
    secondStepPassed,
    thirdStepPassed,
    priceInitialized,
  };
}
