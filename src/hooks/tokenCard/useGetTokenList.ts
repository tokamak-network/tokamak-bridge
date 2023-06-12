import {
  searchTokenList,
  searchTokenSelector,
  searchTokenStatus,
} from "@/recoil/card/selectCard/searchToken";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useConnectedNetwork from "../network";
import { TokenInfo } from "@/types/token/supportedToken";

export function useGetTokenList() {
  const tokenList = useRecoilValue(searchTokenList);
  const searchedTokenName = useRecoilValue(searchTokenStatus);
  const tokenSelector = useRecoilValue(searchTokenSelector);
  const { chainName } = useConnectedNetwork();

  console.log(searchedTokenName, tokenSelector);

  const filteredTokenList = useMemo(() => {
    //in case searching token with an address
    if (tokenSelector && chainName) {
      const result = tokenList.filter(
        (token) => token.address[chainName] === tokenSelector.address[chainName]
      );

      //remove duplicated value when a user search it with an address
      return result.length > 1 ? [result[0]] : [{ ...result[0], isNew: true }];
    }
    //in case searching token with symbol name
    if (searchedTokenName?.nameOrAdd) {
      return tokenList.filter((token) => {
        return token.tokenName
          .toLocaleLowerCase()
          .includes(searchedTokenName.nameOrAdd.toLocaleLowerCase());
      });
    }
    return tokenList;
  }, [tokenList, tokenSelector, searchedTokenName]);

  return {
    filteredTokenList,
  };
}
