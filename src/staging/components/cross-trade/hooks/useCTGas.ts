import useConnectedNetwork from "@/hooks/network";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { recommendFeeConfig } from "@/staging/constants/fee";
import { CTTransactionType } from "@/types/crossTrade/contracts";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { formatUnits } from "@/utils/trim/convertNumber";
import { useMemo } from "react";
import { useFeeData } from "wagmi";

export function useProvideCTGas() {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { data: feeData } = useFeeData({
    chainId: isConnectedToMainNetwork
      ? SupportedChainId.MAINNET
      : SupportedChainId.SEPOLIA,
  });
  const estimatedGasFeeETH = useMemo(() => {
    if (feeData?.gasPrice) {
      const gasUsage = recommendFeeConfig.gas[CTTransactionType.provideCT];
      const gasPrice = formatUnits(feeData.gasPrice.toString(), 9);
      const gasFee = gasUsage * Number(gasPrice) * Math.pow(10, -9) * 1.25;
      return gasFee;
    }
  }, [feeData?.gasPrice]);

  const { tokenPriceWithAmount: provideCTTxnCost } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: estimatedGasFeeETH,
  });

  return { provideCTTxnCost };
}
