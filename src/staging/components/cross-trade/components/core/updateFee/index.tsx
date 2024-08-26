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
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  WarningType,
  UpdateFeeButtonType,
} from "@/staging/components/cross-trade/types";
import CloseButton from "@/components/button/CloseButton";
import useCTUpdateFee from "@/staging/components/cross-trade/hooks/useCTUpdateFeeModal";
import CTUpdateButton from "./CTUpdateButton";
import CTUpdateFeeDetail from "./CTUpdateFeeDetail";
import CTRefundDetail from "./CTRefundDetail";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
import { formatUnits, toParseNumber } from "@/utils/trim/convertNumber";
import { useCrossTradeContract } from "@/staging/hooks/useCrossTradeContracts";
import useConnectedNetwork from "@/hooks/network";
import { WrongNetwork } from "../../common/WrongNetwork";
import { BigNumber } from "ethers";
import { useRecommendFee } from "../../../hooks/useRecommendFee";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    if (typeof e === "string") return setInputValue(e);
    const { value } = e.target;

    if (!isNaN(Number(value))) {
      setInputValue(value);
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // 사용자의 입력 필드에 포커스가 맞춰지면, 추천 체크를 제거한다.
  };

  const inputParsedAmount = useMemo(() => {
    if (ctUpdateFeeModal.txData?.inToken.decimals && inputValue !== "") {
      return toParseNumber(
        inputValue,
        ctUpdateFeeModal.txData.inToken.decimals
      );
    }
  }, [inputValue, ctUpdateFeeModal.txData?.inToken.decimals]);

  const totalAmount = useMemo(() => {
    if (
      ctUpdateFeeModal.txData?.L2_subgraphData?._totalAmount &&
      ctUpdateFeeModal.txData?.inToken.decimals
    ) {
      return BigNumber.from(
        ctUpdateFeeModal.txData.L2_subgraphData._totalAmount
      );
    }
  }, [ctUpdateFeeModal.txData?.L2_subgraphData?._totalAmount]);

  const tokenAddress =
    ctUpdateFeeModal.txData?.L2_subgraphData?._l2token ?? "0x";
  const { recommendedFee: recommendValue } = useRecommendFee({
    totalAmount: Number(
      formatUnits(
        totalAmount?.toString(),
        ctUpdateFeeModal.txData?.inToken.decimals
      )
    ),
    tokenAddress,
  });

  useEffect(() => {
    if (recommendValue) {
      setInputValue(recommendValue.toString());
    }
  }, [recommendValue]);

  const handleRefreshRecommend = useCallback(() => {
    if (recommendValue) {
      setInputValue(recommendValue.toString());
      setRecommendCheck(true);
    }
  }, [recommendValue]);

  const isInputOver = useMemo(() => {
    if (inputParsedAmount && totalAmount) {
      return inputParsedAmount.gt(totalAmount);
    }
  }, [inputParsedAmount, totalAmount]);

  const isLessThanRecommendedFee = useMemo(() => {
    if (inputValue && recommendValue) {
      return Number(inputParsedAmount) < Number(recommendValue);
    }
  }, [inputValue, recommendValue]);

  useEffect(() => {
    if (isInputOver) return setInputWarningCheck(WarningType.Critical);
    if (isLessThanRecommendedFee)
      return setInputWarningCheck(WarningType.Normal);
    return setInputWarningCheck("");
  }, [isInputOver, isLessThanRecommendedFee]);

  //check box
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(!isChecked);

  const activeConfirmButton =
    activeButton === UpdateFeeButtonType.Update
      ? recommendCheck ||
        !(inputValue === "" || inputWarningCheck === WarningType.Critical)
      : isChecked;
  const { connectedToLayer1 } = useConnectedNetwork();
  const [, setIsOpen] = useRecoilState(accountDrawerStatus);

  const resetAllStates = () => {
    setRecommendCheck(true);
    setActiveButton(UpdateFeeButtonType.Update);
    setInputValue("");
    setInputWarningCheck("");
    setIsChecked(false);
    onCloseCTUpdateFeeModal();
    setIsOpen(false);
  };

  useEffect(() => {
    resetAllStates();
  }, []);

  const { editFee: _editFee, cancelRequest: _cancelRequest } =
    useCrossTradeContract();

  const editFee = useCallback(() => {
    try {
      if (ctUpdateFeeModal.txData && ctUpdateFeeModal.txData.L2_subgraphData) {
        const {
          _l1token,
          _l2token,
          _totalAmount,
          _ctAmount,
          _saleCount,
          _l2chainId,
          _hashValue,
        } = ctUpdateFeeModal.txData.L2_subgraphData;
        const editAmount = toParseNumber(
          inputValue,
          ctUpdateFeeModal.txData.inToken.decimals
        );

        if (!editAmount) return console.error("editAmount is undefined");

        const _editedctAmount = BigNumber.from(_totalAmount).sub(editAmount);
        const params = [
          _l1token,
          _l2token,
          _totalAmount,
          _ctAmount,
          _editedctAmount,
          _saleCount,
          _l2chainId,
          _hashValue,
        ];

        console.log("--editFee params--", params);

        _editFee({
          args: params,
        });
        resetAllStates();
      }
    } catch (e) {
      console.log(e);
    }
  }, [_editFee, ctUpdateFeeModal.txData, inputValue]);

  const cancelRequest = useCallback(() => {
    if (ctUpdateFeeModal.txData && ctUpdateFeeModal.txData.L2_subgraphData) {
      const {
        _l1token,
        _l2token,
        _totalAmount,
        _ctAmount,
        _saleCount,
        _l2chainId,
        _hashValue,
      } = ctUpdateFeeModal.txData.L2_subgraphData;

      const params = [
        _l1token,
        _l2token,
        _totalAmount,
        _ctAmount,
        _saleCount,
        _l2chainId,
        200000,
        _hashValue,
      ];
      console.log("--cancel params--", params);

      _cancelRequest({
        args: params,
      });
      resetAllStates();
    }
  }, [ctUpdateFeeModal.txData, _cancelRequest]);

  const handleConfirm = useCallback(() => {
    if (activeButton === UpdateFeeButtonType.Update) return editFee();
    if (activeButton === UpdateFeeButtonType.CancelRequest)
      return cancelRequest();
  }, [activeButton, editFee, cancelRequest]);

  return (
    <Modal isOpen={ctUpdateFeeModal.isOpen} onClose={resetAllStates} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
        width={"404px"}
      >
        <ModalHeader px={0} pt={0} pb={"16px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"normal"}>
            Edit Request
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={resetAllStates} />
        </Box>
        <ModalBody p={0}>
          <Box
            width={"364px"}
            bg="#15161D"
            px={"16px"}
            py={"16px"}
            borderRadius={"8px"}
          >
            {/** 상위 버튼 */}
            <CTUpdateButton
              activeButton={activeButton}
              setActiveButton={setActiveButton}
            />
            <WrongNetwork style={{ marginTop: "12px" }} />
            {activeButton == UpdateFeeButtonType.Update &&
            ctUpdateFeeModal.txData ? (
              <CTUpdateFeeDetail
                // input 관련 props
                inputValue={inputValue}
                inputWarningCheck={inputWarningCheck}
                onInputChange={handleInputChange}
                onInputFocus={handleInputFocus}
                // input 관련 recommend 관련 props
                recommendCheck={recommendCheck}
                recommendValue={recommendValue?.toString()}
                //새로 고침 props
                onRecommendRefresh={handleRefreshRecommend}
                txData={ctUpdateFeeModal.txData}
              />
            ) : (
              <CTRefundDetail txData={ctUpdateFeeModal.txData} />
            )}
          </Box>
        </ModalBody>
        <ModalFooter p={0} display="block">
          {activeButton == UpdateFeeButtonType.CancelRequest && (
            <Flex
              flexDir={"column"}
              justifyContent={"flex-start"}
              mt={"16px"}
              rowGap={"8px"}
            >
              <Text
                color={isChecked ? "#FFFFFF" : "#A0A3AD"}
                fontWeight={600}
                fontSize={13}
                lineHeight={"20px"}
                letterSpacing={"0.01em"}
              >
                I understand
              </Text>
              <Flex columnGap={"12px"}>
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
                  colorScheme="#A0A3AD"
                  display={"flex"}
                  alignItems={"flex-start"}
                  mt={"3px"}
                ></Checkbox>
                <Text
                  color={isChecked ? "#FFFFFF" : "#A0A3AD"}
                  fontWeight={400}
                  fontSize={12}
                  lineHeight={"20px"}
                >
                  refund may take at least 2~5 minutes <br />
                  (depending on L2 sequencer).
                </Text>
              </Flex>
            </Flex>
          )}
          <Button
            mt={"16px"}
            width="full"
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor:
                activeConfirmButton && connectedToLayer1
                  ? "#007AFF"
                  : "#17181D",
              color:
                activeConfirmButton && connectedToLayer1
                  ? "#FFFFFF"
                  : "#8E8E92",
            }}
            _hover={{}}
            onClick={handleConfirm}
            isDisabled={!activeConfirmButton || !connectedToLayer1}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"normal"}>
              {!connectedToLayer1
                ? "Wrong Network"
                : activeButton == UpdateFeeButtonType.Update
                ? "Update"
                : "Cancel"}
            </Text>
          </Button>
          {activeButton == UpdateFeeButtonType.Update && (
            <Text mt={"16px"} fontSize={13} fontWeight={400}>
              Tip: Updating or canceling requests takes place on L1 <br />
              to avoid race conditions.
            </Text>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
