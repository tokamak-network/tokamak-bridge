import {
  maxPrice as maxPriceStatus,
  minPrice as minPriceStatus,
} from "@/recoil/pool/setPoolPosition";
import { useRecoilValue } from "recoil";

export function useGetPoolInput() {
  const minPriceInput = useRecoilValue(minPriceStatus);
  const maxPriceInput = useRecoilValue(maxPriceStatus);

  return { minPriceInput, maxPriceInput };
}
