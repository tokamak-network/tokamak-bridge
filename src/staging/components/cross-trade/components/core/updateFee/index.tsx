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
import {
  formatUnits,
  limitDecimals,
  toParseNumber,
} from "@/utils/trim/convertNumber";
import { useCrossTradeContract } from "@/staging/hooks/useCrossTradeContracts";
import useConnectedNetwork from "@/hooks/network";
import { WrongNetwork } from "../../common/WrongNetwork";
import { BigNumber } from "ethers";
import { useRecommendFee } from "../../../hooks/useRecommendFee";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { isZeroAddress } from "@/utils/contract/isZeroAddress";
import { useAccount } from "wagmi";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { BetaIcon } from "../../common/BetaIcon";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import {
  ATOM_CT_GAS_cancelCT,
  ATOM_CT_GAS_editCT,
} from "@/recoil/crosstrade/networkFee";
import { Hash } from "viem";
import { calculateGasMarginBigInt } from "@/utils/txn/calculateGasMargin";

export default function CTFeeUpdateModal() {
  const { mobileView } = useMediaView();
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
    const regex = /^\d*\.?\d*$/;
    if (regex.test(value)) {
      const valueWithDecimals = limitDecimals(
        value,
        ctUpdateFeeModal.txData?.inToken.decimals
      );

      if (valueWithDecimals !== undefined) {
        setInputValue(valueWithDecimals);
      } else {
        setInputValue(value);
      }
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
    ctUpdateFeeModal.txData?.L2_subgraphData?._l2token &&
    isZeroAddress(ctUpdateFeeModal.txData?.L2_subgraphData?._l2token)
      ? "0x4200000000000000000000000000000000000006"
      : ctUpdateFeeModal.txData?.L2_subgraphData?._l2token ?? "0x";
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
      return inputParsedAmount.gte(totalAmount);
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

  const {
    editFee: _editFee,
    cancelRequest: _cancelRequest,
    L1_CROSSTRADE_PROXY_CONTRACT,
  } = useCrossTradeContract();
  const [, setEditGasUsage] = useRecoilState(ATOM_CT_GAS_editCT);
  const [, setCancelGasUsage] = useRecoilState(ATOM_CT_GAS_cancelCT);

  const editFee = useCallback(
    async (estimateGas?: boolean) => {
      try {
        if (
          ctUpdateFeeModal.txData &&
          ctUpdateFeeModal.txData.L2_subgraphData
        ) {
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

          const estimatedGas =
            await L1_CROSSTRADE_PROXY_CONTRACT.estimateGas.editFee({
              //@ts-ignore
              account: address as Hash,
              args: params,
            });
          const estimatedGasWithBuffer = calculateGasMarginBigInt(estimatedGas);

          if (estimateGas) return setEditGasUsage(estimatedGasWithBuffer);

          _editFee({
            args: params,
            gas: estimatedGasWithBuffer,
          });
          resetAllStates();
        }
      } catch (e) {
        console.log(e);
      }
    },
    [_editFee, ctUpdateFeeModal.txData, inputValue]
  );

  const cancelRequest = useCallback(
    async (estimateGas?: boolean) => {
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

        const estimatedGas =
          await L1_CROSSTRADE_PROXY_CONTRACT.estimateGas.cancel({
            //@ts-ignore
            account: address as Hash,
            args: params,
          });
        const estimatedGasWithBuffer = calculateGasMarginBigInt(estimatedGas);

        if (estimateGas) return setCancelGasUsage(estimatedGasWithBuffer);

        _cancelRequest({
          args: params,
          gas: estimatedGasWithBuffer,
        });
        resetAllStates();
      }
    },
    [ctUpdateFeeModal.txData, _cancelRequest]
  );

  useEffect(() => {
    if (activeButton === UpdateFeeButtonType.Update) editFee(true);
    if (activeButton === UpdateFeeButtonType.CancelRequest) cancelRequest(true);
  }, [editFee, cancelRequest, activeButton]);

  const handleConfirm = useCallback(() => {
    if (activeButton === UpdateFeeButtonType.Update) return editFee();
    if (activeButton === UpdateFeeButtonType.CancelRequest)
      return cancelRequest();
  }, [activeButton, editFee, cancelRequest]);

  const btnIsDisabled = useMemo(() => {
    return (
      !activeConfirmButton ||
      !connectedToLayer1 ||
      inputWarningCheck === WarningType.Critical
    );
  }, [activeConfirmButton, connectedToLayer1, inputWarningCheck]);

  const { address } = useAccount();

  const requester = useMemo(() => {
    return ctUpdateFeeModal.txData?.L2_subgraphData?._requester;
  }, [ctUpdateFeeModal.txData?.L2_subgraphData?._requester]);

  const isRequester = useMemo(() => {
    if (requester && address) {
      return requester.toLowerCase() === address.toLowerCase();
    }
    return false;
  }, [requester, address]);

  useEffect(() => {
    if (!isRequester) {
      resetAllStates();
    }
  }, [isRequester]);
  const { isConnectedToTestNetwork, connectedChainId } = useConnectedNetwork();
  const isNetworkValid = useMemo(() => {
    if (
      ctUpdateFeeModal.txData?.outNetwork &&
      isConnectedToTestNetwork !== undefined
    ) {
      const requiredChainId = ctUpdateFeeModal.txData?.outNetwork;
      const isMainNetwork = requiredChainId === SupportedChainId.MAINNET;
      if (isMainNetwork) return !isConnectedToTestNetwork;
      const isTestNetwork = requiredChainId === SupportedChainId.SEPOLIA;
      if (isTestNetwork) return isConnectedToTestNetwork;
    }
    return true;
  }, [
    isConnectedToTestNetwork,
    ctUpdateFeeModal.txData?.outNetwork,
    connectedChainId,
  ]);

  useEffect(() => {
    if (isNetworkValid) return resetAllStates;
  }, [isNetworkValid]);

  return (
    <Modal
      isOpen={ctUpdateFeeModal.isOpen && isRequester && isNetworkValid}
      onClose={resetAllStates}
      motionPreset={mobileView ? "slideInBottom" : "scale"}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        mb={mobileView ? 0 : "auto"}
        alignSelf={mobileView ? "flex-end" : "center"}
        borderRadius={mobileView ? "16px 16px 0 0" : "16px"}
        bg='#1F2128'
        p={mobileView ? "12px 12px 16px 12px" : "20px"}
        width={mobileView ? "100%" : "404px"}
        {...(mobileView && {
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
        })}
      >
        <ModalHeader px={0} pt={0} pb={"16px"}>
          <Flex columnGap={"8px"}>
            <Text
              fontSize={mobileView ? "16px" : "20px"}
              fontWeight={"500"}
              lineHeight={mobileView ? "24px" : "normal"}
            >
              Edit Request
            </Text>
            <BetaIcon />
          </Flex>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={resetAllStates} />
        </Box>
        <ModalBody p={0}>
          <Box
            width={mobileView ? "100%" : "364px"}
            bg="#15161D"
            px={"16px"}
            py={"16px"}
            borderRadius={"8px"}
          >
            {/** 상위 버튼 */}
            <CTUpdateButton
              activeButton={activeButton}
              setActiveButton={setActiveButton}
              isMobile={mobileView}
            />
            <WrongNetwork style={{ marginTop: "12px" }} />
            {activeButton === UpdateFeeButtonType.Update &&
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
              backgroundColor: !btnIsDisabled ? "#007AFF" : "#17181D",
              color: !btnIsDisabled ? "#FFFFFF" : "#8E8E92",
            }}
            _hover={{}}
            onClick={handleConfirm}
            isDisabled={btnIsDisabled}
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
              Tip: Updating or canceling requests takes place on L1{" "}
              {!mobileView && <br />}
              to avoid race conditions.
            </Text>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
