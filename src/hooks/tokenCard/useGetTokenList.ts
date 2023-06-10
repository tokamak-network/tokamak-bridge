import {
  searchTokenList,
  searchTokenSelector,
  searchTokenStatus,
} from "@/recoil/card/selectCard/searchToken";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import useConnectedNetwork from "../network";

export function useGetTokenList() {
  const tokenList = useRecoilValue(searchTokenList);
  const searchedTokenName = useRecoilValue(searchTokenStatus);
  const tokenSelector = useRecoilValue(searchTokenSelector);
  const { chainName } = useConnectedNetwork();

  const filterTokenList = useMemo(() => {
    if (tokenSelector && chainName) {
      return tokenList.filter(
        (token) => token.address[chainName] === tokenSelector.address[chainName]
      );
    }
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
    filterTokenList,
  };
}
