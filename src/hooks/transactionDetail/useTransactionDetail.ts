import { useMemo } from "react";
import { useGasFee } from "../contracts/fee/getGasFee";
import { useRecoilValue } from "recoil";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useInOutTokens } from "../token/useInOutTokens";
import commafy from "@/utils/trim/commafy";
import { isBiggerThanMinimumNum } from "@/utils/number/compareNumbers";
import { useSwapTokens } from "../swap/useSwapTokens";
import usePriceImpact from "../swap/usePriceImpact";
import useConfirm from "../modal/useConfirmModal";
import useUniswapTxSetting from "../uniswap/useUniswapTxSetting";
import useConnectedNetwork from "../network";
import useMediaView from "../mediaView/useMediaView";
import { useGetMarketPrice } from "../price/useGetMarketPrice";

export type DepositDetailProp = {
  title: string;
  content: string;
  tooltip?: boolean;
  tooltipLabel?: string;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: string;
    l2Gas: string;
    l1GasUS: string;
    l2GasUS: string;
  };
};

export type WithdrawDetailNewProp = {
  title: string;
  content: string;
  tooltip?: boolean;
  tooltipLabel?: string;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: string;
    l2Gas: string;
    l1GasUS: string;
    l2GasUS: string;
  };
};

export type WithdrawDetailProp = {
  title: string;
  content: string;
  tooltip?: boolean;
  tooltipLabel?: string;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: { eth: string; ton: string };
    l2Gas: { eth: string; ton: string };
  };
};

export type WrapDetailProp = {
  title: string;
  gasFee?: string;
  gasFeeUS?: string;
};

export type SwapDetailProp = {
  // title?:
  //   | "Expected output"
  //   | "Minimum received"
  //   | "Minimum received after slippage"
  //   | "Price impact"
  //   | "Estimated gas fees"
  //   | "Estimated L2 execution fee (sans L1 fee)";
  title?: string;
  content?: string | undefined;
  gasFee?: string;
  slippage?: string;
};

