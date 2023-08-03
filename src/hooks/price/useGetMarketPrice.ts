import { GET_MARKET_PRICE } from "@/graphql/getMarketPrice";
import { SupportedTokenNames } from "@/types/token/supportedToken";
import commafy from "@/utils/trim/commafy";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

const trimTokenName = (tokenName: string | undefined) => {
  if (tokenName?.includes(" "))
    return `${tokenName.split(" ")[0]}-${tokenName.split(" ")[1]}`;
  return tokenName;
};

const changeTokenNameForAPI = (tokenName: string | undefined) => {
  if (tokenName === "Wrapped TON") return "tokamak-network";
  if (tokenName === "Wrapped Ether") return "ethereum";
  return tokenName?.toLowerCase();
};

export function useGetMarketPrice(params: {
  tokenName: SupportedTokenNames | string | undefined;
  amount?: number;
}) {
  const tokenName = changeTokenNameForAPI(params.tokenName);

  const { data } = useQuery(GET_MARKET_PRICE, {
    variables: {
      tokenName: trimTokenName(tokenName),
    },
    pollInterval: 10000,
    context: {
      apiName: "price",
    },
  });

  console.log("data");
  console.log(data);

  const tokenMarketPrice = useMemo(() => {
    if (data?.getTokenMarketData.current_price) {
      return data.getTokenMarketData.current_price;
    }
    return undefined;
  }, [data]);

  const tokenPriceWithAmount = useMemo(() => {
    if (tokenMarketPrice && params.amount) {
      return commafy(data.getTokenMarketData.current_price * params.amount, 2);
    }
    return undefined;
  }, [tokenMarketPrice, params.amount]);

  return { tokenMarketPrice, tokenPriceWithAmount };
}
