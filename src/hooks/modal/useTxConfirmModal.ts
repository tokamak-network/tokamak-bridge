import {
  confirmModalStatus,
  transactionModalOpenStatus,
  transactionModalStatus,
} from "@/recoil/modal/atom";
import { useCallback, useState } from "react";
import { useRecoilState } from "recoil";

export default function useTxConfirmModal() {
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  const [isOpen, setIsOpen] = useRecoilState(transactionModalOpenStatus);

  const isConfirming = modalOpen === "confirming";
  const isConfirmed = modalOpen === "confirmed";
  const isError = modalOpen === "error";

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
    setModalOpen,
  };
}
