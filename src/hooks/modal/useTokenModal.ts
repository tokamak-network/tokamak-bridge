import { tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilState } from "recoil";

export default function useTokenModal() {
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);

  const isInTokenOpen = tokenModal?.isOpen === "INPUT";
  const isOutTokenOpen = tokenModal?.isOpen === "OUTPUT";

  const onOpenInToken = () => {
    setTokenModal({ isOpen: "INPUT", modalData: null });
  };
  const onOpenOutToken = () => {
    setTokenModal({ isOpen: "OUTPUT", modalData: null });
  };

  const onCloseTokenModal = () => {
    setTokenModal({ isOpen: null, modalData: null });
  };

  return {
    isInTokenOpen,
    isOutTokenOpen,
    onOpenInToken,
    onOpenOutToken,
    onCloseTokenModal,
  };
}
