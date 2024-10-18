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
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useState, useEffect, useMemo } from "react";
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
import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
import { ethers } from "ethers";
import { useRecommendFee } from "../../../hooks/useRecommendFee";
import { useWhiteListToken } from "@/staging/hooks/useWhiteListToken";

export default function CTOptionModal() {
  const { mobileView } = useMediaView();

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

  const { inToken } = useInOutTokens();
  const { recommendedCtAmount, recommendedFee } = useRecommendFee({
    tokenAddress: inToken?.tokenAddress ?? "0x",
    totalAmount: Number(inToken?.parsedAmount),
  });

  const [serviceFee, setServiceFee] = useState<string | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const regex = new RegExp(`^\\d*\\.?\\d{0,${inToken?.decimals}}$`);

    if (regex.test(value)) {
      setServiceFee(value);
    }
  };

  const handleConfirm = useHandleConfirm();
  const { onOpenCTConfirmModal } = useCTConfirmModal();
  const { inNetwork, outNetwork } = useInOutNetwork();
  const serviceFeeValue = useMemo(() => {
    if (activeSubButtonValue === ButtonTypeSub.Recommend && recommendedFee) {
      return recommendedFee.toString();
    }

    if (activeSubButtonValue === ButtonTypeSub.Advanced) {
      return serviceFee;
    }
  }, [recommendedFee, serviceFee, activeSubButtonValue]);

  useEffect(() => {
    if (ctOptionModal && recommendedFee !== undefined) {
      setServiceFee(recommendedFee.toString());
    }
  }, [recommendedFee, ctOptionModal]);

  const handleClickConfirm = () => {
    console.log(mobileView);
    if (mobileView) {
      onCloseCTOptionModal();
    }
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
      serviceFeeValue
    ) {
      const ctAmount =
        BigInt(inToken.amountBN.toString()) -
        BigInt(
          ethers.utils.parseUnits(serviceFeeValue, inToken.decimals).toString(),
        );
      return onOpenCTConfirmModal({
        type: ModalType.Trade,
        txData: {
          category: HISTORY_SORT.CROSS_TRADE,
          action: CT_ACTION.REQUEST,
          isCanceled: false,
          status: CT_REQUEST.Request,
          serviceFee: ethers.utils
            .parseUnits(serviceFeeValue, inToken.decimals)
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
          isUpdateFee: false,
        },
      });
    }
  };

  const { connectedChainId } = useConnectedNetwork();
  const [inputWarningCheck, setInputWarningCheck] = useState<WarningType | "">(
    "",
  );

  const serviceFeeIsNotOver = useMemo(() => {
    if (inToken?.parsedAmount) {
      return Number(inToken.parsedAmount) - Number(serviceFee) <= 0;
    }
  }, [inToken?.parsedAmount, serviceFee]);

  const isLessThanRecommendedFee = useMemo(() => {
    if (serviceFee && recommendedFee) {
      return Number(serviceFee) < Number(recommendedFee);
    }
  }, [serviceFee, recommendedFee]);

  useEffect(() => {
    {
      if (serviceFeeIsNotOver)
        return setInputWarningCheck(WarningType.Critical);
      if (isLessThanRecommendedFee)
        return setInputWarningCheck(WarningType.Normal);
      return setInputWarningCheck("");
    }
  }, [serviceFeeIsNotOver, isLessThanRecommendedFee]);

  useEffect(() => {
    if (ctOptionModal) {
      setInputWarningCheck("");
      setActiveSubButtonValue(ButtonTypeSub.Recommend);
    }
  }, [ctOptionModal]);

  const btnDisabled = useMemo(() => {
    if (activeMainButtonValue === ButtonTypeMain.Standard) {
      return false;
    }
    if (activeSubButtonValue === ButtonTypeSub.Recommend) {
      return !recommendedCtAmount || !recommendedFee;
    }

    if (activeSubButtonValue === ButtonTypeSub.Advanced) {
      return (
        serviceFee === "" ||
        serviceFee === undefined ||
        inputWarningCheck === WarningType.Critical
      );
    }
  }, [
    activeMainButtonValue,
    activeSubButtonValue,
    serviceFee,
    inputWarningCheck,
    recommendedCtAmount,
    recommendedFee,
  ]);

  const { isWhiteListToken } = useWhiteListToken();
  // const isSupportedNetworkForCT = useMemo(
  //   () =>
  //     (connectedChainId &&
  //       connectedChainId === SupportedChainId.TITAN_SEPOLIA) ||
  //     connectedChainId === SupportedChainId.TITAN,
  //   [connectedChainId]
  // );
  const isSupportedNetworkForCT = true;

  return (
    <Modal
      isOpen={ctOptionModal}
      onClose={onCloseCTOptionModal}
      motionPreset={mobileView ? "slideInBottom" : "scale"}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        mb={mobileView ? 0 : "auto"}
        alignSelf={mobileView ? "flex-end" : "center"}
        borderRadius={mobileView ? "16px 16px 0 0" : "16px"}
        width={"404px"}
        bg="#1F2128"
        p={mobileView ? "12px 12px 16px 12px" : "20px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text
            fontSize={mobileView ? "16px" : "20px"}
            fontWeight={"500"}
            lineHeight={mobileView ? "24px" : "30px"}
          >
            Withdraw Option
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseCTOptionModal} />
        </Box>
        <ModalBody p={0}>
          {!isSupportedNetworkForCT || !isWhiteListToken ? (
            <CTOptionDisabledDetail />
          ) : activeMainButtonValue === ButtonTypeMain.Standard ? (
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
              recommnededFee={recommendedCtAmount}
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
              recommnededFee={recommendedCtAmount}
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
              backgroundColor: btnDisabled ? "#17181D" : "#007AFF",
              color: btnDisabled ? "#8E8E92" : "#FFFFFF",
            }}
            _hover={{}}
            _active={{}}
            _focus={{}}
            onClick={handleClickConfirm}
            isDisabled={btnDisabled}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
              {"Next"}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
