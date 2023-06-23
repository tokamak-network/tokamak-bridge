import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { useRecoilValue } from "recoil";

export default function useUniswapTxSetting() {
  const uniswapTxSettingValueForUI = useRecoilValue(uniswapTxSetting);

  return { uniswapTxSettingValueForUI };
}
