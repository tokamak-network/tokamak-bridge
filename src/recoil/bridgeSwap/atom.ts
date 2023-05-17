import { SupportedChainProperties } from "@/types/network/supportedNetwork";
import { TokenInfo } from "@/types/token/supportedToken";
import { atom } from "recoil";

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

type SelectedInToken = TokenInfo | null;

export const SelectedInTokenStatus = atom<SelectedInToken>({
  key: "SelectTokenModalBottomStatus",
  default: null,
});
