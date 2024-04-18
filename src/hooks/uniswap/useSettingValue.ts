import { uniswapTxSetting } from "@/recoil/uniswap/setting";
import { Percent } from "@uniswap/sdk-core";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";

export function useSettingValue() {
  const txSettingValue = useRecoilValue(uniswapTxSetting);

  const slippage = useMemo(() => {
    const slippageValue = Number(txSettingValue.slippage);
    const roundedSlippage = (slippageValue * 100).toFixed(2);
    return new Percent(Number(roundedSlippage), 10_000);
  }, [txSettingValue.slippage]);

  const initialDeadline = txSettingValue.deadline * 60;
  const [deadlineBySeconds, setDeadlineInSeconds] = useState(
    Math.floor(Date.now() / 1000) + initialDeadline
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDeadlineInSeconds((prevDeadline) => prevDeadline + 1);
    }, 1000); //update every second

    return () => clearInterval(interval);
  }, [txSettingValue.deadline]);

  const deadlineByMins = useMemo(() => {
    return txSettingValue.deadline;
  }, [txSettingValue.deadline]);

  return { slippage, deadlineBySeconds, deadlineByMins };
}
