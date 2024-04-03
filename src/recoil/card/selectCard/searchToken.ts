import { ethers } from "ethers";
import { atom, selector } from "recoil";
import ERC20_ABI from "@/abis/erc20.json";
import {
  SupportedTokens_T,
  TokenInfo,
  supportedTokens,
} from "@/types/token/supportedToken";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import { getProvider } from "@/config/getProvider";

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
    const { inNetwork } = get(networkStatus);

    if (searchToken) {
      const { nameOrAdd } = searchToken;
      const isEthHex = nameOrAdd?.startsWith("0x");

      try {
        if (isEthHex) {
          const tokenContract = new ethers.Contract(
            nameOrAdd,
            ERC20_ABI.abi,
            getProvider(inNetwork)
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
              SEPOLIA: nameOrAdd,
              THANOS_SEPOLIA: nameOrAdd,
              TITAN_SEPOLIA: nameOrAdd,
            },
            decimals,
            isNativeCurrency: null,
          };
        }
      } catch (e) {
        console.log("**searchTokenSelector err**");
        console.log(e);
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

export const IsSearchToken = atom<Boolean>({
  key: "isSearchToken",
  default: false,
});

export const isInputTokenAmount = atom<Boolean>({
  key: "isInputToken",
  default: false,
});

export const isOutputTokenAmount = atom<Boolean>({
  key: "isOutputToken",
  default: false,
});
