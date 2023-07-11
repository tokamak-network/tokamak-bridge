import {
  maxPrice as maxPriceStatus,
  minPrice as minPriceStatus,
} from "@/recoil/pool/setPoolPosition";
import { useRecoilState, useRecoilValue } from "recoil";
import { usePriceTickConversion } from "./usePoolData";
import { useEffect } from "react";

export function useGetPoolInput() {
  const minPriceInput = useRecoilValue(minPriceStatus);
  const maxPriceInput = useRecoilValue(maxPriceStatus);

  return { minPriceInput, maxPriceInput };
}
