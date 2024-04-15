import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useConfirm from "@/hooks/modal/useConfirmModal";
import CloseButton from "../button/CloseButton";
import Image from "next/image";
import ARROW_ICON from "assets/icons/confirm/arrow.svg";
import ARROW from "assets/icons/arrow.svg";
import TitanHalfRounded from "assets/tokens/titan_half_rounded.svg";
import ETHHalfRounded from "assets/tokens/eth_half_rounded.svg";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { TokenSymbol } from "../image/TokenSymbol";
import { NetworkSymbol } from "../image/NetworkSymbol";
import { useInOutNetwork } from "@/hooks/network";
import TransactionDetail from "@/app/BridgeSwap/TransactionDetail";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { trimAmount } from "@/utils/trim";
import { convertNetworkName } from "@/utils/network/convertNetworkName";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

import "@/css/spinner.css";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";

const OutTokenContainer = () => {
  const { outToken } = useInOutTokens();
  const { amountOut } = useAmountOut();
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
        columnGap={"8px"}
        h={"24px"}
        mt={"14px"}
        mb={"3px"}
      >
        <Text fontSize={{ base: 17, lg: 18 }} fontWeight={mobileView ? 700 : 600}>
          {trimAmount(amountOut, mobileView ? 8 : 8)}
        </Text>
        <Text fontSize={{ base: 17, lg: 18 }} fontWeight={mobileView ? 500 : 400}>
          {outToken?.tokenSymbol}
        </Text>
      </Flex>

      <Text mt={"4px"} fontSize={14} fontWeight={mobileView ? 500 : 400} color={"#A0A3AD"}>
        ${outTokenWithPrice || "0"}
      </Text>
    </>
  );
};

const OutNetworkContrainer = () => {
  const { outNetwork } = useInOutNetwork();
  const { mobileView } = useMediaView();

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
        {mobileView ? (
          <Image
            alt="titan rounded"
            src={TitanHalfRounded}
            width={40}
            height={40}
          />
        ) : (
          <NetworkSymbol
            network={outNetwork.chainId}
            w={40}
            h={40}
            isCircle={true}
          />
        )}
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
    <Flex
      pos={"relative"}
      justify={"center"}
      columnGap={{ base: "8px", lg: "12px" }}
    >
      <Flex
        pos={"relative"}
        w={{ base: "148px", lg: "176px" }}
        h={{ base: "148px", lg: "168px" }}
        border={"1px solid #313442"}
        borderRadius={"12px"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDir={"column"}
      >
        {mobileView && mode === "Deposit" && (
          <Flex
            pos={"absolute"}
            top={"0px"}
            right={"0px"}
            w={"34px"}
            h={"34px"}
            borderRadius={"0px 9px 0px 9px"}
            bg={"#2E3140"}
            justify={"center"}
            align={"center"}
            zIndex={100}
          >
            <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
              <Image alt="eth" src={mode === "Deposit" ? ETHHalfRounded : ""} />
            </Flex>
          </Flex>
        )}

        {/* <TokenSymbol
          tokenType={inToken?.tokenSymbol ?? "default"}
          w={mobileView ? 48 : 56}
          h={mobileView ? 48 : 56}
        /> */}
        <TokenSymbolWithNetwork
          tokenSymbol={inToken?.tokenSymbol as string ?? "default"}
          chainId={1}
          symbolW={56}
          symbolH={56}
          networkSymbolH={20}
          networkSymbolW={20}
        />
        <Flex
          fontSize={18}
          columnGap={"8px"}
          h={"24px"}
          mt={"14px"}
          mb={"3px"}
        >
          <Text fontSize={{ base: 17, lg: 18 }} fontWeight={mobileView ? 700 : 600}>
            {trimAmount(inToken?.parsedAmount, mobileView ? 8 : 8)}
          </Text>
          <Text fontSize={{ base: 17, lg: 18 }} fontWeight={mobileView ? 500 : 400}>
            {inToken?.tokenSymbol}
          </Text>
        </Flex>

        <Text mt={"4px"} fontSize={14} fontWeight={mobileView ? 500 : 400} color={"#A0A3AD"}>
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
        w={{ base: "148px", lg: "176px" }}
        h={{ base: "148px", lg: "168px" }}
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
  const { mobileView } = useMediaView();

  return (
    <Modal isOpen={isOpen} onClose={onCloseConfirmModal} size={"xl"} isCentered>
      <ModalOverlay opacity={0.1} />
      <ModalContent
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        mb={{ base: 0, lg: "auto" }}
      >
        <Flex
          w={{ base: "full", lg: "404px" }}
          p={{ base: "16px 12px", lg: "20px" }}
          bgColor={"#1f2128"}
          borderRadius={{ base: "16px 16px 0px 0px", lg: "16px" }}
          flexDir={"column"}
          flexDirection={"column"}
          rowGap={"16px"}
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
