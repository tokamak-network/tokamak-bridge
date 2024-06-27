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
  textDecoration,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  WarningType,
  UpdateFeeButtonType,
} from "@/staging/components/cross-trade/types";
import CloseButton from "@/components/button/CloseButton";
import useCTUpdateFee from "@/staging/components/cross-trade/hooks/useCTUpdateFeeModal";
import useCTRecommend from "@/staging/components/cross-trade/hooks/useCTRecommend";
import CTUpdateButton from "./CTUpdateButton";
import CTUpdateFeeDetail from "./CTUpdateFeeDetail";
import CTRefundDetail from "./CTRefundDetail";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";

// 데이터 셋을 선언만 하면, 참고 해서 서버 작업
// 데이터 셋 타입파일을 만든다.
// 타입을 맞추고, 타입에 맞게 데이터셋을 뽑는다.

export default function CTFeeUpdateModal() {
  const { ctUpdateFeeModal, onCloseCTUpdateFeeModal } = useCTUpdateFee();
  //Button props
  const [activeButton, setActiveButton] = useState<UpdateFeeButtonType>(
    UpdateFeeButtonType.Update
  );

  // Update Fee Recommend 값 사용할지, 그냥 사용할지 확인하는 state
  // false 일때는 사용자 입력 값
  const [recommendCheck, setRecommendCheck] = useState<boolean>(true);

  // CTInput 관련 state 및 function Start @Robert
  const [inputValue, setInputValue] = useState("");
  const [inputWarningCheck, setInputWarningCheck] = useState<WarningType | "">(
    ""
  );
  // usestate memo 대체 하는 경우도 존재, useefect 지양하는경우도 존재.(쓰더라도 짧게)
  // 반복문, usehook안에서 hook은 돌리면 안된다. //메모리 문재
  const recommendValue = useCTRecommend(recommendCheck);

  // 리프래시 버튼 누를 때, recommend 값 초기화
  const handleRefreshRecommend = () => {
    // 호이스팅
    setInputValue("");
    setRecommendCheck(true);
  };

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
  const [networkCheck, setNetworkCheck] = useState<boolean>(true);

  // 추후 삭제
  const resetAllStates = () => {
    setRecommendCheck(true);
    setActiveButton(UpdateFeeButtonType.Update);
    setInputValue("");
    setInputWarningCheck("");
    setIsChecked(false);
    onCloseCTUpdateFeeModal();
    setNetworkCheck(true);
  };

  // 시연을 위한 초기화 추후 삭제

  const handleConfirm = () => {
    setNetworkCheck(false);
  };

  return (
    <Modal isOpen={ctUpdateFeeModal} onClose={resetAllStates} isCentered>
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
          <CloseButton onClick={resetAllStates} />
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
            <CTUpdateButton
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
            {!networkCheck && activeButton == UpdateFeeButtonType.Update && (
              <Box
                my={"16px"}
                px={"16px"}
                py={"12px"}
                justifyContent={"center"}
                alignItems={"flex-start"}
                gap={"4px"}
                bg={"#15161D"}
                borderRadius={"8px"}
                border={"1px solid #DD3A44"}
              >
                <Text
                  fontWeight={400}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#DD3A44"}
                >
                  Please switch to{" "}
                  <span style={{ textDecoration: "underline" }}>
                    Titan Network
                  </span>
                </Text>
              </Box>
            )}

            {activeButton == UpdateFeeButtonType.Update ? (
              <CTUpdateFeeDetail
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
              <CTRefundDetail />
            )}
          </Box>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          {activeButton == UpdateFeeButtonType.CancelRequest && (
            <Box mt={"16px"}>
              <Checkbox
                isChecked={isChecked}
                onChange={handleCheckboxChange}
                icon={<CheckCustomIcon />}
                sx={{
                  ".chakra-checkbox__control": {
                    borderWidth: "1px",
                    borderColor: "#A0A3AD",
                    _focus: {
                      boxShadow: "none",
                    },
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
              backgroundColor:
                activeConfirmButton && networkCheck ? "#007AFF" : "#17181D",
              color:
                activeConfirmButton && networkCheck ? "#FFFFFF" : "#8E8E92",
            }}
            _hover={{}}
            onClick={handleConfirm}
            isDisabled={!activeConfirmButton || !networkCheck}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"normal"}>
              {activeButton == UpdateFeeButtonType.Update
                ? !networkCheck
                  ? "Wrong Network"
                  : "Update fee"
                : "Cancel request"}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
