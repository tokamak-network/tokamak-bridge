import { ethers } from "ethers";
import { atom, selector } from "recoil";
import ERC20_ABI from "@/abis/erc20.json";
import { getL1Provider } from "@/config/l1Provider";
import {
  SupportedTokens_T,
  TokenInfo,
  supportedTokens,
} from "@/types/token/supportedToken";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";

type SearchToken = {
  nameOrAdd: string;
  chainId: SupportedChainId;
};

export const searchTokenStatus = atom<SearchToken | null>({
  key: "searchTokenStatus",
  default: null,
});

export const searchTokenSelector = selector<TokenInfo | null>({
  key: "searchTokenSelector",
  get: async ({ get }) => {
    const searchToken = get(searchTokenStatus);

    if (searchToken) {
      const { nameOrAdd, chainId } = searchToken;
      const isEthHex = nameOrAdd?.startsWith("0x");

      if (isEthHex) {
        const tokenContract = new ethers.Contract(
          nameOrAdd,
          ERC20_ABI.abi,
          getL1Provider()
        );
        const [tokenName, tokenSymbol, decimals] = await Promise.all([
          tokenContract.name(),
          tokenContract.symbol(),
          tokenContract.decimals(),
        ]);

        return {
          tokenName,
          tokenSymbol,
          address: {
            MAINNET: nameOrAdd,
            GOERLI: nameOrAdd,
            TITAN: nameOrAdd,
            DARIUS: nameOrAdd,
          },
          decimals,
          isNativeCurrency: null,
        };
      }
    }
    return null;
  },
});

export const searchTokenList = selector<SupportedTokens_T>({
  key: "searchTokenListSelector",
  get: ({ get }) => {
    const searchedToken = get(searchTokenSelector);

    if (searchedToken) {
      // const { matchedKey } = getKeyByValue(
      //   SupportedChainId,
      //   searchedToken.chainId
      // );

      return [...supportedTokens, searchedToken];
    }
    return supportedTokens;
  },
});
