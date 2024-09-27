import { ctConfirmModalStatus } from "@/recoil/modal/atom";
import { CTConfirmModalType } from "@/staging/components/cross-trade/types";
import { useRecoilState } from "recoil";
import { useCallback } from "react";
import { CT_History } from "@/staging/types/transaction";
import { T_FETCH_REQUEST_LIST_L2 } from "@/staging/hooks/useCrossTrade";

export default function useCTConfirm() {
  const [ctConfirmModal, setCTConfirmModal] =
    useRecoilState(ctConfirmModalStatus);

  const onOpenCTConfirmModal = (params: {
    type: CTConfirmModalType["type"];
    txData: CT_History;
    isProvide?: boolean;
    subgraphData?: T_FETCH_REQUEST_LIST_L2;
  }) => {
    const { type, txData, isProvide, subgraphData } = params;
    setCTConfirmModal({
      isOpen: true,
      type,
      txData,
      isProvide,
      subgraphData,
    });
  };

  const onCloseCTConfirmModal = useCallback(() => {
    setCTConfirmModal((prev) => ({ ...prev, isOpen: false, txData: null }));
  }, []);

  return {
    ctConfirmModal,
    onOpenCTConfirmModal,
    onCloseCTConfirmModal,
  };
}
