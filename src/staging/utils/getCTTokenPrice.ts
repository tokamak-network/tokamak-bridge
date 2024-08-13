import { supportedTokensForCT } from "@/types/token/supportedToken";
import { fetchMarketPrice } from "@/utils/price/fetchMarketPrice";

const tokenList = [
  fetchMarketPrice("tokamak-network"),
  fetchMarketPrice("ethereum"),
  fetchMarketPrice("usd-coin"),
  fetchMarketPrice("tether"),
  fetchMarketPrice("tonstarter"),
];

export const getCTTokenPrice = async () => {
  const marketPrice = await Promise.all(tokenList);

  return {
    TON: marketPrice[0],
    ETH: marketPrice[1],
    USDC: marketPrice[2],
    USDT: marketPrice[3],
    TOS: marketPrice[4],
  };
};
