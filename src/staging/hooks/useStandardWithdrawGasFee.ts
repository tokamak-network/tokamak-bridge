import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  getDepositWithdrawType,
  getEstimatedWithdrawalFeeConstant,
} from "../components/new-confirm/utils";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { Status } from "../types/transaction";
import { isThanosChain, isTitanChain } from "@/utils/network/checkNetwork";
import { useMemo } from "react";
import { useRelayGasCost } from "../components/new-confirm/hooks/useGetGas";

export const useGetEstimatedTotalGasFee = (
  l2ChainId: SupportedChainId,
  tokenSymbol: string
) => {
  const fee = getEstimatedWithdrawalFeeConstant(
    l2ChainId,
    getDepositWithdrawType(l2ChainId, tokenSymbol)
  );
  const { withdrawCost } = useRelayGasCost({
    includeInitiate: true,
  });

  const { tokenPriceWithAmount: initiateCost } = useGetMarketPrice({
    tokenName: "TON",
    amount: fee ? fee[Status.Initiate]?.amount : 0,
  });

  const { tokenPriceWithAmount: proveCost } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: fee ? fee[Status.Prove]?.amount : 0,
  });

  const { tokenPriceWithAmount: finalizeCost } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: fee ? fee[Status.Finalize]?.amount : 0,
  });

  const totalCost = useMemo(() => {
    if (!isThanosChain(l2ChainId)) return withdrawCost.usGasCost; // TODO: it should be replace with real total cost of titan withdraw transaction
    if (!initiateCost || !proveCost || !finalizeCost) return null;
    return initiateCost + proveCost + finalizeCost;
  }, [initiateCost, proveCost, finalizeCost]);

  return { totalCost };
};
