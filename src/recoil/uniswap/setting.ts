import { Percent } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { atom, selector } from "recoil";

type UniswapTxSettingInput = {
  slippage: string;
  deadline: number;
};

type UniswapTxSetting = {
  slippage: Percent;
  deadline: number;
};

export const uniswapTxSetting = atom<UniswapTxSettingInput>({
  key: "uniswapTxSetting",
  default: {
    slippage: "0.5", // 50 bips, or 0.50%
    deadline: 20, // 20 minutes from the current Unix time
  },
});

//they will be used option parameters to swap and interact with pool contracts
export const uniswapTxSettingSelector = selector<UniswapTxSetting>({
  key: "uniswapTxSettingSelector",
  get: ({ get }) => {
    const uniswapTxSettingStatus = get(uniswapTxSetting);
    const { slippage, deadline } = uniswapTxSettingStatus;

    return {
      slippage: new Percent(Number(slippage.replaceAll(".", "")) * 100, 10_000),
      deadline,
    };
  },
});
