import { ctUpdateFeeModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useCTUpdateFee() {
  const [ctUpdateFeeModal, setCTUpdateFeeModal] = useRecoilState(
    ctUpdateFeeModalStatus
  );

  const onOpenCTUpdateFeeModal = () => {
    setCTUpdateFeeModal(true);
  };

  const onCloseCTUpdateFeeModal = useCallback(() => {
    setCTUpdateFeeModal(false);
  }, []);

  return {
    ctUpdateFeeModal,
    onOpenCTUpdateFeeModal,
    onCloseCTUpdateFeeModal,
  };
}
