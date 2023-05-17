import {
  InTokenModalStatus,
  SelectedInTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import BgImage from "assets/image/BridgeSwap/selectTokenCardBg.svg";
import BgImageButton from "assets/image/BridgeSwap/selectTokenBg.svg";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import TokenCard from "./TokenCard";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import LeftArrow from "assets/icons/tokenCardLeftArrow.svg";
import RightArrow from "assets/icons/tokenCardRightArrow.svg";
import {
  motion,
  useAnimate,
  useAnimation,
  useAnimationControls,
} from "framer-motion";
import useUserToken from "@/hooks/user/useUserToken";
import { TokenInfo } from "@/types/token/supportedToken";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useCustomModal from "@/hooks/modal/useCustomModal";

enum CardOverlay {
  Middle = 100,
  Seconds = 90,
  Sides = 80,
}

export function SelectCardButton() {
  const [inTokenModal, setInTokenModal] = useRecoilState(InTokenModalStatus);
  return (
    <Flex
      w={"562px"}
      h={"100px"}
      alignItems={"center"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={() => setInTokenModal({ isOpen: true, modalData: null })}
      pos={"relative"}
    >
      <Image
        src={BgImageButton}
        alt={"BgImageButton"}
        style={{ position: "absolute" }}
      />
      <Text
        color={"#FFFFFF"}
        fontSize={24}
        fontWeight={"semibold"}
        zIndex={100}
      >
        Select Token
      </Text>
    </Flex>
  );
}

const CardCarrousel = () => {
  const [currentCard, setCurrentCard] = useState<number | null>(null);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    SelectedInTokenStatus
  );
  const { onCloseInToken } = useCustomModal();

  const { userTokens } = useUserToken();

  const sideControl = useAnimation();
  const sideRightControl = useAnimation();
  const secondControl = useAnimation();
  const secondRightControl = useAnimation();
  const middleControl = useAnimation();
  const outControl = useAnimation();

  const handlePrev = () => {
    setCurrentCard((prevCard) => (prevCard === null ? 1 : prevCard - 1));
  };

  const handleNext = () => {
    setCurrentCard((prevCard) => (prevCard === null ? 3 : prevCard + 1));
  };

  const cardProps = (index: number) =>
    useMemo(() => {
      const currentIndex = currentCard === null ? 2 : currentCard;
      const indexVal = currentIndex - index;
      const atOut = indexVal > 2 || indexVal < -2;
      const atSide = indexVal === 2 || indexVal === -2;
      const atSideRight = indexVal === -2;
      const atSecond = indexVal === 1 || indexVal === -1;
      const atSecondRight = indexVal === -1;
      const atMiddle = indexVal === 0;

      return {
        position: "relative",
        display: atOut ? "none" : "",
        zIndex: atOut
          ? -100
          : atSide
          ? CardOverlay.Sides
          : atSecond
          ? CardOverlay.Seconds
          : CardOverlay.Middle,
        transform:
          atSide && !atSideRight
            ? `rotate(-10deg)`
            : atSideRight
            ? `rotate(10deg)`
            : atSecond && !atSecondRight
            ? `rotate(-5deg)`
            : atSecondRight
            ? `rotate(5deg)`
            : null,
        minWidth: atSide ? "186px" : atSecond ? "225px" : "256px",
        minHeight: atSide ? "242px" : atSecond ? "298px" : "332px",
        left:
          atSide && !atSideRight
            ? "85px"
            : atSideRight
            ? "-85px"
            : atSecond && !atSecondRight
            ? "43px"
            : atSecondRight
            ? "-43px"
            : "0px",
      };
    }, [currentCard, index]);

  const tempData: TokenInfo[] = [
    {
      tokenName: "ETH",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "TON",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "WTON",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "TOS",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "USDC",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "AURA",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "LYDA",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
    {
      tokenName: "TOKEN",
      address: "0x00",
      chainId: SupportedChainId.GOERLI,
    },
  ];

  useEffect(() => {
    middleControl.start({
      width: 256,
      height: 332,
      rotate: 0,
    });
    secondControl.start({
      width: 225,
      height: 298,
      rotate: -5,
      fontSize: 30,
    });
    secondRightControl.start({
      width: 225,
      height: 298,
      rotate: 5,
    });
    sideControl.start({
      width: 186,
      height: 242,
      rotate: -10,
    });
    sideRightControl.start({
      width: 186,
      height: 242,
      rotate: 10,
    });
  }, [currentCard]);

  return (
    <Flex
      alignItems={"end"}
      w={"100%"}
      // h={"332px"}
      justifyContent={"center"}
      pt={"75px"}
    >
      <Button
        onClick={handlePrev}
        border={"2px solid #17181D"}
        bgColor={"#0f0f12"}
        w={"32px"}
        h={"32px"}
        _active={{}}
        _hover={{}}
        p={0}
        borderRadius={100}
      >
        <Image src={LeftArrow} alt={"LeftArrow"} />
      </Button>
      <Flex overflow={"hidden"} alignItems={"end"} pb={"10px"}>
        {tempData.map((tokenData, index) => {
          return (
            <motion.div
              transition={{ duration: 0.5 }}
              //@ts-ignore
              style={cardProps(index)}
              animate={
                currentCard === null
                  ? undefined
                  : currentCard - index === 0
                  ? middleControl
                  : currentCard - index === 1
                  ? secondControl
                  : currentCard - index === -1
                  ? secondRightControl
                  : currentCard - index === 2
                  ? sideControl
                  : currentCard - index === -2
                  ? sideRightControl
                  : outControl
              }
              onClick={() => setSelectedInToken(tokenData)}
              key={tokenData.tokenName.toUpperCase()}
            >
              <TokenCard w={"100%"} h={"100%"} tokenInfo={tokenData} />
            </motion.div>
          );
        })}
      </Flex>
      <Button
        onClick={handleNext}
        border={"2px solid #17181D"}
        bgColor={"#0f0f12"}
        w={"32px"}
        h={"32px"}
        _active={{}}
        _hover={{}}
        p={0}
        borderRadius={100}
      >
        <Image src={RightArrow} alt={"RightArrow"} />
      </Button>
      <Button onClick={() => onCloseInToken()}>close</Button>
    </Flex>
  );
};

const SearchToken = () => {
  return (
    <Input
      w={"430px"}
      h={"42px"}
      borderRadius={"21.5px"}
      placeholder={"Search token name or address"}
      border={{}}
      bgColor={"#0F0F12"}
      _focus={{}}
      _active={{}}
    ></Input>
  );
};

export function SelectCardModal() {
  const { isInTokenOpen, onCloseInToken } = useCustomModal();

  return (
    <Modal
      isOpen={isInTokenOpen}
      // isOpen={false}
      onClose={onCloseInToken}
    >
      <ModalOverlay />
      <ModalContent
        minW={"100%"}
        maxW={"100%"}
        h={"100%"}
        m={0}
        p={0}
        bg={"transparent"}
      >
        <ModalBody
          minW={"100%"}
          maxW={"100%"}
          h={"100px"}
          m={0}
          p={0}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"end"}
          bg={"transparent"}
          // onClick={onClose}
        >
          <Flex
            w={"1362px"}
            h={"486px"}
            // bgColor={"#1F2128"}
            // borderRadius={"150px 150px 0px 0px"}
            rowGap={"17.43px"}
            flexDir={"column"}
            alignItems={"center"}
            backgroundImage={BgImage}
          >
            <Flex pos={"absolute"}>
              <Image src={BgImage} alt={"CloseIcon"}></Image>
            </Flex>
            <CardCarrousel />
            <SearchToken />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
