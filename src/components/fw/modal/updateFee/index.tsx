import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import CloseButton from "@/components/button/CloseButton";
import useFwUpdateFee from "@/components/fw/hooks/useFwUpdateFeeModal";
import FwUpdateFeeDetail from "./FwUpdateFeeDetail";

export default function FwFeeUpdateModal() {
  const { fwUpdateFeeModal, onCloseFwUpdateFeeModal } = useFwUpdateFee();
  return (
    <Modal
      isOpen={fwUpdateFeeModal}
      onClose={onCloseFwUpdateFeeModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        width={"404px"}
      >
        <ModalHeader px={0} pt={0} pb={"16px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"normal"}>
            Update
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseFwUpdateFeeModal} />
        </Box>
        <ModalBody p={0}>
          <FwUpdateFeeDetail />
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            mt={"16px"}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: false ? "#17181D" : "#007AFF",
              color: false ? "#8E8E92" : "#FFFFFF",
            }}
            _hover={{}}
            isDisabled={false}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"normal"}>
              Update Fee
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