export function useTransactionDetail() {
  const { mode } = useRecoilValue(actionMode);
  const { inToken, outToken } = useInOutTokens();
  const { totalGasCost, gasCostUS } = useGasFee();
  const { mobileView } = useMediaView();
  const { isOpen } = useConfirm();

  const totalGasFee = `${
    isBiggerThanMinimumNum(Number(totalGasCost))
      ? commafy(totalGasCost, 4)
      : "< 0.0001"
  } ETH`;

  const inputAmount = `${commafy(
    inToken?.parsedAmount?.replaceAll(",", ""),
    4
  )} ${inToken?.tokenSymbol}`;

  const depositPropsData: DepositDetailProp[] | null = useMemo(() => {
    if (mode === "Deposit" && inToken && totalGasCost) {
      return [
        {
          title: "Estimated gas fees",
          content: "",
          gasFee: {
            l1Gas: totalGasFee,
            l2Gas: "0 ETH",
            l1GasUS: gasCostUS ?? "",
            l2GasUS: "0",
          },
          tooltip: true,
          tooltipLabel: `${commafy(totalGasCost, 18)} ETH`,
        },
        {
          title: "Time to Deposit",
          content: "~1 minutes",
        },
      ];
      // return isOpen && mobileView
      //   ? [
      //       {
      //         title: "Estimated gas fees",
      //         content: totalGasFee,
      //         gasFee: {
      //           l1Gas: totalGasFee,
      //           l2Gas: "0 ETH",
      //           l1GasUS: gasCostUS ?? "",
      //           l2GasUS: "0",
      //         },
      //         tooltip: true,
      //         tooltipLabel: `${commafy(totalGasCost, 18)} ETH`,
      //       },
      //       {
      //         title: "Time to Deposit",
      //         content: "~5 minutes",
      //       },
      //     ]
      //   : [
      //       {
      //         title: "Amount to Deposit",
      //         content: inputAmount,
      //       },
      //       {
      //         title: "Estimated gas fees",
      //         content: totalGasFee,
      //         gasFee: {
      //           l1Gas: totalGasFee,
      //           l2Gas: "0 ETH",
      //           l1GasUS: gasCostUS ?? "",
      //           l2GasUS: "0",
      //         },
      //         tooltip: true,
      //         tooltipLabel: `${commafy(totalGasCost, 18)} ETH`,
      //       },
      //       {
      //         title: "Time to Deposit",
      //         content: "~5 minutes",
      //       },
      //     ];
    }
    return null;
  }, [
    mode,
    inToken,
    totalGasFee,
    inputAmount,
    totalGasCost,
    mobileView,
    isOpen,
  ]);

  const totalGasFeeToWithdraw = Number(totalGasCost) + 0.00024511191632554;

  const withdrawNewPropsData: WithdrawDetailNewProp[] | null = useMemo(() => {
    //need to put totalGasCost condition later
    if (mode === "Withdraw" && inToken) {
      return [
        {
          title: "Amount to Withdraw",
          content: inputAmount,
        },
        {
          title: "Estimated gas fees",
          content: `${commafy(totalGasFeeToWithdraw, 4)} ETH`,
          gasFee: {
            //fixed l1 gasFee for a while
            //0.00024511191632554 ETH
            l1Gas: "0.0002 ETH",
            l2Gas: `${totalGasFee}`,
            l1GasUS: "",
            l2GasUS: `${gasCostUS}`,
          },
          tooltip: true,
          tooltipLabel: `${commafy(totalGasFeeToWithdraw, 18)} ETH`,
        },
        {
          title: "Time to Withdraw",
          content: "approximately 7 days",
        },
      ];
    }
    return null;
  }, [mode, inToken, totalGasFee, inputAmount, totalGasCost]);

  const withdrawPropsData: WithdrawDetailProp[] | null = useMemo(() => {
    if (mode === "Withdraw" && inToken && totalGasFee) {
      return [
        {
          title: "Amount to Withdraw",
          content: inputAmount,
        },
        {
          title: "Estimated gas fees",
          content: totalGasFee,
          gasFee: {
            //fixed l1 gasFee for a while
            l1Gas: { eth: "0.00024511191632554 ETH", ton: "0.0022 TON" },
            l2Gas: { eth: totalGasFee, ton: "0.0022 TON" },
          },
        },
        {
          title: "Time to Withdraw",
          content: "approximately 7 days",
        },
      ];
    }
    return null;
  }, [mode, inToken, totalGasFee, inputAmount]);

  const { amountOut, minimumReceived } = useSwapTokens();
  const { priceImpact } = usePriceImpact();
  const { uniswapTxSettingValueForUI } = useUniswapTxSetting();
  const { layer } = useConnectedNetwork();
  const isWrapUnwrap =
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Wrap" ||
    mode === "ETH-Unwrap";
  const { outPrice } = usePriceImpact();
  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  const swapPropsData: SwapDetailProp[] | null = useMemo(() => {
    if (mode === "Swap" && inToken) {
      return mobileView && isOpen
        ? [
            {
              title: `1 ${inToken?.tokenSymbol} = ${
                isWrapUnwrap ? 1 : commafy(outPrice, 4)
              } ${outToken?.tokenSymbol}`,
              slippage: `$${inTokenWithPrice || "0"}`,
              content: "",
            },
            {
              title: "Minimum after slippage",
              content: `${commafy(minimumReceived, 4)} ${
                outToken?.tokenSymbol
              }`,
              slippage: `${uniswapTxSettingValueForUI.slippage}%`,
            },
          ]
        : [
            {
              title: isOpen
                ? "Minimum received"
                : "Min receivable",
              content: `${commafy(minimumReceived, 4)} ${
                outToken?.tokenSymbol
              }`,
              slippage: `${uniswapTxSettingValueForUI.slippage}%`,
            },
            {
              title: "Estimated gas fee",
              // content: isOpen ? "" : `${totalGasFee} `,
              content: "",
              gasFee: `$${gasCostUS}`,
            },
          ];
      // [
      //     {
      //       title: "Expected output",
      //       content: `${commafy(amountOut, 4)} ${outToken?.tokenSymbol}`,
      //     },
      //     {
      //       title: isOpen
      //         ? "Minimum received"
      //         : "Minimum received after slippage",
      //       content: `${commafy(minimumReceived, 4)} ${
      //         outToken?.tokenSymbol
      //       }`,
      //       slippage: `${uniswapTxSettingValueForUI.slippage}%`,
      //     },
      //     {
      //       title: "Estimated gas fees",
      //       content: isOpen ? "" : `${totalGasFee} `,
      //       gasFee: `$${gasCostUS}`,
      //     },
      //   ];
    }

    return null;
  }, [
    mode,
    inToken,
    outToken,
    inputAmount,
    amountOut,
    priceImpact,
    uniswapTxSettingValueForUI,
    totalGasFee,
    layer,
    isOpen,
    mobileView,
  ]);

  const WrapUnwrapPropsData: WrapDetailProp[] | null = useMemo(() => {
    return [
      {
        title: "Estimated gas fees",
        gasFee: `${totalGasFee} `,
        gasFeeUS: `$${gasCostUS}`,
      },
    ];
  }, [
    mode,
    inToken,
    outToken,
    inputAmount,
    amountOut,
    totalGasFee,
    gasCostUS,
    layer,
  ]);
  return {
    depositPropsData,
    withdrawPropsData,
    swapPropsData,
    withdrawNewPropsData,
    WrapUnwrapPropsData,
  };
}
