import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import useFxOptionModal from "@/components/fw/hooks/useFwOptionModal";
import CloseButton from "@/componenets/button/CloseButton";
import useFxConfirmModal from "@/components/fw/hooks/useFwConfirmModal";
import { ModalType } from "@/types/fw";
import FwComingOptionDetail from "./FwComingOptionDetail";
import FwOptionCrossDetail from "./FwOptionCrossDetail";
import FwOptionStandardDetail from "./FwOptionStandardDetail";

export default function FwOptionModal() {
  const { fwOptionModal, onCloseFwOptionModal } = useFxOptionModal();
  const { onOpenFwConfirmModal } = useFxConfirmModal();
  const [nextStep, setNextStep] = useState<boolean>(false);

  const handleConfirm = () => {
    console.log("next");
    if (!nextStep) {
      setNextStep(true);
      return;
    }
    onCloseFwOptionModal();
    onOpenFwConfirmModal(ModalType.Trade);
  };

  return (
    <Modal isOpen={fwOptionModal} onClose={onCloseFwOptionModal} isCentered>
      <ModalOverlay />
      <ModalContent
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        width={"404px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Withdraw Option
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseFwOptionModal} />
        </Box>
        <ModalBody p={0}>
          {!nextStep ? <FwComingOptionDetail /> : <FwOptionCrossDetail />}

          <FwOptionStandardDetail />
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            mt={"12px"}
            onClick={handleConfirm}
            sx={{
              backgroundColor: "#007AFF",
              color: "#FFFFFF",
            }}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            _hover={{}}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
              Next
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
