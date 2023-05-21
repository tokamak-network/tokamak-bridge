import { useCallback } from "react";
import { selectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";

export default function useCallDeposit() {
  const inTokenInfo = useRecoilValue(selectedInTokenStatus);

  const callDeposit = useCallback(() => {}, []);

  return { callDeposit };
}
