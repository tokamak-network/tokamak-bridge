import {
  depositWithdrawConfirmModalStatus,
  legacyTitanConfirmModalStatus,
  thanosDepositWithdrawConfirmModalStatus,
} from "@/recoil/modal/atom";
import {
  Action,
  TransactionHistory,
  StandardHistory,
} from "@/staging/types/transaction";
import { useRecoilState } from "recoil";
import { useCallback, useEffect } from "react";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { isThanosChain } from "@/utils/network/checkNetwork";

export default function useDepositWithdrawConfirm() {
  const [depositWithdrawConfirmModal, setDepositWithdrawConfirmModal] =
    useRecoilState(depositWithdrawConfirmModalStatus);

  const [legacyTitanConfirmModal, setlegacyTitanConfirmModal] = useRecoilState(
    legacyTitanConfirmModalStatus
  );

  const [
    thanosDepositWithdrawConfirmModal,
    setThanosDepositWithdrawConfirmModal,
  ] = useRecoilState(thanosDepositWithdrawConfirmModalStatus);

  const onOpenDepositWithdrawConfirmModal = (
    transaction: TransactionHistory
  ) => {
    if (
      transaction.action === Action.Withdraw &&
      isThanosChain(transaction.inNetwork)
    ) {
      setThanosDepositWithdrawConfirmModal({
        isOpen: true,
        transaction: transaction,
      });
    } else
      setDepositWithdrawConfirmModal({
        isOpen: true,
        transaction: transaction as StandardHistory,
      });
  };

  const onCloseDepositWithdrawConfirmModal = useCallback(() => {
    setDepositWithdrawConfirmModal((prev) => ({
      transaction: undefined,
      isOpen: false,
    }));
  }, []);

  const onCloseThanosDepositWithdrawConfirmModal = useCallback(() => {
    setThanosDepositWithdrawConfirmModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const onCloseLegacyTitanConfirmModal = useCallback(() => {
    setlegacyTitanConfirmModal((prev) => ({
      transaction: undefined,
      isOpen: false,
    }));
  }, []);

  const onOpenLegacyTitanConfirmModal = (transaction: StandardHistory) => {
    setlegacyTitanConfirmModal({
      isOpen: true,
      transaction: transaction,
    });
  };

  return {
    depositWithdrawConfirmModal,
    thanosDepositWithdrawConfirmModal,
    onOpenDepositWithdrawConfirmModal,
    onCloseDepositWithdrawConfirmModal,
    onCloseThanosDepositWithdrawConfirmModal,
    onCloseLegacyTitanConfirmModal,
    onOpenLegacyTitanConfirmModal,
  };
}
