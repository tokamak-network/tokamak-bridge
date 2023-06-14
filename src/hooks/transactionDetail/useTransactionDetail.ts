import { useMemo } from "react";
import { useGasFee } from "../contracts/fee/getGasFee";
import { useRecoilValue } from "recoil";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useInOutTokens } from "../token/useInOutTokens";
import commafy from "@/utils/trim/commafy";
import { isBiggerThanMinimumNum } from "@/utils/number/compareNumbers";
import { useAmountOut } from "../swap/swapTokens";

export type DepositDetailProp = {
  title: string;
  content: string;
  tooltip?: boolean;
  tooltipLabel?: string;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: string;
    l2Gas: string;
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

export type SwapDetailProp = {
  title:
    | "Expected output"
    | "Minimum received after slippage"
    | "Estimated gas fees";
  content: string;
  gasFee?: string;
  slippage?: string;
};

export function useTransactionDetail() {
  const { mode } = useRecoilValue(actionMode);
  const { inToken, outToken } = useInOutTokens();
  const { totalGasCost } = useGasFee();

  const totalGasFee = `${
    isBiggerThanMinimumNum(Number(totalGasCost))
      ? commafy(totalGasCost, 4)
      : "< 0.0001"
  } ETH`;
  const inputAmount = `${commafy(inToken?.parsedAmount, 4)} ${
    inToken?.tokenName
  }`;

  const depositPropsData: DepositDetailProp[] | null = useMemo(() => {
    if (mode === "Deposit" && inToken && totalGasCost) {
      return [
        {
          title: "Amount to Deposit",
          content: inputAmount,
        },
        {
          title: "Estimated gas fees",
          content: totalGasFee,
          gasFee: {
            l1Gas: totalGasFee,
            l2Gas: "0 ETH",
          },
          tooltip: true,
          tooltipLabel: `${commafy(totalGasCost, 18)} ETH`,
        },
        {
          title: "Time to Deposit",
          content: "~20 minutes",
        },
      ];
    }
    return null;
  }, [mode, inToken, totalGasFee, inputAmount]);

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
            l1Gas: { eth: "0 ETH", ton: "0.0022 TON" },
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

  const { amountOut } = useAmountOut();

  const swapPropsData: SwapDetailProp[] | null = useMemo(() => {
    if (mode === "Swap" && inToken) {
      return [
        {
          title: "Expected output",
          content: `${commafy(amountOut, 4)} ${outToken?.tokenName}`,
        },
        {
          title: "Minimum received after slippage",
          content: `${commafy(amountOut, 4)} ${outToken?.tokenName}`,
          slippage: "0.1%",
        },
        {
          title: "Estimated gas fees",
          content: `${totalGasFee} ETH`,
          gasFee: "$3.18",
        },
      ];
    }
    return null;
  }, [mode, inToken, outToken, inputAmount, amountOut]);

  return { depositPropsData, withdrawPropsData, swapPropsData };
}
