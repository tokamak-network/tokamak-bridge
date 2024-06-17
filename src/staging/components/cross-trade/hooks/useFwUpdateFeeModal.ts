import { fwUpdateFeeModalStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useFwUpdateFee() {
  const [fwUpdateFeeModal, setFwUpdateFeeModal] = useRecoilState(
    fwUpdateFeeModalStatus
  );

  const onOpenFwUpdateFeeModal = () => {
    setFwUpdateFeeModal(true);
  };

  const onCloseFwUpdateFeeModal = useCallback(() => {
    setFwUpdateFeeModal(false);
  }, []);

  return {
    fwUpdateFeeModal,
    onOpenFwUpdateFeeModal,
    onCloseFwUpdateFeeModal,
  };
}
