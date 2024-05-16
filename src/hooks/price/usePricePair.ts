import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "./useGetMarketPrice";
import { useMemo } from "react";

export function usePricePair(params: {
  token0Name: string | undefined;
  token0Amount: number | string | undefined;
  token1Name: string | undefined;
  token1Amount: number | string | undefined;
}) {
  const { token0Name, token0Amount, token1Name, token1Amount } = params;
  const {
    tokenPriceWithAmount: token0Price,
    tokenMarketPrice: token0MarketPrice,
  } = useGetMarketPrice({
    tokenName: token0Name,
    amount: token0Amount,
  });
  const {
    tokenPriceWithAmount: token1Price,
    tokenMarketPrice: token1MarketPrice,
  } = useGetMarketPrice({
    tokenName: token1Name,
    amount: Number(commafy(token1Amount, 8).replaceAll(",", "")),
  });

  const totalMarketPrice = useMemo(() => {
    if (token0Price !== undefined && token1Price !== undefined) {
      return commafy(Number(token0Price ?? 0) + Number(token1Price ?? 0));
    }
    return undefined;
  }, [token0Price, token1Price]);

  const hasTokenPrice = useMemo(() => {
    return token0MarketPrice !== undefined && token1MarketPrice !== undefined;
  }, [token0MarketPrice, token1MarketPrice]);

  return {
    token0Price: token0Price ?? "0.00",
    token1Price: token1Price ?? "0.00",
    totalMarketPrice,
    hasTokenPrice,
  };
}
