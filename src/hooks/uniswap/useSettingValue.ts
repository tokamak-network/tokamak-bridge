import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { Percent } from "@uniswap/sdk-core";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";

export function useSettingValue() {
  const txSettingValue = useRecoilValue(uniswapTxSetting);

  const slippage = useMemo(() => {
    return new Percent(Number(txSettingValue.slippage) * 100, 10_000);
  }, [txSettingValue.slippage]);

  const deadlineBySeconds = useMemo(() => {
    return Math.floor(Date.now() / 1000) + txSettingValue.deadline * 60;
  }, [txSettingValue.deadline]);

  const deadlineByMins = useMemo(() => {
    return txSettingValue.deadline;
  }, [txSettingValue.deadline]);

  return { slippage, deadlineBySeconds, deadlineByMins };
}
