import { useMemo } from "react";
import { useGasFee } from "../contracts/fee/getGasFee";
import { useRecoilValue } from "recoil";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { useInOutTokens } from "../token/useInOutTokens";
import commafy from "@/utils/trim/commafy";
import { isBiggerThanMinimumNum } from "@/utils/number/compareNumbers";

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
  const { inToken } = useInOutTokens();
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
          tooltip: true,
          tooltipLabel: `${inToken.amountBN} ${inToken.tokenName}`,
        },
        {
          title: "Estimated gas fees",
          content: totalGasFee,
          gasFee: {
            l1Gas: totalGasFee,
            l2Gas: "0 ETH",
          },
          tooltip: true,
          tooltipLabel: "0.00221110000002 ETH",
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
          tooltip: true,
          tooltipLabel: "0.00221110000002 ETH",
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

  return { depositPropsData, withdrawPropsData };
}
