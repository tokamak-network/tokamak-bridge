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
import useFwUpdateFeeModal from "@/staging/components/cross-trade/hooks/useFwUpdateFeeModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useFwConfirmModal";
import CloseButton from "@/components/button/CloseButton";
import FwConfirmDetail from "./FwConfirmDetail";
import FwConfirmCrossTradeFooter from "./FwConfirmCrossTradeFooter";
import FwConfirmHistoryFooter from "./FwConfirmHistoryFooter";

export default function FwModal() {
  const { fwConfirmModal, onCloseFwConfirmModal } = useFxConfirmModal();
  const { onOpenFwUpdateFeeModal } = useFwUpdateFeeModal();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // pencil 클릭시 업데이트
  const handlePencilClick = () => {
    onCloseFwConfirmModal();
    onOpenFwUpdateFeeModal();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const handleConfirm = () => {
    alert("Cross Confirmed!");
    setIsChecked(false);
    onCloseFwConfirmModal();
  };

  const modalTitles = {
    [ModalType.Trade]: "Confirm Cross Trade",
    [ModalType.History]: "Cross Trade",
  };

  return (
    <Modal
      isOpen={fwConfirmModal.isOpen}
      onClose={onCloseFwConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            {modalTitles[fwConfirmModal.type]}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseFwConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <FwConfirmDetail
            modalType={fwConfirmModal.type}
            onPencilClick={handlePencilClick}
          />
        </ModalBody>
        <ModalFooter p={0} display='block'>
          {/** fw type에 따라 footer가 달라진다. */}
          {fwConfirmModal.type == ModalType.Trade ? (
            <FwConfirmCrossTradeFooter
              isChecked={isChecked}
              onCheckboxChange={handleCheckboxChange}
              onConfirm={handleConfirm}
            />
          ) : (
            <FwConfirmHistoryFooter />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
