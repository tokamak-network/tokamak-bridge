import { useQuery } from "@tanstack/react-query";
import { BigNumber, ethers } from "ethers";
import { MAINNET_CONTRACTS } from "@/constant/contracts";
import BalanceChecker from "@/abis/BalanceChecker.json";
import { useProvier } from "@/hooks/provider/useProvider";
import useConnectedNetwork from "@/hooks/network";
import { useAccount } from "wagmi";
import { useCallback } from "react";
import { supportedTokens } from "@/types/token/supportedToken";

const getList = async (queryParam: string | undefined | null) => {
  if (queryParam === undefined || queryParam === null) {
    return null;
  }
  const res = await fetch(queryParam, {
    method: "GET",
  });

  if (res.status !== 200) {
    throw new Error("no route founded");
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

  const balanceCheck = new ethers.Contract(
    MAINNET_CONTRACTS.BalanceChecker,
    BalanceChecker,
    l1Pro
  );

  const { isLoading, error, data, isError, isLoadingError } = useQuery({
    queryKey: [process.env.NEXT_PUBLIC_TOKEN_LIST],
    queryFn: () => getList(`${process.env.NEXT_PUBLIC_TOKEN_LIST}?chainId=1`),
  });

  const { isLoading:isLoadingID, error:errorID, data:dataID, isError:isErrorID, isLoadingError:isLoadingErrorID } = useQuery({
    queryKey: [process.env.NEXT_PUBLIC_TOKEN_ID_LIST],
    queryFn: () => getList(`${process.env.NEXT_PUBLIC_TOKEN_ID_LIST}`),
  });

  console.log('dataID',dataID);
  

  const getBalances = useCallback(async () => {
    if (data) {
      const tokens = data.tokens.map((token: any) => {
        return {
          address: token.address,
          decimals: token.decimals,
          name: token.name
        };
      });

      const tokamakTokens = supportedTokens.map((token: any) => {        
        return {
          address:
            token.address.MAINNET !== ""
              ? token.address.MAINNET.toLowerCase()
              : "0x0000000000000000000000000000000000000000",
          decimals: token.decimals,
          name: token.tokenName
        };
      });
      const tokensList = tokamakTokens.concat(tokens);

      const uniqueTokensList = tokensList.filter(
        (obj: any, index: any) =>
          tokensList.findIndex((item: any) => item.address === obj.address) ===
          index
      );

      const tokenAddresses = uniqueTokensList.map((token: any) => {
        return token.address;
      });
      if (address && tokenAddresses) {
        const balances = await balanceCheck.balances(
          ["0xFF1F43422A0240CCbD29C16197853b372a61255d"],
          tokenAddresses
        );

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
              name:  uniqueTokensList[index].name,
            };
          }
        );

        const tokensWithBalances = formattedBalances.filter((token:any) => token.balance !== 0)
        console.log("tokensWithBalances", tokensWithBalances);
      }
    }
  }, [data]);
  getBalances();
  return data;
}
