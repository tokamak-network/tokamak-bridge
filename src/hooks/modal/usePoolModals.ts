import { poolModalStatus } from "@/recoil/modal/atom";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

export function usePoolModals() {
  const [poolModal, setPoolModal] = useRecoilState(poolModalStatus);

  const onOpenClaimEarning = useCallback(() => {
    setPoolModal("colectFee");
  }, [setPoolModal]);

  const onClose = useCallback(() => {
    setPoolModal(null);
  }, [setPoolModal]);

  return { onOpenClaimEarning, onClose, isOpen: poolModal };
}
