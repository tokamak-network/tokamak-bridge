import { InTokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilState } from "recoil";

export default function useCustomModal() {
  const [inTokenModal, setInTokenModal] = useRecoilState(InTokenModalStatus);

  const isInTokenOpen = inTokenModal?.isOpen;
  const onCloseInToken = () => {
    setInTokenModal({ isOpen: false, modalData: null });
  };

  return { isInTokenOpen, onCloseInToken };
}
