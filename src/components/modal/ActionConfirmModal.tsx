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

import ARROW from "assets/icons/arrow.svg";
import ARROW_ICON from "assets/icons/confirm/arrow.svg";
import TitanHalfRounded from "assets/tokens/titan_half_rounded.svg";
import ETHHalfRounded from "assets/tokens/eth_half_rounded.svg";
import Ethereum from "assets/icons/network/Ethereum_no_border.svg";
import ArrowDown from "assets/icons/arrow_down.svg";
import Titan from "assets/icons/network/Titan_no_border.svg";
import ETH from "assets/tokens/eth.svg";

import "@/css/spinner.css";
import commafy from "@/utils/trim/commafy";
import usePriceImpact from "@/hooks/swap/usePriceImpact";

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
        <Text fontSize={{ base: 17, lg: 18 }}>
          {trimAmount(amountOut, mobileView ? 6 : 8)}
        </Text>
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
            {trimAmount(inToken?.parsedAmount, mobileView ? 6 : 8)}
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

const NewTokenContainer = () => {
  const { inToken, outToken } = useInOutTokens();
  const { amountOut } = useSwapTokens();
  const { inNetwork, outNetwork } = useInOutNetwork();

  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount?.replaceAll(",", "")),
  });

  const { tokenPriceWithAmount: outTokenWithPrice } = useGetMarketPrice({
    tokenName: outToken?.tokenName as string,
    amount: Number(amountOut),
  });

  return (
    <Box pos={"relative"}>
      <Flex
        justify={"space-between"}
        align={"center"}
        p={"6px 12px"}
        border={"1px solid #313442"}
        borderBottom={"none"}
        bgColor={"#0F0F12"}
        rounded={"8px 8px 0px 0px"}
      >
        <Flex columnGap={2} align={"center"}>
          <TokenSymbol
            tokenType={inToken?.tokenSymbol ?? "default"}
            w={24}
            h={24}
          />
          <Flex flexDir={"column"} justify={"space-between"}>
            <Text textColor={"#A0A3AD"} fontSize={12}>
              {inToken?.tokenSymbol}
            </Text>
            <Flex align={"center"}>
              <Text fontSize={16} fontWeight={600}>
                {trimAmount(inToken?.parsedAmount, 8)}
              </Text>
              <Text ml={"6px"} fontSize={12} fontWeight={400} color={"#A0A3AD"}>
                ${inTokenWithPrice || "0"}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify={"space-between"} align={"center"} columnGap={"6px"}>
          <NetworkSymbol network={inNetwork?.chainId} w={24} h={24} />
        </Flex>
      </Flex>

      <Flex
        bgColor={"#0F0F12"}
        border={"1px solid #313442"}
        pos={"absolute"}
        w={6}
        h={6}
        left={"calc(50% - 12px)"}
        top={"calc(50% - 12px)"}
        justify={"center"}
        align={"center"}
        rounded={"4px"}
        zIndex={1}
      >
        <Image alt="arrow down" src={ArrowDown} width={16} height={16} />
      </Flex>

      <Flex
        justify={"space-between"}
        align={"center"}
        p={"6px 12px"}
        border={"1px solid #313442"}
        bgColor={"#0F0F12"}
        rounded={"0px 0px 8px 8px"}
      >
        <Flex columnGap={2} align={"center"}>
          <TokenSymbol
            tokenType={outToken?.tokenSymbol ?? "default"}
            w={24}
            h={24}
          />
          <Flex flexDir={"column"} justify={"space-between"}>
            <Text textColor={"#A0A3AD"} fontSize={12}>
              {outToken?.tokenSymbol}
            </Text>
            <Flex align={"center"}>
              <Text fontSize={16} fontWeight={600}>
                {trimAmount(outToken?.parsedAmount, 8)}
              </Text>
              <Text ml={"6px"} fontSize={12} fontWeight={400} color={"#A0A3AD"}>
                ${outTokenWithPrice || "0"}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Flex justify={"space-between"} align={"center"} columnGap={"6px"}>
          <NetworkSymbol network={outNetwork?.chainId} w={24} h={24} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default function ActionConfirmModal() {
  const { mode } = useGetMode();
  const { isOpen, onCloseConfirmModal } = useConfirm();
  const { onClick } = useCallBridgeSwapAction();
  const isWithdrawConfirmed = useRecoilValue(confirmWithdrawStatus);
  const { mobileView } = useMediaView();
  const { inToken, outToken } = useInOutTokens();
  const { outPrice } = usePriceImpact();

  const isWrapUnwrap =
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Wrap" ||
    mode === "ETH-Unwrap";

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
            {!mobileView && (
              <Box pos={"absolute"} right={0} top={"-6px"}>
                <CloseButton onClick={onCloseConfirmModal} />
              </Box>
            )}
          </Flex>
          {/* <TokenContainer /> */}
          <NewTokenContainer />
          <Box pl={"7px"}>
            <Text fontSize={14} fontWeight={400} mb={"5px"}>{`1 ${
              inToken?.tokenSymbol
            } = ${isWrapUnwrap ? 1 : commafy(outPrice, 4)} ${
              outToken?.tokenSymbol
            }`}</Text>
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
