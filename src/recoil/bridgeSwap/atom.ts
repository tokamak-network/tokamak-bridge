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

export const actionMode = selector<ActionMode>({
  key: "actionMode",
  get: ({ get }) => {
    const network = get(networkStatus);
    if (network?.inNetwork && network?.outNetwork) {
      if (network.inNetwork.isTokamak && !network.outNetwork.isTokamak) {
        return "Withdraw";
      }
      if (network.inNetwork === network.outNetwork) {
        return "Swap";
      }
      return "Deposit";
    }
    return null;
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

type SelectedInToken = TokenInfo & {
  amountBN: BigInt | null;
};

export const selectedInTokenStatus = atom<SelectedInToken | null>({
  key: "selectedInTokenStatus",
  default: null,
});

export const selectedOutTokenStatus = atom<SelectedInToken | null>({
  key: "selectedOutTokenStatus",
  default: null,
});

export const inTokenSelector = selector<{ inTokenHasAmount: boolean }>({
  key: "inTokenSeletor",
  get: ({ get }) => {
    const inTokenStatus = get(selectedInTokenStatus);
    const inTokenHasAmount = inTokenStatus?.amountBN !== null;
    return { inTokenHasAmount };
  },
});

export const outTokenSelector = selector<{ outTokenHasAmount: boolean }>({
  key: "outTokenSeletor",
  get: ({ get }) => {
    const outTokenStatus = get(selectedOutTokenStatus);
    const outTokenHasAmount = outTokenStatus?.amountBN !== null;
    return { outTokenHasAmount };
  },
});
