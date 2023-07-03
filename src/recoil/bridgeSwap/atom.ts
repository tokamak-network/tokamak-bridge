import { ActionMode, InOutNetworks } from "@/types/bridgeSwap";
import { Field } from "@/types/swap/swap";
import { TokenInfo, supportedTokens } from "types/token/supportedToken";
import { atom, selector } from "recoil";
import { ethers } from "ethers";
import ERC20_ABI from "@/constant/abis/erc20.json";
import { useProvier } from "@/hooks/provider/useProvider";

export const networkStatus = atom<InOutNetworks>({
  key: "networkStatus",
  default: {
    inNetwork: null,
    outNetwork: null,
  },
});

type SelectTokenModal = {
  isOpen: Field | null;
  modalData?: any;
};

export const tokenModalStatus = atom<SelectTokenModal>({
  key: "tokenModalStatus",
  default: {
    isOpen: null,
    modalData: null,
  },
});

type ConfirmWithdraw = boolean;

export const confirmWithdrawStatus = atom<ConfirmWithdraw>({
  key: "confirmWithdrawStatus",
  default: false,
});

export type SelectedToken = TokenInfo & {
  amountBN: BigInt | null;
  parsedAmount: string | null;
  tokenAddress: string | null;
};

export const selectedInTokenStatus = atom<SelectedToken | null>({
  key: "selectedInTokenStatus",
  default: null,
});

export const selectedOutTokenStatus = atom<SelectedToken | null>({
  key: "selectedOutTokenStatus",
  default: null,
});

export const inTokenSelector = selector<{ inTokenHasAmount: boolean }>({
  key: "inTokenSeletor",
  get: ({ get }) => {
    const inTokenStatus = get(selectedInTokenStatus);
    const inTokenHasAmount =
      inTokenStatus === null ? false : inTokenStatus?.amountBN !== null;
    return { inTokenHasAmount };
  },
});

export const outTokenSelector = selector<{ outTokenHasAmount: boolean }>({
  key: "outTokenSeletor",
  get: ({ get }) => {
    const outTokenStatus = get(selectedOutTokenStatus);
    const outTokenHasAmount =
      outTokenStatus === null ? false : outTokenStatus?.amountBN !== null;
    return { outTokenHasAmount };
  },
});

export const actionMode = selector<{ mode: ActionMode; isReady: boolean }>({
  key: "actionMode",
  get: ({ get }) => {
    const network = get(networkStatus);
    const { inTokenHasAmount } = get(inTokenSelector);
    const { outTokenHasAmount } = get(outTokenSelector);

    const inTokenStatus = get(selectedInTokenStatus);
    const outTokenStatus = get(selectedOutTokenStatus);

    if (network?.inNetwork && network?.outNetwork) {
      const isInTokenReady = inTokenHasAmount;
      const isOutTokenReady = outTokenHasAmount;

      const isWrap = [
        inTokenStatus?.address === supportedTokens[2].address &&
          outTokenStatus?.address === supportedTokens[3].address,
        inTokenStatus?.address === supportedTokens[3].address &&
          outTokenStatus?.address === supportedTokens[2].address,
      ];

      if (isWrap.includes(true) && network.inNetwork === network.outNetwork) {
        if (isWrap[0]) {
          return {
            mode: "Wrap",
            isReady: isInTokenReady,
          };
        }
        if (isWrap[1]) {
          return {
            mode: "Unwrap",
            isReady: isInTokenReady,
          };
        }
      }

      if (network.inNetwork.isTokamak && !network.outNetwork.isTokamak) {
        return {
          mode: "Withdraw",
          isReady: isInTokenReady,
        };
      }
      if (network.inNetwork === network.outNetwork) {
        return {
          mode: "Swap",
          isReady: isInTokenReady && isOutTokenReady,
        };
      }
      return { mode: "Deposit", isReady: isInTokenReady };
    }
    return { mode: null, isReady: false };
  },
});
