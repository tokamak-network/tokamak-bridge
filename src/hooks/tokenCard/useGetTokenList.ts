import {
  searchTokenList,
  searchTokenSelector,
  searchTokenStatus,
} from "@/recoil/card/selectCard/searchToken";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useConnectedNetwork from "../network";
import { TokenInfo } from "@/types/token/supportedToken";
import useAddTokenToStorage from "../storage/useAddTokenToStorage";

export function useGetTokenList() {
  const tokenList = useRecoilValue(searchTokenList);
  const searchedTokenName = useRecoilValue(searchTokenStatus);
  const tokenSelector = useRecoilValue(searchTokenSelector);
  const { chainName } = useConnectedNetwork();
  const { storedTokenList } = useAddTokenToStorage();

  const filteredTokenList = useMemo(() => {
    //in case searching token with an address
    if (tokenSelector && chainName) {
      const tokenListAll = [...tokenList, ...storedTokenList];
      const result = tokenListAll.filter(
        (token) => token.address[chainName] === tokenSelector.address[chainName]
      );

      //remove duplicated value when a user search it with an address
      return result.length > 1 ? [result[0]] : [{ ...result[0], isNew: true }];
    }
    //in case searching token with symbol name
    if (searchedTokenName?.nameOrAdd) {
      const tokenListAll = [...tokenList, ...storedTokenList];
      //remove duplicated value when a user search it with an address
      return tokenListAll.filter((token) => {
        return token.tokenName
          .toLocaleLowerCase()
          .includes(searchedTokenName.nameOrAdd.toLocaleLowerCase());
      });
    }
    return tokenList;
  }, [tokenList, tokenSelector, searchedTokenName, storedTokenList]);

  return {
    filteredTokenList,
  };
}
