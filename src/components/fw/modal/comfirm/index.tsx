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
import { ModalType } from "@/types/fw";
import { useState } from "react";
import useFxConfirmModal from "@/components/fw/hooks/useFwConfirmModal";
import CloseButton from "@/componenets/button/CloseButton";
import FwConfirmDetail from "./FwConfirmDetail";
import FwConfirmCrossTradeFooter from "./FwConfirmCrossTradeFooter";
import FwConfirmHistoryFooter from "./FwConfirmHistoryFooter";

export default function FwModal() {
  const { fwConfirmModal, onCloseFwConfirmModal } = useFxConfirmModal();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const handleConfirm = () => {
    console.log("Confirmed!");
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
      <ModalContent bg='#1F2128' p={"20px"} borderRadius={"16px"}>
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            {modalTitles[fwConfirmModal.type]}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseFwConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <FwConfirmDetail modalType={fwConfirmModal.type} />
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
