import { fwConfirmModalStatus } from "@/recoil/modal/atom";
import { FwConfirmModalType } from "@/componenets/fw/types";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useFwConfirm() {
  const [fwConfirmModal, setFwConfirmModal] =
    useRecoilState(fwConfirmModalStatus);

  const onOpenFwConfirmModal = (type: FwConfirmModalType["type"]) => {
    setFwConfirmModal({ isOpen: true, type: type });
  };

  const onCloseFwConfirmModal = useCallback(() => {
    setFwConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    fwConfirmModal,
    onOpenFwConfirmModal,
    onCloseFwConfirmModal,
  };
}
