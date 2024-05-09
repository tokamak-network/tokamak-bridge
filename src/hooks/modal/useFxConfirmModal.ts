import { fwConfirmModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useFwConfirm() {
  const [isOpen, setFwConfirmModal] = useRecoilState(fwConfirmModalStatus);

  const onOpenFwConfirmModal = () => {
    console.log("타쥬?");
    setFwConfirmModal(true);
    console.log(isOpen);
  };

  const onCloseFwConfirmModal = useCallback(() => {
    setFwConfirmModal(false);
  }, []);

  return {
    isOpen,
    onOpenFwConfirmModal,
    onCloseFwConfirmModal,
  };
}
