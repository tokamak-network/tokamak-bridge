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
import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import CloseButton from "@/components/button/CloseButton";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import {
  WarningType,
  ButtonTypeMain,
  ButtonTypeSub,
} from "@/staging/components/cross-trade/types";
import CTOptionCrossDetail from "./CTOptionCrossDetail";
import CTOptionStandardDetail from "./CTOptionStandardDetail";
import CTOptionDisabledDetail from "./CTOptionDisabledDetail";

export default function CTOptionModal() {
  const { ctOptionModal, onCloseCTOptionModal } = useFxOptionModal();
  const { onOpenCTConfirmModal } = useFxConfirmModal();

  // CTConfirmDetail button 관련 state 및 function Start @Robert
  const [activeMainButtonValue, setActiveMainButtonValue] =
    useState<ButtonTypeMain>(ButtonTypeMain.Cross);

  const [activeSubButtonValue, setActiveSubButtonValue] =
    useState<ButtonTypeSub>(ButtonTypeSub.Recommend);

  const handleButtonMainClick = (value: ButtonTypeMain) => {
    setActiveMainButtonValue(value);
  };

  const handleButtonSubClick = (value: ButtonTypeSub) => {
    setActiveSubButtonValue(value);
  };

  // CTOptionInput 관련 state 및 function Start @Robert
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

  // 추후 삭제
  const resetAllStates = () => {
    onCloseCTOptionModal();
    setInputValue("");
    setActiveMainButtonValue(ButtonTypeMain.Cross);
    setActiveSubButtonValue(ButtonTypeSub.Recommend);
    setInputWarningCheck("");
  };

  const handleConfirm = () => {
    // 시연을 위한 초기화 추후 삭제
    resetAllStates();
  };

  return (
    <Modal isOpen={ctOptionModal} onClose={onCloseCTOptionModal} isCentered>
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
          <CloseButton onClick={onCloseCTOptionModal} />
        </Box>
        <ModalBody p={0}>
          {/** 현재 임시로 standard를 클릭 했을 때, disabled가 나오게 함. @Robert
           * 추후, crosstrade가 지원 되지 않은 토큰 일 때,  CTOptionDisabledDetail 해당 컴포넌트가 나오도록 수정
           */}
          {activeMainButtonValue === ButtonTypeMain.Standard ? (
            <CTOptionDisabledDetail />
          ) : (
            <CTOptionCrossDetail
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
          )}

          <CTOptionStandardDetail
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
            _active={{}}
            _focus={{}}
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
