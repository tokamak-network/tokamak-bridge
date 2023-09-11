import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

export function useGasPrice(estimatedGas: number) {
  const { tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: estimatedGas,
  });

  return { totalGasPrice: tokenPriceWithAmount };
}
