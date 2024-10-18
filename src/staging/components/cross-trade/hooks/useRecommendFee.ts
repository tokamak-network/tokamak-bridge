import { BigNumber } from "@ethersproject/bignumber";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { recommendFeeConfig } from "@/staging/constants/fee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useMemo } from "react";
import { Decimal } from "decimal.js";
import { useFeeData } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { SupportedChainId } from "@/types/network/supportedNetwork";

export const useRecommendFee = (params: {
  totalAmount: number;
  tokenAddress: string;
}) => {
  const { totalAmount, tokenAddress } = params;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data: feeData } = useFeeData({
    chainId: isConnectedToMainNetwork
      ? SupportedChainId.MAINNET
      : SupportedChainId.SEPOLIA,
  });
  const tokenInfo = getSupportedTokenForCT(
    tokenAddress,
    isConnectedToMainNetwork
  );

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

  const estimatedGasFeeETH = useMemo(() => {
    if (feeData?.gasPrice) {
      const gasUsage =
        recommendFeeConfig.gas[CTTransactionType.provideCT].toString();
      const gasPrice = formatUnits(feeData.gasPrice.toString(), 9);
      const gasFee =
        Number(gasUsage) * Number(gasPrice) * Math.pow(10, -9) * 1.25;
      return gasFee;
    }
  }, [feeData, recommendFeeConfig.gas]);

  const { tokenPriceWithAmount: provideCTTxnCost } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: estimatedGasFeeETH,
  });

  const recommendedFee = useMemo(() => {
    if (provideCTTxnCost && additionalFee && tokenInfo?.decimals) {
      const additionalFeeWithDecimals = new Decimal(additionalFee.toString());
      const provideCTTxnCostWithDecimals = new Decimal(
        provideCTTxnCost.toString()
      );
      const sum = additionalFeeWithDecimals.plus(provideCTTxnCostWithDecimals);
      return sum.toFixed(tokenInfo.decimals);
    }
  }, [provideCTTxnCost, additionalFee, tokenInfo?.decimals]);

  // console.log("recommendedFee", recommendedFee);
  // console.log(
  //   "provideCTTxnCost",
  //   provideCTTxnCost,
  //   "gasFee",
  //   feeData?.gasPrice
  // );
  // console.log("additionalFee", additionalFee?.toString());

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
