import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
} from "@chakra-ui/react";
import { ModalType } from "@/staging/components/cross-trade/types";
import { useState } from "react";
import useCTUpdateFeeModal from "@/staging/components/cross-trade/hooks/useCTUpdateFeeModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import CloseButton from "@/components/button/CloseButton";
import CTConfirmDetail from "./CTConfirmDetail";
import CTConfirmCrossTradeFooter from "./CTConfirmCrossTradeFooter";
import CTConfirmHistoryFooter from "./CTConfirmHistoryFooter";

export default function CTModal() {
  const { ctConfirmModal, onCloseCTConfirmModal } = useFxConfirmModal();
  const { onOpenCTUpdateFeeModal } = useCTUpdateFeeModal();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // pencil 클릭시 업데이트
  const handlePencilClick = () => {
    onCloseCTConfirmModal();
    onOpenCTUpdateFeeModal();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const handleConfirm = () => {
    setIsChecked(false);
    onCloseCTConfirmModal();
  };

  const modalTitles = {
    [ModalType.Trade]: "Confirm Cross Trade",
    [ModalType.History]: "Cross Trade",
  };

  return (
    <Modal
      isOpen={ctConfirmModal.isOpen}
      onClose={onCloseCTConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            {modalTitles[ctConfirmModal.type]}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseCTConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <CTConfirmDetail
            modalType={ctConfirmModal.type}
            onPencilClick={handlePencilClick}
            txData={ctConfirmModal.txData}
          />
        </ModalBody>
        <ModalFooter p={0} display="block">
          {ctConfirmModal.type == ModalType.Trade ? (
            <CTConfirmCrossTradeFooter
              isChecked={isChecked}
              onCheckboxChange={handleCheckboxChange}
              onConfirm={handleConfirm}
              txData={ctConfirmModal.txData}
              isProvide={ctConfirmModal.isProvide}
              subgraphData={ctConfirmModal.subgraphData}
            />
          ) : (
            <CTConfirmHistoryFooter txData={ctConfirmModal.txData} />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
