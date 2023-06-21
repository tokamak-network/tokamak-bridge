import { loadingStatus } from "@/recoil/bridgeSwap/isLoading";
import { useRecoilState } from "recoil";

export default function useIsLoading() {
  const loading = useRecoilState(loadingStatus);

  return loading;
}
