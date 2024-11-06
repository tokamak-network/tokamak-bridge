import { SupportedTokenNames } from "@/types/token/supportedToken";
import Decimal from "decimal.js";
import { useEffect, useMemo, useRef, useState } from "react";

export const trimTokenName = (tokenName: string | undefined) => {
  if (tokenName?.includes(" "))
    return `${tokenName.split(" ")[0]}-${tokenName.split(" ")[1]}`;
  return tokenName;
};

export const changeTokenNameForAPI = (tokenName: string | undefined) => {
  if (
    tokenName === "Tokamak Network" ||
    tokenName === "Wrapped TON" ||
    tokenName === "TON"
  )
    return "tokamak-network";
  if (tokenName === "Wrapped Ether" || tokenName === "ETH") return "ethereum";
  if (tokenName === "USD Coin") return "usd-coin";
  if (tokenName === "Tether USD") return "tether";
  return tokenName?.toLowerCase();
};

export function useGetMarketPrice(params: {
  tokenName?: SupportedTokenNames | string;
  amount?: number | string;
}) {
  const tokenName = changeTokenNameForAPI(params.tokenName);
  const [data, setData] = useState<any>(undefined);

  // const { data } = useQuery(GET_MARKET_PRICE, {
  //   variables: {
  //     tokenName: trimTokenName(tokenName),
  //   },
  //   pollInterval: 20000,
  //   fetchPolicy: "cache-and-network",
  //   nextFetchPolicy: "cache-first",
  //   context: {
  //     apiName: "price",
  //   },
  //   skip: !tokenName,
  // });

  const prevTokenNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    async function fetchPrice() {
      try {
        const response = await fetch(`/api/coingecko?tokenName=${tokenName}`);
        if (!response.ok) {
          throw new Error("Failed to fetch the market price");
        }
        const data = await response.json();
        if (data) {
          return setData({ getTokenMarketData: data[0] });
        }
        setData(undefined);
      } catch (error) {
        setData(undefined);
      }
    }
    if (
      tokenName !== undefined &&
      tokenName !== "" &&
      tokenName !== prevTokenNameRef.current
    ) {
      fetchPrice();
    }
    prevTokenNameRef.current = tokenName;
  }, [tokenName]);

  const tokenMarketPrice: number = useMemo(() => {
    if (data?.getTokenMarketData?.current_price !== undefined) {
      return data.getTokenMarketData.current_price;
    }
    return undefined;
  }, [data]);

  const tokenPriceWithAmount = useMemo(() => {
    if (tokenMarketPrice && params.amount) {
      const price = new Decimal(data.getTokenMarketData.current_price);
      const amount = new Decimal(params.amount);
      const result = price.times(amount).toNumber();
      return result > 0.0001 ? result : 0.0;
    }
    if (tokenMarketPrice && params.amount === 0) {
      return 0;
    }
    return undefined;
  }, [tokenMarketPrice, params.amount]);

  return { tokenMarketPrice, tokenPriceWithAmount };
}
