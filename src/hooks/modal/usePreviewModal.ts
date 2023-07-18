import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { previewModalStatus, poolModalStatus } from "@/recoil/modal/atom";

export default function usePreview() {
  const [isOpen, setPreviewModalStatus] = useRecoilState(previewModalStatus);
  const [poolModal, setPoolModal] = useRecoilState(poolModalStatus);

  const onOpenPreviewModal = () => {
    setPreviewModalStatus(true);
  };

  const onClosePreviewModal = useCallback(() => {
    setPreviewModalStatus(false);
    setPoolModal(null);
  }, [setPreviewModalStatus, setPoolModal]);

  return {
    isOpen,
    setPoolModal,
    onClosePreviewModal,
    poolModal,
    setPreviewModalStatus,
  };
}
