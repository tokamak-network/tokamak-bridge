import {
  searchTokenList,
  searchTokenSelector,
  searchTokenStatus,
} from "@/recoil/card/selectCard/searchToken";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useConnectedNetwork from "../network";
import { SupportedTokens_T, TokenInfo } from "@/types/token/supportedToken";
import useAddTokenToStorage from "../storage/useAddTokenToStorage";

export function useGetTokenList() {
  const tokenList = useRecoilValue(searchTokenList);
  const searchedTokenName = useRecoilValue(searchTokenStatus);
  const tokenSelector = useRecoilValue(searchTokenSelector);
  const { chainName } = useConnectedNetwork();
  const { storedTokenList } = useAddTokenToStorage();

  const tokenListForSelectedNetwork = useMemo(() => {
    if (chainName) {
      return tokenList.filter((token) => {
        return token.address[chainName] !== null;
      });
    }
  }, [chainName, tokenList]);

  const filteredTokenList = useMemo(() => {
    //in case searching token with an address
    if (tokenSelector && chainName && tokenListForSelectedNetwork) {
      const tokenListAll = [...tokenListForSelectedNetwork, ...storedTokenList];
      const result = tokenListAll.filter(
        (token) => token.address[chainName] === tokenSelector.address[chainName]
      );
      //remove duplicated value when a user search it with an address
      return result.length > 1 ? [result[0]] : [{ ...result[0], isNew: true }];
    }
    //in case searching token with symbol name
    if (searchedTokenName?.nameOrAdd && tokenListForSelectedNetwork) {
      const tokenListAll = [...tokenListForSelectedNetwork, ...storedTokenList];
      //remove duplicated value when a user search it with an address
      return tokenListAll.filter((token) => {
        return token.tokenName
          .toLocaleLowerCase()
          .includes(searchedTokenName.nameOrAdd.toLocaleLowerCase());
      });
    }

    return tokenListForSelectedNetwork;
  }, [
    tokenListForSelectedNetwork,
    tokenSelector,
    searchedTokenName,
    storedTokenList,
  ]);

  return {
    filteredTokenList: filteredTokenList as SupportedTokens_T,
  };
}
