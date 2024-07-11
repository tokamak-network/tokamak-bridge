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
import { SupportedChainId } from "@/types/network/supportedNetwork";

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

  const handleConfirm = useHandleConfirm();
  const { onOpenCTConfirmModal } = useCTConfirmModal();

  const handleClickConfirm = () => {
    if (activeMainButtonValue === ButtonTypeMain.Standard) {
      return handleConfirm(Action.Withdraw, Status.Initiate);
    }
    if (activeMainButtonValue === ButtonTypeMain.Cross) {
      return onOpenCTConfirmModal({
        type: ModalType.Trade,
        txData: {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.REQUEST,
          isCanceled: false,
          status: CT_REQUEST.Request,
          blockTimestamps: {
            request: 0,
          },
          inNetwork: SupportedChainId.TITAN,
          outNetwork: SupportedChainId.MAINNET,
          inToken: {
            address: "0x",
            name: "ETH",
            symbol: "ETH",
            amount: "000000000000",
            decimals: 0,
          },
          outToken: {
            address: "0x",
            name: "ETH",
            symbol: "ETH",
            amount: "000000000000",
            decimals: 0,
          },
          transactionHashes: {
            request: "",
          },
        },
      });
    }
  };

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
              inputValue={inputValue}
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
