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
import useMediaView from "../mediaView/useMediaView";

export function useGetTokenList() {
  const tokenList = useRecoilValue(searchTokenList);
  const searchedTokenName = useRecoilValue(searchTokenStatus);
  const tokenSelector = useRecoilValue(searchTokenSelector);
  const { chainName } = useConnectedNetwork();
  const { storedTokenList } = useAddTokenToStorage();
  const { mobileView } = useMediaView();

  const tokenListForSelectedNetwork = useMemo(() => {
    const tokenListAll = [...tokenList, ...storedTokenList];
    const chainN = chainName ?? "MAINNET";
    if (chainN) {
      return tokenListAll.filter((token) => {
        return token.address[chainN] !== null;
      });
    }
  }, [chainName, tokenList, storedTokenList]);

  const filteredTokenList = useMemo(() => {
    //in case searching token with an address
    if (tokenSelector && chainName && tokenListForSelectedNetwork) {
      // const tokenListAll = [...tokenListForSelectedNetwork, ...storedTokenList];

      const result = tokenListForSelectedNetwork.filter(
        (token) => token.address[chainName] === tokenSelector.address[chainName]
      );
      //remove duplicated value when a user search it with an address
      return result.length > 1 ? [result[0]] : [{ ...result[0], isNew: true }];
    }
    //in case searching token with symbol name
    if (searchedTokenName?.nameOrAdd && tokenListForSelectedNetwork) {
      ``;
      // const tokenListAll = [...tokenListForSelectedNetwork, ...storedTokenList];
      //remove duplicated value when a user search it with an address
      return tokenListForSelectedNetwork.filter((token) => {
        return (
          token.tokenName
            .toLocaleLowerCase()
            .includes(searchedTokenName.nameOrAdd.toLocaleLowerCase()) ||
          token.tokenSymbol
            .toLocaleLowerCase()
            .includes(searchedTokenName.nameOrAdd.toLocaleLowerCase())
        );
      });
    }

    return tokenListForSelectedNetwork;
  }, [
    tokenListForSelectedNetwork,
    tokenSelector,
    searchedTokenName,
    storedTokenList,
  ]);

  let trimedTokenList;

  if (
    filteredTokenList &&
    filteredTokenList.length < 8 &&
    filteredTokenList.length > 5 &&
    !mobileView
  ) {
    trimedTokenList = [...filteredTokenList, ...filteredTokenList];
  } else {
    trimedTokenList = filteredTokenList;
  }

  return {
    filteredTokenList: trimedTokenList as SupportedTokens_T,
  };
}
