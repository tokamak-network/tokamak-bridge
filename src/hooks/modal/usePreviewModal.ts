import { useCallback, useEffect } from "react";
import { useRecoilState } from "recoil";
import { previewModalStatus } from "@/recoil/modal/atom";

export default function usePreview() {
  const [isOpen, setPreviewModal] = useRecoilState(previewModalStatus);

  const onOpenPreviewModal = () => {
    setPreviewModal(true);
  };

  const onClosePreviewModal = useCallback(() => {
    setPreviewModal(false);
  }, []);

  return {
    isOpen,
    onOpenPreviewModal,
    onClosePreviewModal,
    setPreviewModal
  };
}
