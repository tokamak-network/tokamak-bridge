import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { MAINNET_CONTRACTS } from "@/constant/contracts";
import BalanceChecker from "@/abis/BalanceChecker.json";
import { useProvier } from "@/hooks/provider/useProvider";
import useConnectedNetwork from "@/hooks/network";
import { useAccount } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { supportedTokens } from "@/types/token/supportedToken";
import { fetchMarketPrice } from "@/utils/price/fetchMarketPrice";

type marketList = {
  address: string;
  balance: number;
  balanceInUSD: number;
  id: string;
  name: string;
  symbol: string;
};

const getList = async (queryParam: string | undefined | null) => {
  if (queryParam === undefined || queryParam === null) {
    return null;
  }
  const res = await fetch(queryParam, {
    method: "GET",
  });

  if (res.status !== 200) {
    throw new Error("token list error");
  }

  if (res.ok) {
    return res.json();
  }

  return undefined;
};

export function useFetchBalance() {
  const { provider, L1Provider } = useProvier();
  const { layer } = useConnectedNetwork();
  const l1Pro = layer === "L1" ? provider : L1Provider;
  const { address } = useAccount();
  const [marketList, setMarketList] = useState<any[] | undefined>([]);
  const balanceCheck = new ethers.Contract(
    MAINNET_CONTRACTS.BalanceChecker,
    BalanceChecker,
    l1Pro
  );

  const { isLoading, error, data, isError, isLoadingError } = useQuery({
    queryKey: [process.env.NEXT_PUBLIC_TOKEN_LIST],
    queryFn: () => getList(`${process.env.NEXT_PUBLIC_TOKEN_LIST}?chainId=1`),
  });

  const {
    isLoading: isLoadingID,
    error: errorID,
    data: dataID,
    isError: isErrorID,
    isLoadingError: isLoadingErrorID,
  } = useQuery({
    queryKey: [process.env.NEXT_PUBLIC_TOKEN_ID_LIST],
    queryFn: () => getList(`${process.env.NEXT_PUBLIC_TOKEN_ID_LIST}`),
  });

  // console.log(data, dataID);
  

  const getBalances = useCallback(async () => {
    if (data && dataID && address) {
      // take only the necessary data from the api
      const tokens = data.tokens.map((token: any) => {
        return {
          address: token.address,
          decimals: token.decimals,
          name: token.name,
          symbol: token.tokenSymbol,
        };
      });

      //take only the necessary data from the supported tokens
      const tokamakTokens = supportedTokens.map((token: any) => {
        return {
          address:
            token.address.MAINNET !== ""
              ? token.address.MAINNET.toLowerCase()
              : "0x0000000000000000000000000000000000000000",
          decimals: token.decimals,
          name:
            token.tokenName === "Tether USD"
              ? "tether"
              : token.tokenName === "USD Coin"
              ? "usdc"
              : token.tokenName === "ETH"
              ? "ethereum"
              : token.tokenName,
          symbol: token.tokenSymbol,
        };
      });

      //make a list with coingecko tokens and tokamak tokens
      const tokensList = tokamakTokens.concat(tokens);

      //filter out the duplicate tokens from the token list above
      const uniqueTokensList = tokensList.filter(
        (obj: any, index: any) =>
          tokensList.findIndex((item: any) => item.address === obj.address) ===
          index
      );

      //create an array with only token addresses to pass to the contract function
      const tokenAddresses = uniqueTokensList.map((token: any) => {
        return token.address;
      });

      if (address && tokenAddresses) {
        //call the balance contract to get the balances of all 4000 something tokens
        const balances = await balanceCheck.balances(
          [address],
          tokenAddresses
        );

        //format the balance to readable number using the decimals from the uniqueTokensList. match each balance to corresponding decimal using the index
        const formattedBalances = balances.map(
          (balance: BigNumber, index: number) => {
            return {
              balance: Number(
                ethers.utils.formatUnits(
                  balance,
                  uniqueTokensList[index].decimals
                )
              ),
              address: uniqueTokensList[index].address,
              name: uniqueTokensList[index].name,
              symbol: uniqueTokensList[index].symbol,
            };
          }
        );

        //filter out only the tokens that have any balance > 0
        const tokensWithBalances = formattedBalances.filter(
          (token: any) => token.balance > 0
        );

        //get the matching id from coingecko v3 token list using the token name and manually add some tokens
        const tokensWithId = tokensWithBalances.map((token: any) => {
         
          const tokenId = dataID.filter(
            (data: any) => data.name.toLowerCase() === token.name.toLowerCase()
          );
          return {
            ...token,
            id:
              tokenId.length > 0
                ? tokenId[0].id
                : token.symbol === "DOC"
                ? "dooropen"
                : token.symbol === "WTON"
                ? "tokamak-network"
                : token.symbol.toLowerCase(),
          };
        });

        // console.log('tokensWithId',tokensWithId);
        
        //call the fetchMarketPrice function for all the tokens in the tokensWithId array
        const marketPricedList = await Promise.all(
          tokensWithId.map(async (token: any) => {
            const marketprice = await fetchMarketPrice(token.id);
            // console.log('marketprice',token.id,marketprice);
            
            const balanceInUSD = token.balance * marketprice;

            return {
              ...token,
              balanceInUSD: balanceInUSD,
            };
          })
        );
        return marketPricedList;
      }
    }
    return undefined;
  }, [isLoading, address, isLoadingID]);

  useEffect(() => {
    const fetchBalances = async () => {
      const balances = await getBalances();
      return setMarketList(balances);
    };

    fetchBalances().catch((e) => {
      console.log("**fetchBalances err**");
      console.log(e);
    });
  }, [data,address]);

  return marketList;
}
