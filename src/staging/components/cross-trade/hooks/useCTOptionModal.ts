import { ctOptionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useCTOption() {
  const [ctOptionModal, setCTOptionModal] = useRecoilState(ctOptionModalStatus);

  const onOpenCTOptionModal = () => {
    setCTOptionModal({ isOpen: true });
  };

  const onCloseCTOptionModal = useCallback(() => {
    setCTOptionModal({ isOpen: false });
  }, []);

  return {
    ctOptionModal,
    onOpenCTOptionModal,
    onCloseCTOptionModal,
  };
}
