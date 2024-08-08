import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { recommendFeeConfig } from "@/staging/constants/fee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useMemo } from "react";

export const useRecommendFee = (params: {
  totalAmount: number;
  tokenAddress: string;
}) => {
  const { totalAmount, tokenAddress } = params;
  const tokenInfo = getSupportedTokenForCT(tokenAddress);
  const hasRecomendFee =
    tokenInfo?.tokenSymbol &&
    recommendFeeConfig.fee.hasOwnProperty(tokenInfo.tokenSymbol as string);

  const additionalFeeRatio = useMemo(() => {
    if (hasRecomendFee) {
      return recommendFeeConfig.fee[tokenInfo?.tokenSymbol as string];
    }
  }, [hasRecomendFee]);

  const additionalFee = useMemo(() => {
    if (totalAmount && additionalFeeRatio) {
      return (totalAmount * additionalFeeRatio) / 100;
    }
  }, [totalAmount, additionalFeeRatio]);

  const { tokenPriceWithAmount: serviceFee } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: formatUnits(
      recommendFeeConfig.gas[CTTransactionType.provideCT].toString(),
      18
    ),
  });

  const recommendedFee = useMemo(() => {
    if (serviceFee && additionalFee) return serviceFee + additionalFee;
  }, [serviceFee, additionalFee]);

  const recommendedCtAmount = useMemo(() => {
    if (totalAmount && recommendedFee) {
      return totalAmount - recommendedFee;
    }
  }, [totalAmount, recommendedFee]);

  return { recommendedCtAmount, recommendedFee };
};
