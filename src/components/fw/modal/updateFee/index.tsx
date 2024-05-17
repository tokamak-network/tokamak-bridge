import {
  Box,
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { WarningType, UpdateFeeButtonType } from "@/components/fw/types";
import CloseButton from "@/components/button/CloseButton";
import useFwUpdateFee from "@/components/fw/hooks/useFwUpdateFeeModal";
import { useFwRecommend } from "@/components/fw/hooks/useFwRecommend";
import FwUpdateButton from "./FwUpdateButton";
import FwUpdateFeeDetail from "./FwUpdateFeeDetail";
import FwRefundDetail from "./FwRefundDetail";

export default function FwFeeUpdateModal() {
  const { fwUpdateFeeModal, onCloseFwUpdateFeeModal } = useFwUpdateFee();
  //Button props
  const [activeButton, setActiveButton] = useState<UpdateFeeButtonType>(
    UpdateFeeButtonType.Update
  );

  // Update Fee Recommend 값 사용할지, 그냥 사용할지 확인하는 state
  // false 일때는 사용자 입력 값
  const [recommendCheck, setRecommendCheck] = useState<boolean>(true);
  const [recommendValue, setRecommendValue] = useState<string>("");
  useEffect(() => {
    if (recommendCheck) {
      useFwRecommend().then((value) => {
        setRecommendValue(value);
      });
    }
  }, [recommendCheck]);

  // 리프래시 버튼 누를 때, recommend 값 초기화
  const handleRefreshRecommend = () => {
    // 호이스팅
    setInputValue("");
    setRecommendCheck(true);
  };

  // FwInput 관련 state 및 function Start @Robert
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

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 사용자의 입력 필드에 포커스가 맞춰지면, 추천 체크를 제거한다.
    setRecommendCheck(false);
  };

  // input이 변경될 때, 값이 있으면 rightElement를 보여준다.
  // 현재 1일때 red warning, 2일때, yellow warning, 3일때 통과
  // 123 밖에 입력이 안됨
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

  //check box
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  const activeConfirmButton =
    activeButton === UpdateFeeButtonType.Update
      ? recommendCheck ||
        !(inputValue === "" || inputWarningCheck === WarningType.Critical)
      : isChecked;
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
          <Box
            width={"364px"}
            bg='#15161D'
            px={"16px"}
            py={"16px"}
            borderRadius={"8px"}
          >
            {/** 상위 버튼 */}
            <FwUpdateButton
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
            {activeButton == UpdateFeeButtonType.Update ? (
              <FwUpdateFeeDetail
                // input 관련 props
                inputValue={inputValue}
                inputWarningCheck={inputWarningCheck}
                onInputChange={handleInputChange}
                onInputFocus={handleInputFocus}
                // input 관련 recommend 관련 props
                recommendCheck={recommendCheck}
                recommendValue={recommendValue}
                //새로 고침 props
                onRecommendRefresh={handleRefreshRecommend}
              />
            ) : (
              <FwRefundDetail />
            )}
          </Box>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          {activeButton == UpdateFeeButtonType.Refund && (
            <Box mt={"16px"}>
              <Checkbox
                isChecked={isChecked}
                onChange={handleCheckboxChange}
                sx={{
                  ".chakra-checkbox__control": {
                    borderWidth: "1px",
                    borderColor: "#A0A3AD",
                  },
                  _checked: {
                    "& .chakra-checkbox__control": {
                      borderColor: "#FFFFFF",
                    },
                  },
                }}
                colorScheme='#A0A3AD'
              >
                <Text
                  color={isChecked ? "#FFFFFF" : "#A0A3AD"}
                  fontWeight={400}
                  fontSize={"12px"}
                  lineHeight={"20px"}
                  letterSpacing={"0.12px"}
                >
                  text will be changed
                </Text>
              </Checkbox>
            </Box>
          )}
          <Button
            mt={"16px"}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: activeConfirmButton ? "#007AFF" : "#17181D",
              color: activeConfirmButton ? "#FFFFFF" : "#8E8E92",
            }}
            _hover={{}}
            isDisabled={!activeConfirmButton}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"normal"}>
              {activeButton == UpdateFeeButtonType.Update
                ? "Update Fee"
                : "Refund"}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
