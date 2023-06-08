import {
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
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
  AnimatePresence,
  motion,
  useAnimate,
  useAnimation,
  useAnimationControls,
} from "framer-motion";
import {
  SupportedTokens_T,
  TokenInfo,
  supportedTokens,
} from "types/token/supportedToken";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useTokenModal from "@/hooks/modal/useTokenModal";
import {
  searchTokenList,
  searchTokenSelector,
  searchTokenStatus,
} from "@/recoil/card/selectCard/searchToken";
import useConnectedNetwork from "@/hooks/network";

type LocationType =
  | "isVisibleAtLeft"
  | "isVisibleAtRight"
  | "atEnd"
  | "atSide"
  | "atCenter"
  | "atSideRight"
  | "atEndRight";

enum CardOverlay {
  Center = 100,
  Side = 80,
  End = 60,
}

const location = (index: number): LocationType => {
  const isVisibleAtLeft = index === 0;
  const isVisibleAtRight = index === 6;

  const atEnd = index === 1;
  const atSide = index === 2;
  const atCenter = index === 3;
  const atSideRight = index === 4;
  const atEndRight = index === 5;

  return isVisibleAtLeft
    ? "isVisibleAtLeft"
    : isVisibleAtRight
    ? "isVisibleAtRight"
    : atSideRight
    ? "atSideRight"
    : atEndRight
    ? "atEndRight"
    : atCenter
    ? "atCenter"
    : atSide
    ? "atSide"
    : "atEnd";
};

