import { ActionMode, InOutNetworks } from "@/types/bridgeSwap";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { SupportedChainProperties } from "@/types/network/supportedNetwork";
import { Field } from "@/types/swap/swap";
import { TokenInfo } from "types/token/supportedToken";
import { BigNumberish } from "ethers";
import { atom, selector } from "recoil";

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

export type SelectedToken = TokenInfo & {
  amountBN: BigInt | null;
  parsedAmount: string | null;
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

    if (network?.inNetwork && network?.outNetwork) {
      const isInTokenReady = inTokenHasAmount;
      const isOutTokenReady = inTokenHasAmount;

      if (network.inNetwork.isTokamak && !network.outNetwork.isTokamak) {
        return { mode: "Withdraw", isReady: isInTokenReady };
      }
      if (network.inNetwork === network.outNetwork) {
        return { mode: "Swap", isReady: isInTokenReady && isOutTokenReady };
      }
      return { mode: "Deposit", isReady: isInTokenReady };
    }
    return { mode: null, isReady: false };
  },
});
