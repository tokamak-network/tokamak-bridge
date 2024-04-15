import {
  confirmModalStatus,
  confirmWithdrawData,
  transactionModalOpenStatus,
  transactionModalStatus,
} from "@/recoil/modal/atom";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountDrawerStatus, claimModalStatus } from "@/recoil/modal/atom";
import { useToast } from "@chakra-ui/react";

export default function useTxConfirmModal() {
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  const [isOpen, setIsOpen] = useRecoilState(transactionModalOpenStatus);
  const isHistoryDrawerOpen = useRecoilValue(accountDrawerStatus);
  const [claimModalState, setClaimModalState] =
    useRecoilState(claimModalStatus);
  const [withdrawData, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const { closeAll } = useToast();

  const isConfirming = modalOpen === "confirming";
  const isConfirmed = modalOpen === "confirmed";
  const isError = modalOpen === "error";
  const isClaiming = isHistoryDrawerOpen === true;
  const isClaimWaiting = claimModalState === true;

  const closeModal = useCallback(() => {
    if (!isClaimWaiting) {
      setModalOpen(null);
      setIsOpen(false);
      setClaimModalState(false);
      setWithdrawData({
        modalData: null,
      });
      //close toast for transaction
      closeAll();
    }
  }, [setModalOpen, setIsOpen, isClaimWaiting, closeAll]);

  return {
    isOpen,
    setIsOpen,
    isConfirming,
    isConfirmed,
    isError,
    closeModal,
    isClaiming,
    setModalOpen,
    isClaimWaiting,
  };
}
