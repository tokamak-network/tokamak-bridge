import { InTokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilState } from "recoil";

export default function useCustomModal() {
  const [inTokenModal, setInTokenModal] = useRecoilState(InTokenModalStatus);

  const isInTokenOpen = inTokenModal?.isOpen;
  const onOpenInToken = () => {
    setInTokenModal({ isOpen: true, modalData: null });
  };
  const onCloseInToken = () => {
    setInTokenModal({ isOpen: false, modalData: null });
  };

  return { isInTokenOpen, onOpenInToken, onCloseInToken };
}
