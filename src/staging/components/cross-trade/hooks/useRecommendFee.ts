import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { getSupportedTokenForCT } from "@/utils/token/getSupportedTokenInfo";
import { formatUnits } from "@/utils/trim/convertNumber";
import { add } from "date-fns";
import { useMemo } from "react";

const recomendFeeConfig = {
  gas: {
    provideCT: 225000,
    withdrawERC20: 600000,
  },
  fee: {
    //percentage of the total amount
    TON: 1.09041,
    TOS: 1.09041,
    USDC: 0.53425,
    USDT: 0.53425,
    ETH: 0.47671,
  },
} as {
  gas: {
    provideCT: number;
    withdrawERC20: number;
  };
  fee: {
    [key: string]: number;
  };
};

export const useRecommendFee = (params: {
  totalAmount: number;
  tokenAddress: string;
}) => {
  const { totalAmount, tokenAddress } = params;
  const tokenInfo = getSupportedTokenForCT(tokenAddress);
  const hasRecomendFee =
    tokenInfo?.tokenSymbol &&
    recomendFeeConfig.fee.hasOwnProperty(tokenInfo.tokenSymbol as string);

  const additionalFeeRatio = useMemo(() => {
    if (hasRecomendFee) {
      return recomendFeeConfig.fee[tokenInfo?.tokenSymbol as string];
    }
  }, [hasRecomendFee]);

  const additionalFee = useMemo(() => {
    if (totalAmount && additionalFeeRatio) {
      return (totalAmount * additionalFeeRatio) / 100;
    }
  }, [totalAmount, additionalFeeRatio]);

  const { tokenPriceWithAmount: serviceFee } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: formatUnits(recomendFeeConfig.gas.provideCT.toString(), 18),
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
