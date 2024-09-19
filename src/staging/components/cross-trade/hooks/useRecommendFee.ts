import { BigNumber } from "@ethersproject/bignumber";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { recommendFeeConfig } from "@/staging/constants/fee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useMemo } from "react";
import { Decimal } from "decimal.js";

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
    if (totalAmount && additionalFeeRatio && tokenInfo?.decimals) {
      const totalAmountDecimal = new Decimal(totalAmount.toString());
      const additionalFeeRatioDecimal = new Decimal(
        additionalFeeRatio.toString()
      );
      const fee = totalAmountDecimal.mul(additionalFeeRatioDecimal).div(100);
      return fee.toFixed(tokenInfo.decimals);
    }
  }, [totalAmount, additionalFeeRatio, tokenInfo?.decimals]);

  const { tokenPriceWithAmount: serviceFee } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: formatUnits(
      recommendFeeConfig.gas[CTTransactionType.provideCT].toString(),
      18
    ),
  });

  const recommendedFee = useMemo(() => {
    if (serviceFee && additionalFee && tokenInfo?.decimals) {
      const additionalFeeWithDecimals = new Decimal(additionalFee.toString());
      const serviceFeeWithDecimals = new Decimal(serviceFee.toString());
      const sum = additionalFeeWithDecimals.plus(serviceFeeWithDecimals);
      return sum.toFixed(tokenInfo.decimals);
    }
  }, [serviceFee, additionalFee, tokenInfo?.decimals]);

  const recommendedCtAmount = useMemo(() => {
    if (totalAmount && recommendedFee && tokenInfo?.decimals) {
      const totalAmountDecimals = new Decimal(totalAmount.toString());
      const recommendedFeeDecimal = new Decimal(recommendedFee.toString());
      const result = totalAmountDecimals.minus(recommendedFeeDecimal);
      return result.toFixed(tokenInfo?.decimals);
    }
  }, [totalAmount, recommendedFee, tokenInfo?.decimals]);

  return { recommendedCtAmount, recommendedFee };
};
