import { useCallback } from "react";
import { useRecoilState } from "recoil";
import { poolModalStatus } from "@/recoil/modal/atom";

export default function usePreview() {
  const [poolModal, setPoolModal] = useRecoilState(poolModalStatus);

  const onClosePreviewModal = useCallback(() => {
    setPoolModal(null);
  }, [setPoolModal]);

  return {
    setPoolModal,
    onClosePreviewModal,
    poolModal,
  };
}