export const CardCarrousel = () => {
  const [currentCard, setCurrentCard] = useState<number>(2);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const tokenList = useRecoilValue(searchTokenList);
  const searchedTokenName = useRecoilValue(searchTokenStatus);
  const tokenSelector = useRecoilValue(searchTokenSelector);
  const { chainName } = useConnectedNetwork();

  const filterTokenList = useMemo(() => {
    if (tokenSelector && chainName) {
      return tokenList.filter(
        (token) => token.address[chainName] === tokenSelector.address[chainName]
      );
    }
    if (searchedTokenName?.nameOrAdd) {
      return tokenList.filter((token) => {
        return token.tokenName
          .toLocaleLowerCase()
          .includes(searchedTokenName.nameOrAdd.toLocaleLowerCase());
      });
    }
    return tokenList;
  }, [tokenList, tokenSelector, searchedTokenName]);

  // const carrousellTokenList = useMemo(() => {
  //   return filterTokenList.slice(currentCard - 2, currentCard + 6);
  // }, [filterTokenList, currentCard]);

  const carrousellTokenList = filterTokenList;

  const [supportedTokens2, setSupportedTokens2] = useState<SupportedTokens_T>([
    ...supportedTokens,
  ]);

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { onCloseTokenModal, isInTokenOpen } = useTokenModal();

  const sideControl = useAnimation();
  const sideRightControl = useAnimation();
  const secondControl = useAnimation();
  const secondRightControl = useAnimation();
  const middleControl = useAnimation();
  const outControl = useAnimation();

  const { inNetwork } = useRecoilValue(networkStatus);

  const [test, setTest] = useState(false);

  const handlePrev = () => {
    setTest(true);
    setCurrentCard(currentCard - 1);
  };

  const handleNext = () => {
    setTest(false);
    setCurrentCard(currentCard + 1);
  };

  const cardStyleProps = (index: number) => {
    const commonStyle = {
      position: "absolute",
      top: "350px",
    };
    const basicEndStyle = {
      ...commonStyle,
      width: "186px",
      height: "242px",
      maxWidth: "186px",
      maxHeight: "242px",
    };
    const basicSideStyle = {
      ...commonStyle,
      width: "204px",
      height: "282px",
    };

    switch (location(index)) {
      // case "isVisible":
      //   return { display: "none" };
      case "atEnd":
        return {
          ...basicEndStyle,
          transform: "rotate(-10deg)",
        };
      case "atSide":
        return {
          ...basicSideStyle,
          transform: "rotate(-5deg)",
        };
      case "atCenter":
        return {
          ...commonStyle,
          width: "256px",
          height: "332px",
          zIndex: CardOverlay.Center,
        };
      case "atSideRight":
        return {
          ...basicSideStyle,
          zIndex: 90,
          transform: "rotate(5deg)",
        };
      case "atEndRight":
        return {
          ...basicEndStyle,
          zIndex: 80,
          transform: "rotate(10deg)",
        };
      default:
        return {};
    }
  };

  // const cardProps = (index: number) => {
  //   const currentIndex = currentCard === null ? 0 : currentCard;
  //   const indexVal = currentIndex - index;

  //   const atMiddle = indexVal === 0;
  //   const atSide = indexVal === 2 || indexVal === -2;
  //   const atSideRight = indexVal === -2;
  //   const atSecond = indexVal === 1 || indexVal === -1;
  //   const atSecondRight = indexVal === -1;
  //   const atOut = indexVal > 2 || indexVal < -2;

  //   return {
  //     position: "relative",
  //     display: atOut ? "none" : "",
  //     transition: "margin .2s ease-in-out",
  //     _hover: { mt: "-2" },
  //     zIndex: atOut
  //       ? -100
  //       : atSide
  //       ? CardOverlay.Sides
  //       : atSideRight
  //       ? CardOverlay.SideRight
  //       : atSecond
  //       ? CardOverlay.Seconds
  //       : atSecondRight
  //       ? CardOverlay.SecondRight
  //       : CardOverlay.Middle,
  //     transform:
  //       atSide && !atSideRight
  //         ? "rotate(-10deg)"
  //         : atSideRight
  //         ? "rotate(10deg)"
  //         : atSecond && !atSecondRight
  //         ? "rotate(-5deg)"
  //         : atSecondRight
  //         ? "rotate(5deg)"
  //         : null,
  //     minWidth: atSide ? "186px" : atSecond ? "225px" : "256px",
  //     minHeight: atSide ? "242px" : atSecond ? "298px" : "332px",
  //     left:
  //       atSide && !atSideRight
  //         ? "95px"
  //         : atSideRight
  //         ? "-85px"
  //         : atSecond && !atSecondRight
  //         ? "43px"
  //         : atSecondRight
  //         ? "-43px"
  //         : "0px",
  //   };
  // };

  const [initialized, setInisialized] = useState<boolean>(false);

  useEffect(() => {
    middleControl.start({
      translateY: "-350px",
      translateX: "1px",
      opacity: 1,
      zIndex: CardOverlay.Center,
    });
    secondControl.start({
      translateY: "-330px",
      translateX: "-150px",
      opacity: 1,
      zIndex: CardOverlay.Side,
    });
    secondRightControl.start({
      translateY: "-330px",
      translateX: "150px",
      opacity: 1,
      zIndex: CardOverlay.Side,
    });
    sideControl.start({
      translateY: "-320px",
      translateX: "-250px",
      opacity: 1,
      zIndex: CardOverlay.End,
    });
    sideRightControl.start({
      translateY: "-320px",
      translateX: "250px",
      opacity: 1,
      zIndex: CardOverlay.End,
    });
    outControl.start({
      rotate: -25,
      translateY: "500px",
      translateX: "-500px",
      opacity: 1,
      width: "186px",
      height: "242px",
    });
    setInisialized(true);
  }, []);

  console.log(currentCard);

  useEffect(() => {
    console.log(initialized);

    if (initialized === false) {
      return;
    }

    if (currentCard === 0) {
      middleControl.start({
        rotate: -10,
        translateY: "-272px",
        translateX: "-265px",
        width: "186px",
        height: "242px",
        opacity: 1,
      });
    }
    if (currentCard === 1) {
      middleControl.start({
        rotate: -5,
        translateY: "-315px",
        translateX: "-151px",
        width: "204px",
        height: "282px",
        zIndex: CardOverlay.Side,
        opacity: 1,
      });
      // secondControl.start({
      //   translateY: "-330px",
      //   translateX: "-150px",
      //   opacity: 1,
      //   zIndex: CardOverlay.Side,
      //   width: "204px",
      //   height: "282px",
      //   minWidth: "204px",
      //   maxWidth: "204px",
      //   rotate: -5,
      // });
      // secondRightControl.start({
      //   translateY: "-330px",
      //   translateX: "150px",
      //   opacity: 1,
      //   zIndex: CardOverlay.Side,
      //   width: "204px",
      //   height: "282px",
      // });
      // sideControl.start({
      //   translateY: "-320px",
      //   translateX: "-250px",
      //   opacity: 1,
      //   zIndex: CardOverlay.End,
      // });
      // sideRightControl.start({
      //   translateY: "-320px",
      //   translateX: "250px",
      //   opacity: 1,
      //   zIndex: CardOverlay.End,
      // });
      // outControl.start({
      //   rotate: -25,
      //   translateY: "500px",
      //   translateX: "-500px",
      //   opacity: 1,
      //   width: "186px",
      //   height: "242px",
      // });
    }
    if (currentCard === 2) {
      middleControl.start({
        rotate: 0,
        translateY: "-350px",
        translateX: "1px",
        opacity: 1,
        width: "254px",
        height: "332px",
        zIndex: CardOverlay.Center,
      });
      secondControl.start({
        translateY: "-330px",
        translateX: "-150px",
        opacity: 1,
        zIndex: CardOverlay.Side,
        width: "204px",
        height: "282px",
        minWidth: "204px",
        maxWidth: "204px",
        rotate: -5,
      });
      secondRightControl.start({
        translateY: "-330px",
        translateX: "150px",
        opacity: 1,
        zIndex: CardOverlay.Side,
        width: "204px",
        height: "282px",
      });
      sideControl.start({
        translateY: "-320px",
        translateX: "-250px",
        opacity: 1,
        zIndex: CardOverlay.End,
      });
      sideRightControl.start({
        translateY: "-320px",
        translateX: "250px",
        opacity: 1,
        zIndex: CardOverlay.End,
      });
      outControl.start({
        rotate: -25,
        translateY: "500px",
        translateX: "-500px",
        opacity: 1,
        width: "186px",
        height: "242px",
      });
    }
    if (currentCard === 3) {
      sideControl.start({
        rotate: 5,
        translateY: "-341px",
        translateX: "-133px",
        opacity: 1,
        zIndex: CardOverlay.Side,
        width: "204px",
        height: "282px",
        minWidth: "204px",
        maxWidth: "204px",
      });
      secondControl.start({
        rotate: 5,
        translateY: "-350px",
        translateX: "0px",
        width: "256px",
        height: "332px",
        minWidth: "256px",
        maxWidth: "256px",
        zIndex: CardOverlay.Center,
        opacity: 1,
      });
      middleControl.start({
        rotate: 5,
        translateY: "-315px",
        translateX: "205px",
        width: "204px",
        height: "282px",
        zIndex: CardOverlay.Side,
        opacity: 1,
      });
      secondRightControl.start({
        rotate: 5,
        translateY: "-296px",
        translateX: "284px",
        width: "186px",
        height: "242px",
        opacity: 1,
      });
      sideRightControl.start({
        rotate: 25,
        translateY: "0px",
        translateX: "1000px",
        opacity: 0,
      });
      outControl.start({
        rotate: -10,
        translateY: "-12px",
        translateX: "-235px",
        opacity: 1,
        zIndex: CardOverlay.End,
      });
    }
    if (currentCard === 4) {
      secondControl.start({
        rotate: 10,
        translateY: "-300px",
        translateX: "205px",
        width: "204px",
        height: "282px",
        minWidth: "204px",
        maxWidth: "204px",
        zIndex: CardOverlay.Center,
        opacity: 1,
      });
      middleControl.start({
        rotate: 10,
        translateY: "-272px",
        translateX: "336px",
        width: "186px",
        height: "242px",
        opacity: 1,
      });
      secondRightControl.start({
        rotate: 25,
        translateY: "0px",
        translateX: "1000px",
        opacity: 0,
        width: "186px",
        height: "242px",
      });
    }
    if (currentCard === 5) {
      secondControl.start({
        rotate: 15,
        translateY: "-245px",
        translateX: "336px",
        width: "186px",
        height: "242px",
        minWidth: "186px",
        maxWidth: "186px",
        zIndex: CardOverlay.Center,
      });
      middleControl.start({
        rotate: 25,
        translateY: "0px",
        translateX: "1000px",
        opacity: 0,
        width: "186px",
        height: "242px",
      });
    }
    // return () => {
    //   setInisialized(false);
    // };
  }, [currentCard]);

  console.log("--carrousellTokenList--");
  console.log(carrousellTokenList);

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
        // overflowX={"hidden"}
        w={"1300px"}
        alignItems={"end"}
        // pb={"10px"}
        justifyContent={"center"}
        h={"332px"}
        pos={"relative"}
      >
        {carrousellTokenList.map((tokenData, index) => {
          const locate = location(index);
          return (
            //@ts-ignore
            <Flex style={cardStyleProps(index)}>
              <AnimatePresence initial={true} custom={test}>
                <motion.div
                  className={"motion-div"}
                  style={{ width: "100%", height: "100%" }}
                  transition={{ duration: 0.5 }}
                  initial={{ opacity: 0 }}
                  animate={
                    locate === "isVisibleAtLeft"
                      ? outControl
                      : locate === "atEndRight"
                      ? sideRightControl
                      : locate === "atSideRight"
                      ? secondRightControl
                      : locate === "atCenter"
                      ? middleControl
                      : locate === "atSide"
                      ? secondControl
                      : sideControl
                  }
                  exit={{ opacity: 0 }}
                  onClick={() =>
                    isInTokenOpen
                      ? setSelectedInToken({
                          ...tokenData,
                          amountBN: null,
                          parsedAmount: null,
                        })
                      : setSelectedOutToken({
                          ...tokenData,
                          amountBN: null,
                          parsedAmount: null,
                        })
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
              </AnimatePresence>
            </Flex>
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
