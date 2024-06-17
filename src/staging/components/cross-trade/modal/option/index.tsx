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
import useFxOptionModal from "@/staging/components/cross-trade/hooks/useFwOptionModal";
import CloseButton from "@/components/button/CloseButton";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useFwConfirmModal";
import {
  ModalType,
  WarningType,
  ButtonTypeMain,
  ButtonTypeSub,
} from "@/staging/components/cross-trade/types";
import FwOptionCrossDetail from "./FwOptionCrossDetail";
import FwOptionStandardDetail from "./FwOptionStandardDetail";

export default function FwOptionModal() {
  const { fwOptionModal, onCloseFwOptionModal } = useFxOptionModal();
  const { onOpenFwConfirmModal } = useFxConfirmModal();

  // FwConfirmDetail button 관련 state 및 function Start @Robert
  const [activeMainButtonValue, setActiveMainButtonValue] =
    useState<ButtonTypeMain>(ButtonTypeMain.Standard);

  const [activeSubButtonValue, setActiveSubButtonValue] =
    useState<ButtonTypeSub>(ButtonTypeSub.Recommend);

  const handleButtonMainClick = (value: ButtonTypeMain) => {
    setActiveMainButtonValue(value);
  };

  const handleButtonSubClick = (value: ButtonTypeSub) => {
    setActiveSubButtonValue(value);
  };

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

  const shouldShowEnterAmount =
    activeMainButtonValue === ButtonTypeMain.Cross &&
    activeSubButtonValue === ButtonTypeSub.Advanced &&
    (inputValue === "" || inputWarningCheck === WarningType.Critical);

  const resetAllStates = () => {
    onCloseFwOptionModal();
    setInputValue("");
    setActiveMainButtonValue(ButtonTypeMain.Standard);
    setActiveSubButtonValue(ButtonTypeSub.Recommend);
    setInputWarningCheck("");
  };

  const handleConfirm = () => {
    //초기화
    resetAllStates();

    if (activeMainButtonValue === ButtonTypeMain.Standard) {
      alert("Official Standard Confirmed!");
      return;
    }

    // 스탠다드가 아닐때는 Trade
    onOpenFwConfirmModal(ModalType.Trade);
  };

  return (
    <Modal isOpen={fwOptionModal} onClose={onCloseFwOptionModal} isCentered>
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
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
          <FwOptionCrossDetail
            // cross, official 관련 props
            activeMainButtonValue={activeMainButtonValue}
            handleButtonMainClick={handleButtonMainClick}
            // recommend, Advanced button 관련 props
            activeSubButtonValue={activeSubButtonValue}
            handleButtonSubClick={handleButtonSubClick}
            // input 관련 props
            inputValue={inputValue}
            inputWarningCheck={inputWarningCheck}
            onInputChange={handleInputChange}
          />
          <FwOptionStandardDetail
            // cross, official 관련 props
            activeMainButtonValue={activeMainButtonValue}
            handleButtonMainClick={handleButtonMainClick}
          />
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            mt={"12px"}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: shouldShowEnterAmount ? "#17181D" : "#007AFF",
              color: shouldShowEnterAmount ? "#8E8E92" : "#FFFFFF",
            }}
            _hover={{}}
            onClick={handleConfirm}
            isDisabled={shouldShowEnterAmount}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
              {shouldShowEnterAmount ? "Enter amount" : "Next"}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
