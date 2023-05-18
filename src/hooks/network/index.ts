import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";

export default function useNetwork() {
  const network = useRecoilValue(networkStatus);

  return { ...network };
}
