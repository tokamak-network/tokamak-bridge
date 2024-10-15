import { CTTransactionType } from "@/types/crossTrade/contracts";
import { useMemo } from "react";
import { recommendFeeConfig } from "../constants/fee";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { formatUnits } from "@/utils/trim/convertNumber";
import useConnectedNetwork from "@/hooks/network";
import { useFeeData } from "wagmi";
import JSBI from "jsbi";
import commafy from "@/utils/trim/commafy";
import { transactionType } from "viem";

export const useCrossTradeGasFee = (trasnactionType: CTTransactionType) => {
  const estimatedGasUsage = useMemo(() => {
    switch (trasnactionType) {
      case CTTransactionType.provideCT:
        return recommendFeeConfig.gas[CTTransactionType.provideCT];
      case CTTransactionType.requestRegisteredToken:
        return recommendFeeConfig.gas[CTTransactionType.requestRegisteredToken];
      case CTTransactionType.editFee:
        return recommendFeeConfig.gas[CTTransactionType.editFee];
      case CTTransactionType.cancel:
        return recommendFeeConfig.gas[CTTransactionType.cancel];
      case CTTransactionType.strandardWithdrawERC20:
        return recommendFeeConfig.gas[CTTransactionType.strandardWithdrawERC20];
      default:
        return 0;
    }
  }, [trasnactionType]);

  const { connectedChainId } = useConnectedNetwork();
  const { data: feeData } = useFeeData({ chainId: connectedChainId });
  const { tokenMarketPrice } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: 1,
  });

  //   const estimatedGasFeeETH = useMemo(() => {
  //     if (feeData && estimatedGasUsage) {
  //       const { gasPrice } = feeData;
  //       const gasCost = estimatedGasUsage * Number(gasPrice);
  //       return formatUnits(gasCost.toString(), 18);
  //     }
  //   }, [feeData, estimatedGasUsage]);

  const estimatedGasFeeETH = useMemo(() => {
    switch (trasnactionType) {
      case CTTransactionType.requestRegisteredToken: {
        return 0.00014167255;
      }
      case CTTransactionType.strandardWithdrawERC20: {
        return 0.000150936101651164 + (60000 + 30) / 1e9;
      }
      default: {
        if (feeData) {
          const { gasPrice } = feeData;
          return (estimatedGasUsage * Number(gasPrice)) / 1e18;
        }
      }
    }
  }, [trasnactionType, estimatedGasUsage, feeData]);

  const estimatedGasFeeUSD = useMemo(() => {
    if (tokenMarketPrice && estimatedGasFeeETH) {
      const precision = 1e18; // Adjust this value based on the required precision
      const bi_estimatedGasFee = JSBI.BigInt(
        Math.round(Number(estimatedGasFeeETH) * precision),
      );
      const bi_tokenMarketPrice = JSBI.BigInt(
        Math.round(Number(tokenMarketPrice) * precision),
      );
      const resultWithWei = JSBI.divide(
        JSBI.multiply(bi_estimatedGasFee, bi_tokenMarketPrice),
        JSBI.BigInt(precision),
      );
      const result = formatUnits(resultWithWei.toString(), 18);
      return result.toString();
    }
  }, [tokenMarketPrice, estimatedGasFeeETH]);

  return { estimatedGasFeeUSD, estimatedGasFeeETH };
};
