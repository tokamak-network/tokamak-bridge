import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import BgImage from "assets/image/BridgeSwap/selectTokenCardBg.svg";
import BgImageButton from "assets/image/BridgeSwap/selectTokenBg.svg";
import CloseIcon from "assets/icons/close.svg";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
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
import { TokenInfo, supportedTokens } from "types/token/supportedToken";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useTokenModal from "@/hooks/modal/useTokenModal";
import useCircularBuffer from "../../hooks/cards/useCircularBuffer";

enum CardOverlay {
  Middle = 100,
  Seconds = 90,
  Sides = 80,
  SideRight = 70,
  SecondRight = 60,
}

export const CardCarrousel = () => {
  const [currentCard, setCurrentCard] = useState<number>(2);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [supportedTokens2, setSupportedTokens2] = useState([
    ...supportedTokens,
  ]);

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  const { onCloseTokenModal, isInTokenOpen } = useTokenModal();

  const { userTokens } = useUserToken();

  const sideControl = useAnimation();
  const sideRightControl = useAnimation();
  const secondControl = useAnimation();
  const secondRightControl = useAnimation();
  const middleControl = useAnimation();
  const outControl = useAnimation();

  // const circularBuffer = useCircularBuffer<TokenInfo>(5);
  // useEffect(() => {
  //   for (let i = 0; i < 5; i++) {
  //     circularBuffer.write(supportedTokens[i]);
  //   }
  //   console.log("circular buffer", circularBuffer);
  // }, [supportedTokens]);

  // const bufferArray: TokenInfo[] = [];
  // for (const item of circularBuffer) {
  //   bufferArray.push(item);
  // }

  const initCarouselCards: TokenInfo[] = supportedTokens2.slice(0, 5);
  const [carouselCards, setCarouselCards] =
    useState<TokenInfo[]>(initCarouselCards);

  const handlePrev = () => {
    setCarouselCards((prevCards) => {
      const newCarouselCards = [...prevCards];
      const firstElement =
        supportedTokens2[
          (supportedTokens2.length - 1 + newCarouselCards.length - 1) %
            supportedTokens2.length
        ];
      const lastElement = newCarouselCards.pop();
      newCarouselCards.unshift(firstElement);
      newCarouselCards.splice(newCarouselCards.length - 1, 0, lastElement!);
      return newCarouselCards;
    });
    setCurrentCard((prevCard) =>
      prevCard === null || prevCard === 0
        ? carouselCards.length - 1
        : prevCard - 1
    );
  };

  const handleNext = () => {
    setCarouselCards((prevCards) => {
      const newCarouselCards = [...prevCards];
      const firstElement = newCarouselCards.shift();
      const lastElement =
        supportedTokens2[
          (supportedTokens2.length - 1 + newCarouselCards.length + 1) %
            supportedTokens2.length
        ];
      newCarouselCards.push(lastElement!);
      newCarouselCards.splice(1, 0, firstElement!);
      return newCarouselCards;
    });
    setCurrentCard((prevCard) =>
      prevCard === null || prevCard === carouselCards.length - 1
        ? 0
        : prevCard + 1
    );
  };

  const cardProps = (index: number) => {
    const currentIndex = currentCard === null ? 0 : currentCard;
    const indexVal = currentIndex - index;

    const atMiddle = indexVal === 0;
    const atSide = indexVal === 2 || indexVal === -2;
    const atSideRight = indexVal === -2;
    const atSecond = indexVal === 1 || indexVal === -1;
    const atSecondRight = indexVal === -1;
    const atOut = indexVal > 2 || indexVal < -2;

    return {
      position: "relative",
      display: atOut ? "none" : "",
      // transform: `translateX(-${currentIndex * (100 / 5)}%)`,
      transition: atSide
        ? "ease-in 0.5"
        : atSecond
        ? "ease-in 0.5"
        : atMiddle
        ? "ease-in-out 0.5"
        : "all 500ms cubic-bezier(0.42, 0, 0.58, 1)",
      zIndex: atOut
        ? -100
        : atSide
        ? CardOverlay.Sides
        : atSideRight
        ? CardOverlay.SideRight
        : atSecond
        ? CardOverlay.Seconds
        : atSecondRight
        ? CardOverlay.SecondRight
        : CardOverlay.Middle,
      transform:
        atSide && !atSideRight
          ? "rotate(-10deg)"
          : atSideRight
          ? "rotate(10deg)"
          : atSecond && !atSecondRight
          ? "rotate(-5deg)"
          : atSecondRight
          ? "rotate(5deg)"
          : null,
      minWidth: atSide ? "186px" : atSecond ? "225px" : "256px",
      minHeight: atSide ? "242px" : atSecond ? "298px" : "332px",
      left:
        atSide && !atSideRight
          ? "95px"
          : atSideRight
          ? "-85px"
          : atSecond && !atSecondRight
          ? "43px"
          : atSecondRight
          ? "-43px"
          : "0px",
    };
  };

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
      justifyContent={"center"}
      pt={"75px"}
      pl={"165px"}
      pr={"171px"}
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
        m={0}
        borderRadius={100}
        mb={"70px"}
      >
        <Image src={LeftArrow} alt={"LeftArrow"} />
      </Button>
      <Flex
        overflow={"hidden"}
        alignItems={"end"}
        pb={"10px"}
        justifyContent={"center"}
      >
        {carouselCards.map((tokenData, index) => {
          cardProps(index);
          return (
            <motion.div
              // transition={{ ease: "easeInOut", duration: 0.5 }}
              //   @ts-ignore
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
              onClick={() =>
                isInTokenOpen
                  ? setSelectedInToken({ ...tokenData, amountBN: null })
                  : setSelectedOutToken({ ...tokenData, amountBN: null })
              }
              key={index}
            >
              <TokenCard
                w={"100%"}
                h={"100%"}
                tokenInfo={tokenData}
                inNetwork={true}
                hasInput={false}
              />
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
        mb={"70px"}
      >
        <Image src={RightArrow} alt={"RightArrow"} />
      </Button>
    </Flex>
  );
};
