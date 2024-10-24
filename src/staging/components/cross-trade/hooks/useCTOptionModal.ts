import { ctOptionModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useCTOption() {
  const [ctOptionModal, setCTOptionModal] = useRecoilState(ctOptionModalStatus);

  const onOpenCTOptionModal = (nextBtnDisabled?: boolean) => {
    setCTOptionModal({ isOpen: true, nextBtnDisabled });
  };

  const onCloseCTOptionModal = useCallback(() => {
    setCTOptionModal({ isOpen: false, nextBtnDisabled: true });
  }, []);

  return {
    ctOptionModal,
    onOpenCTOptionModal,
    onCloseCTOptionModal,
  };
}
