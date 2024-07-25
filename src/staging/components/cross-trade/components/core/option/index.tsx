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
import { useState, useEffect, useCallback } from "react";
import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import CloseButton from "@/components/button/CloseButton";
import {
  WarningType,
  ButtonTypeMain,
  ButtonTypeSub,
  ModalType,
} from "@/staging/components/cross-trade/types";
import { useHandleConfirm } from "@/staging/components/new-confirm/hooks/useDepositWithdrawHandleConfirm";
import {
  Action,
  CT_ACTION,
  CT_REQUEST,
  HISTORY_SORT,
  Status,
} from "@/staging/types/transaction";
import CTOptionCrossDetail from "./CTOptionCrossDetail";
import CTOptionStandardDetail from "./CTOptionStandardDetail";
import CTOptionDisabledDetail from "./CTOptionDisabledDetail";
import useCTConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useInOutNetwork } from "@/hooks/network";
import { ethers } from "ethers";

export default function CTOptionModal() {
  const { ctOptionModal, onCloseCTOptionModal } = useFxOptionModal();

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
  const [serviceFee, setServiceFee] = useState<string | undefined>(undefined);
  const [inputWarningCheck, setInputWarningCheck] = useState<WarningType | "">(
    ""
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // if (/^[123\s]*$/.test(value)) {
    setServiceFee(value);
    // }
  };

  // input이 변경될 때, 값이 있으면 rightElement를 보여준다.
  // 현재 1일때 red warning, 2일때, yellow warning
  useEffect(() => {
    switch (serviceFee) {
      case "1":
        setInputWarningCheck(WarningType.Critical);
        break;
      case "2":
        setInputWarningCheck(WarningType.Normal);
        break;
      default:
        setInputWarningCheck("");
    }
  }, [serviceFee]);

  console.log("serviceFee", serviceFee);
  console.log("inputWarningCheck", inputWarningCheck);

  const shouldShowEnterAmount =
    activeMainButtonValue === ButtonTypeMain.Cross ||
    (activeSubButtonValue === ButtonTypeSub.Advanced &&
      (serviceFee === "" ||
        serviceFee === undefined ||
        inputWarningCheck === WarningType.Critical));

  const handleConfirm = useHandleConfirm();
  const { onOpenCTConfirmModal } = useCTConfirmModal();
  const { inToken } = useInOutTokens();
  const { inNetwork, outNetwork } = useInOutNetwork();
  const handleClickConfirm = () => {
    if (activeMainButtonValue === ButtonTypeMain.Standard) {
      return handleConfirm(Action.Withdraw, Status.Initiate);
    }
    if (
      activeMainButtonValue === ButtonTypeMain.Cross &&
      inToken &&
      inNetwork &&
      outNetwork &&
      inToken.amountBN &&
      inToken.address[outNetwork.chainName] !== null &&
      serviceFee
    ) {
      const ctAmount =
        BigInt(inToken.amountBN.toString()) -
        BigInt(
          ethers.utils.parseUnits(serviceFee, inToken.decimals).toString()
        );
      return onOpenCTConfirmModal({
        type: ModalType.Trade,
        txData: {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.REQUEST,
          isCanceled: false,
          status: CT_REQUEST.Request,
          serviceFee: ethers.utils
            .parseUnits(serviceFee, inToken.decimals)
            .toBigInt(),
          blockTimestamps: {
            request: 0,
          },
          inNetwork: inNetwork.chainId,
          outNetwork: outNetwork.chainId,
          inToken: {
            address: inToken.tokenAddress,
            name: inToken.tokenName as string,
            symbol: inToken.tokenSymbol as string,
            amount: inToken.amountBN?.toString() as string,
            decimals: inToken.decimals,
          },
          outToken: {
            address: inToken.address[outNetwork.chainName] as string,
            name: inToken.tokenName as string,
            symbol: inToken.tokenSymbol as string,
            amount: ctAmount.toString(),
            decimals: inToken.decimals,
          },
          transactionHashes: {
            request: "",
          },
        },
      });
    }
  };

  useEffect(() => {
    if (ctOptionModal) {
      setServiceFee(undefined);
      setInputWarningCheck("");
      setActiveSubButtonValue(ButtonTypeSub.Recommend);
    }
  }, [ctOptionModal]);

  return (
    <Modal isOpen={ctOptionModal} onClose={onCloseCTOptionModal} isCentered>
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg="#1F2128"
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
          {activeMainButtonValue === ButtonTypeMain.Standard ? (
            // <CTOptionDisabledDetail />
            <CTOptionCrossDetail
              // cross, official 관련 props
              activeMainButtonValue={activeMainButtonValue}
              handleButtonMainClick={handleButtonMainClick}
              // recommend, Advanced button 관련 props
              activeSubButtonValue={activeSubButtonValue}
              handleButtonSubClick={handleButtonSubClick}
              // input 관련 props
              inputValue={serviceFee ?? ""}
              inputWarningCheck={inputWarningCheck}
              onInputChange={handleInputChange}
            />
          ) : (
            <CTOptionCrossDetail
              // cross, official 관련 props
              activeMainButtonValue={activeMainButtonValue}
              handleButtonMainClick={handleButtonMainClick}
              // recommend, Advanced button 관련 props
              activeSubButtonValue={activeSubButtonValue}
              handleButtonSubClick={handleButtonSubClick}
              // input 관련 props
              inputValue={serviceFee ?? ""}
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
        <ModalFooter p={0} display="block">
          <Button
            mt={"12px"}
            width="full"
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: shouldShowEnterAmount ? "#17181D" : "#007AFF",
              color: shouldShowEnterAmount ? "#8E8E92" : "#FFFFFF",
            }}
            _hover={{}}
            _active={{}}
            _focus={{}}
            onClick={handleClickConfirm}
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
