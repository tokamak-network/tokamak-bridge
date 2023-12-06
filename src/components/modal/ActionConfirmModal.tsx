import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import "@/css/spinner.css";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useConfirm from "@/hooks/modal/useConfirmModal";
import CloseButton from "../button/CloseButton";
import Image from "next/image";
import ARROW_ICON from "assets/icons/confirm/arrow.svg";
import ARROW from "assets/icons/arrow.svg";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { TokenSymbol } from "../image/TokenSymbol";
import { NetworkSymbol } from "../image/NetworkSymbol";
import { useInOutNetwork } from "@/hooks/network";
import TransactionDetail from "@/app/BridgeSwap/TransactionDetail";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";
import { useSwapTokens } from "@/hooks/swap/useSwapTokens";
import { trimAmount } from "@/utils/trim";
import { convertNetworkName } from "@/utils/network/convertNetworkName";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

const OutTokenContainer = () => {
  const { outToken } = useInOutTokens();
  const { amountOut } = useSwapTokens();
  const { mobileView } = useMediaView();
  
  const { tokenPriceWithAmount: outTokenWithPrice } = useGetMarketPrice({
    tokenName: outToken?.tokenName as string,
    amount: Number(amountOut),
  });

  return (
    <>
      <TokenSymbol
        tokenType={outToken?.tokenSymbol ?? "default"}
        w={mobileView ? 48 : 56}
        h={mobileView ? 48 : 56}
      />
      <Flex
        fontSize={18}
        fontWeight={600}
        columnGap={"8px"}
        h={"24px"}
        mt={"14px"}
        mb={"3px"}
      >
        <Text fontSize={{ base: 17, lg: 18 }}>{trimAmount(amountOut, 8)}</Text>
        <Text fontSize={{ base: 17, lg: 18 }} fontWeight={400}>
          {outToken?.tokenSymbol}
        </Text>
      </Flex>
      
      <Text mt={"4px"} fontSize={14} fontWeight={400} color={"#A0A3AD"}>
        ${outTokenWithPrice || "0"}
      </Text>
    </>
  );
};

const OutNetworkContrainer = () => {
  const { outNetwork } = useInOutNetwork();

  if (outNetwork) {
    return (
      <Flex
        w={"100%"}
        h={"100%"}
        bg={"#0F0F12"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
        rowGap={"14px"}
        pt={"10px"}
        borderRadius={"12px"}
      >
        <NetworkSymbol
          network={outNetwork.chainId}
          w={40}
          h={40}
          isCircle={true}
        />
        <Text fontSize={16} fontWeight={400}>
          {convertNetworkName(outNetwork.chainName)}
        </Text>
      </Flex>
    );
  }
  return null;
};

const TokenContainer = () => {
  const { mode } = useGetMode();
  const { inToken } = useInOutTokens();
  const { mobileView } = useMediaView();
  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  return (
    <Flex pos={"relative"} columnGap={{ base: "8px", lg: "12px" }}>
      <Flex
        w={{ base: "full", lg: "176px" }}
        h={"168px"}
        border={"1px solid #313442"}
        borderRadius={"12px"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
      >
        <TokenSymbol
          tokenType={inToken?.tokenSymbol ?? "default"}
          w={mobileView ? 48 : 56}
          h={mobileView ? 48 : 56}
        />
        <Flex
          fontSize={18}
          fontWeight={600}
          columnGap={"8px"}
          h={"24px"}
          mt={"14px"}
          mb={"3px"}
        >
          <Text fontSize={{ base: 17, lg: 18 }}>
            {trimAmount(inToken?.parsedAmount, 8)}
          </Text>
          <Text fontSize={{ base: 17, lg: 18 }} fontWeight={400}>
            {inToken?.tokenSymbol}
          </Text>
        </Flex>

        <Text mt={"4px"} fontSize={14} fontWeight={400} color={"#A0A3AD"}>
          ${inTokenWithPrice || "0"}
        </Text>
      </Flex>

      {!mobileView && (
        <Box pos={"absolute"} left={"45.5%"} top={"40%"}>
          <Image src={ARROW_ICON} alt={"ARROW_ICON"} />
        </Box>
      )}

      {mobileView && <Image width={24} height={24} src={ARROW} alt={"ARROW"} />}

      <Flex
        w={{ base: "full", lg: "176px" }}
        h={"168px"}
        border={"1px solid #313442"}
        borderRadius={"12px"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
      >
        {(mode === "Deposit" || mode === "Withdraw") && (
          <OutNetworkContrainer />
        )}
        {mode === "Swap" && <OutTokenContainer />}
      </Flex>
    </Flex>
  );
};

export default function ActionConfirmModal() {
  const { mode } = useGetMode();
  const { isOpen, onCloseConfirmModal } = useConfirm();
  const { onClick } = useCallBridgeSwapAction();
  const isWithdrawConfirmed = useRecoilValue(confirmWithdrawStatus);

  return (
    <Modal isOpen={isOpen} onClose={onCloseConfirmModal}>
      <ModalOverlay opacity={0.1} />
      <ModalContent
        h={"100%"}
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
      >
        <Flex
          w={{ base: "full", lg: "404px" }}
          p={{ base: "16px 12px", lg: "20px" }}
          bgColor={"#1f2128"}
          borderRadius={{ base: "16px 16px 0px 0px", lg: "16px" }}
          flexDir={"column"}
          flexDirection={"column"}
          rowGap={"16px"}
          mt={{ base: "auto", lg: "0" }}
        >
          <Flex justifyContent={"space-between"} pos={"relative"}>
            <Text fontSize={{ base: 16, lg: 20 }} fontWeight={500}>
              Confirm {mode}
            </Text>
            <Box pos={"absolute"} right={0} top={"-6px"}>
              <CloseButton onClick={onCloseConfirmModal} />
            </Box>
          </Flex>
          <TokenContainer />
          <Box mt={"16px"}>
            <TransactionDetail isOnConfirm={true} isMobile />
          </Box>
          <Button
            w={"100%"}
            h={"48px"}
            fontSize={16}
            fontWeight={600}
            _active={{}}
            _hover={{}}
            bgColor={"#007AFF"}
            color={"#fff"}
            onClick={onClick}
            isDisabled={mode === "Withdraw" ? !isWithdrawConfirmed : false}
            _disabled={{
              color: "#8E8E92",
              bgColor: "#17181D",
            }}
          >
            Confirm {mode}
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
