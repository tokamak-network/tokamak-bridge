import { maxPrice, minPrice } from "@/recoil/pool/setPoolPosition";
import { useRecoilValue } from "recoil";

export function useGetPoolInput() {
  const minPriceInput = useRecoilValue(minPrice);
  const maxPriceInput = useRecoilValue(maxPrice);

  return { minPriceInput, maxPriceInput };
}
