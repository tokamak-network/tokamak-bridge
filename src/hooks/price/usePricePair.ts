import commafy from "@/utils/trim/commafy";
import { useGetMarketPrice } from "./useGetMarketPrice";
import { useMemo } from "react";

export function usePricePair(params: {
  token0Name: string | undefined;
  token0Amount: number;
  token1Name: string | undefined;
  token1Amount: number;
}) {
  const { token0Name, token0Amount, token1Name, token1Amount } = params;
  const { tokenPriceWithAmount: token0Price } = useGetMarketPrice({
    tokenName: token0Name,
    amount: Number(commafy(token0Amount, 4).replaceAll(",", "")),
  });
  const { tokenPriceWithAmount: token1Price } = useGetMarketPrice({
    tokenName: token1Name,
    amount: Number(commafy(token1Amount, 4).replaceAll(",", "")),
  });

  const hasTokenPrice = useMemo(() => {
    return token0Price && token1Price;
  }, [token0Price, token1Price]);

  const totalMarketPrice = useMemo(() => {
    if (hasTokenPrice && token0Price && token1Price)
      return commafy(
        Number(token0Price.replaceAll(",", "")) +
          Number(token1Price.replaceAll(",", ""))
      );
  }, [hasTokenPrice, token0Price, token1Price]);

  console.log(token0Name, token1Name);

  console.log(token0Price, token1Price);

  return { token0Price, token1Price, hasTokenPrice, totalMarketPrice };
}
