import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  getDepositWithdrawType,
  getEstimatedWithdrawalFeeConstant,
} from "../components/new-confirm/utils";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { Status } from "../types/transaction";
import { isThanosChain } from "@/utils/network/checkNetwork";
import { useMemo } from "react";

export const useGetEstimatedTotalGasFee = (
  l2ChainId: SupportedChainId,
  tokenSymbol: string
) => {
  const fee = getEstimatedWithdrawalFeeConstant(
    l2ChainId,
    getDepositWithdrawType(tokenSymbol)
  );

  const { tokenPriceWithAmount: initiateCost } = useGetMarketPrice({
    tokenName: "TON",
    amount: fee ? fee[Status.Initiate] : 0,
  });

  const { tokenPriceWithAmount: proveCost } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: fee ? fee[Status.Prove] : 0,
  });

  const { tokenPriceWithAmount: finalizeCost } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: fee ? fee[Status.Finalize] : 0,
  });

  const totalCost = useMemo(() => {
    if (!isThanosChain(l2ChainId)) return 0.5;
    if (!initiateCost || !proveCost || !finalizeCost) return null;
    return initiateCost + proveCost + finalizeCost;
  }, [initiateCost, proveCost, finalizeCost]);

  return { totalCost };
};
