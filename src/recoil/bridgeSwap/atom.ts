import { ActionMode, InOutNetworks } from "@/types/bridgeSwap";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { SupportedChainProperties } from "@/types/network/supportedNetwork";
import { TokenInfo } from "@/types/token/supportedToken";
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
  isOpen: boolean;
  modalData?: any;
};

type InTokenModal = SelectTokenModal;

export const InTokenModalStatus = atom<InTokenModal>({
  key: "SelectTokenModalBottomStatus",
  default: {
    isOpen: false,
    modalData: null,
  },
});

type SelectedInToken = TokenInfo & {
  amountBN: BigInt | null;
};

export const SelectedInTokenStatus = atom<SelectedInToken | null>({
  key: "selectedInTokenStatus",
  default: null,
});
