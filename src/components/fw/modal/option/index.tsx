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
import { useState, useEffect } from "react";
import useFxOptionModal from "@/components/fw/hooks/useFwOptionModal";
import CloseButton from "@/componenets/button/CloseButton";
import useFxConfirmModal from "@/components/fw/hooks/useFwConfirmModal";
import { ModalType, WarningType, ButtonType } from "@/componenets/fw/types";
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

  // FwOptionInput 관련 state 및 function Start @Robert
  const [inputValue, setInputValue] = useState("");
  const [inputWarningCheck, setInputWarningCheck] = useState<WarningType | "">(
    ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^[012\s]*$/.test(value)) {
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
  //input 관련 state 및 function End

  // FwConfirmDetail button 관련 state 및 function Start @Robert
  const [activeButtonValue, setActiveButtonValue] = useState<ButtonType>(
    ButtonType.Recommend
  );

  const handleButtonClick = (value: ButtonType) => {
    setActiveButtonValue(value);
  };

  //임시 체크 로직
  useEffect(() => {
    console.log(activeButtonValue);
  }, [activeButtonValue]);
  // FwConfirmDetail button 관련 state 및 function End

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
          {!nextStep ? (
            <FwComingOptionDetail />
          ) : (
            <FwOptionCrossDetail
              // button 관련 props
              activeButtonValue={activeButtonValue}
              handleButtonClick={handleButtonClick}
              // input 관련 props
              inputValue={inputValue}
              inputWarningCheck={inputWarningCheck}
              onInputChange={handleInputChange}
            />
          )}

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
