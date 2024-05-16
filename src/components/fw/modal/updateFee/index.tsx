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
import { useState, useEffect } from "react";
import { WarningType } from "@/components/fw/types";
import CloseButton from "@/components/button/CloseButton";
import useFwUpdateFee from "@/components/fw/hooks/useFwUpdateFeeModal";
import FwUpdateFeeDetail from "./FwUpdateFeeDetail";

export default function FwFeeUpdateModal() {
  const { fwUpdateFeeModal, onCloseFwUpdateFeeModal } = useFwUpdateFee();

  // FwOptionInput 관련 state 및 function Start @Robert
  const [inputValue, setInputValue] = useState("");
  const [inputWarningCheck, setInputWarningCheck] = useState<WarningType | "">(
    ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^[123\s]*$/.test(value)) {
      setInputValue(value);
    }
  };

  // input이 변경될 때, 값이 있으면 rightElement를 보여준다.
  // 현재 1일때 red warning, 2일때, yellow warning
  useEffect(() => {
    switch (inputValue) {
      case "1":
        setInputWarningCheck(WarningType.Critical);
        break;
      case "2":
        setInputWarningCheck(WarningType.Normal);
        break;
      default:
        setInputWarningCheck("");
    }
  }, [inputValue]);
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
          <FwUpdateFeeDetail
            // input 관련 props
            inputValue={inputValue}
            inputWarningCheck={inputWarningCheck}
            onInputChange={handleInputChange}
          />
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
