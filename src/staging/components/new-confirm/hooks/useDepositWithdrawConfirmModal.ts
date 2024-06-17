import { depositWithdrawConfirmModalStatus } from "@/recoil/modal/atom";
import { TransactionHistory } from "@/staging/components/new-history/types";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useDepositWithdrawConfirm() {
  const [depositWithdrawConfirmModal, setDepositWithdrawConfirmModal] =
    useRecoilState(depositWithdrawConfirmModalStatus);

  const onOpenDepositWithdrawConfirmModal = (
    transaction: TransactionHistory
  ) => {
    setDepositWithdrawConfirmModal({ isOpen: true, transaction: transaction });
  };

  const onCloseDepositWithdrawConfirmModal = useCallback(() => {
    setDepositWithdrawConfirmModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return {
    depositWithdrawConfirmModal,
    onOpenDepositWithdrawConfirmModal,
    onCloseDepositWithdrawConfirmModal,
  };
}
