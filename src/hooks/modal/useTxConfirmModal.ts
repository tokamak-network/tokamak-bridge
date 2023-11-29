import {
  transactionModalOpenStatus,
  transactionModalStatus,
} from "@/recoil/modal/atom";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";

export default function useTxConfirmModal() {
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  const [isOpen, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  const isHistoryDrawerOpen = useRecoilValue(accountDrawerStatus);

  const isConfirming = modalOpen === "confirming";
  const isConfirmed = modalOpen === "confirmed";
  const isError = modalOpen === "error";
  const isClaiming = isHistoryDrawerOpen === true;

  const closeModal = useCallback(() => {
    setModalOpen(null);
    setIsOpen(false);
  }, [setModalOpen, setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    isConfirming,
    isConfirmed,
    isError,
    closeModal,
    isClaiming,
    setModalOpen,
  };
}
