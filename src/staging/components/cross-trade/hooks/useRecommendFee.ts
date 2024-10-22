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
import { useRelayGasCost } from "../../new-confirm/hooks/useGetGas";

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

  const { tokenPriceWithAmount: totalTokenAmountInUSD } = useGetMarketPrice({
    tokenName: tokenInfo?.tokenName as string,
    amount: totalAmount,
  });
  const { tokenPriceWithAmount: tokenPrice } = useGetMarketPrice({
    tokenName: tokenInfo?.tokenName as string,
    amount: 1,
  });
  const {
    withdrawCost: { totalGasCost: standardWithdrawGasCost },
  } = useRelayGasCost();

  const isGasFeeLessThanOrEqual = useMemo(() => {
    if (feeData?.gasPrice && standardWithdrawGasCost) {
      const gasUsage = recommendFeeConfig.gas[CTTransactionType.provideCT];
      const gasPrice = formatUnits(feeData.gasPrice.toString(), 9);
      const gasFee = gasUsage * Number(gasPrice) * Math.pow(10, -9) * 1.25;
      const gasFeeDecimal = new Decimal(gasFee);
      const standardWithdrawGasCostDecimal = new Decimal(
        standardWithdrawGasCost
      );
      const isGasFeeLessThanOrEqual = gasFeeDecimal.lessThanOrEqualTo(
        standardWithdrawGasCostDecimal
      );
      return isGasFeeLessThanOrEqual;
    }
  }, [feeData?.gasPrice, standardWithdrawGasCost]);

  const additionalFeeRatio = useMemo(() => {
    if (hasRecomendFee) {
      const additionalFee = isGasFeeLessThanOrEqual ? 0 : -0.4;
      return (
        recommendFeeConfig.fee[tokenInfo?.tokenSymbol as string] - additionalFee
      );
    }
  }, [hasRecomendFee, isGasFeeLessThanOrEqual]);

  const additionalFee = useMemo(() => {
    if (totalTokenAmountInUSD && additionalFeeRatio && tokenInfo?.decimals) {
      const totalAmountDecimal = new Decimal(totalTokenAmountInUSD.toString());
      const additionalFeeRatioDecimal = new Decimal(
        additionalFeeRatio.toString()
      );
      const fee = totalAmountDecimal.mul(additionalFeeRatioDecimal).div(100);
      return fee.toString();
    }
  }, [totalTokenAmountInUSD, additionalFeeRatio, tokenInfo?.decimals]);

  const estimatedGasFeeETH = useMemo(() => {
    if (feeData?.gasPrice && standardWithdrawGasCost) {
      const gasUsage = recommendFeeConfig.gas[CTTransactionType.provideCT];
      const gasPrice = formatUnits(feeData.gasPrice.toString(), 9);
      const gasFee = gasUsage * Number(gasPrice) * Math.pow(10, -9) * 1.25;

      return gasFee;
    }
  }, [
    feeData,
    recommendFeeConfig.gas,
    standardWithdrawGasCost,
    isGasFeeLessThanOrEqual,
  ]);

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
      return sum.toString();
    }
  }, [provideCTTxnCost, additionalFee, tokenInfo?.decimals]);

  const recommendedFeeAmount = useMemo(() => {
    if (recommendedFee && tokenPrice) {
      return new Decimal(recommendedFee.toString()).div(tokenPrice).toNumber();
    }
  }, [recommendedFee, tokenPrice]);

  const recommendedCtAmount = useMemo(() => {
    if (totalAmount && recommendedFeeAmount && tokenInfo?.decimals) {
      const totalAmountDecimals = new Decimal(totalAmount.toString());
      const recommendedFeeDecimal = new Decimal(
        recommendedFeeAmount.toString()
      );
      const result = totalAmountDecimals.minus(recommendedFeeDecimal);

      return result.toFixed(tokenInfo?.decimals);
    }
  }, [totalAmount, recommendedFeeAmount, tokenInfo?.decimals]);

  return {
    recommendedCtAmount,
    recommendedFee: recommendedFeeAmount,
    estimatedGasFeeETH,
    provideCTTxnUSDCost: provideCTTxnCost,
  };
};
