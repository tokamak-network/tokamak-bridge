import { depositWithdrawConfirmModalStatus } from "@/recoil/modal/atom";
import {
  StandardHistory,
  TransactionHistory,
} from "@/staging/types/transaction";
import { useRecoilState } from "recoil";
import { useCallback } from "react";

export default function useDepositWithdrawConfirm() {
  const [depositWithdrawConfirmModal, setDepositWithdrawConfirmModal] =
    useRecoilState(depositWithdrawConfirmModalStatus);

  const onOpenDepositWithdrawConfirmModal = (transaction: StandardHistory) => {
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
