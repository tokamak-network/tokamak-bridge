import { InTokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import BgImage from "assets/image/BridgeSwap/selectTokenBg.svg";

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
      bgColor={"#17181D"}
      alignItems={"center"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={() => setInTokenModal({ isOpen: true, modalData: null })}
    >
      <Text color={"#FFFFFF"} fontSize={24} fontWeight={"semibold"}>
        Select Token
      </Text>
    </Flex>
  );
}

const CardCarrousel = () => {
  const [currentCard, setCurrentCard] = useState<number | null>(null);
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

  console.log(currentCard);

  const tempData = [
    {
      tokenName: "TOKEN1",
    },
    {
      tokenName: "TOKEN2",
    },
    {
      tokenName: "TOKEN3",
    },
    {
      tokenName: "TOKEN4",
    },
    {
      tokenName: "TOKEN5",
    },
    {
      tokenName: "TOKEN6",
    },
    {
      tokenName: "TOKEN7",
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
        {tempData.map((data, index) => {
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
            >
              <TokenCard w={"100%"} h={"100%"} tokenName={String(index)} />
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
    ></Input>
  );
};

export function SelectCardModal() {
  const [inTokenModal, setInTokenModal] = useRecoilState(InTokenModalStatus);
  const onClose = () => {
    setInTokenModal({ isOpen: false, modalData: null });
  };

  return (
    <Modal isOpen={inTokenModal.isOpen} onClose={onClose}>
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
