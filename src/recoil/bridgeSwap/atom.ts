import { SupportedChainProperties } from "@/types/network/supportedNetwork";
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
