import { ctUpdateFeeModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";
import { CT_History } from "@/staging/types/transaction";

export default function useCTUpdateFee() {
  const [ctUpdateFeeModal, setCTUpdateFeeModal] = useRecoilState(
    ctUpdateFeeModalStatus,
  );

  const onOpenCTUpdateFeeModal = (txData: CT_History | null) => {
    setCTUpdateFeeModal({ isOpen: true, txData });
  };

  const onCloseCTUpdateFeeModal = useCallback(() => {
    setCTUpdateFeeModal({ isOpen: false, txData: null });
  }, []);

  return {
    ctUpdateFeeModal,
    onOpenCTUpdateFeeModal,
    onCloseCTUpdateFeeModal,
  };
}
