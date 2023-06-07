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
  | "isVisible"
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
  const isVisible = index === 0 || index === 6;

  const atEnd = index === 1;
  const atSide = index === 2;
  const atCenter = index === 3;
  const atSideRight = index === 4;
  const atEndRight = index === 5;

  return isVisible
    ? "isVisible"
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

  const carrousellTokenList = useMemo(() => {
    return filterTokenList.slice(0, 6);
  }, [filterTokenList]);

  console.log(carrousellTokenList);

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

  const initCarouselCards: TokenInfo[] = supportedTokens2.slice(0, 5);
  const [carouselCards, setCarouselCards] =
    useState<TokenInfo[]>(initCarouselCards);

  const handlePrev = () => {
    // setCarouselCards((prevCards) => {
    //   const newCarouselCards = [...prevCards];
    //   console.log("prev cards", [...prevCards]);
    //   const firstElement =
    //     supportedTokens2[
    //       (supportedTokens2.length - 1 + newCarouselCards.length - 1) %
    //         supportedTokens2.length
    //     ];
    //   const lastElement = newCarouselCards.pop();
    //   newCarouselCards.unshift(firstElement);
    //   newCarouselCards.splice(newCarouselCards.length - 1, 0, lastElement!);
    //   return newCarouselCards;
    // });
    // setCurrentCard((prevCard) =>
    //   prevCard === null || prevCard === 0
    //     ? carouselCards.length - 1
    //     : prevCard - 1
    // );
  };

  const handleNext = () => {
    // setCarouselCards((prevCards) => {
    //   const newCarouselCards = [...prevCards];
    //   const firstElement = newCarouselCards.shift();
    //   const lastElementIndex =
    //     (supportedTokens2.length - 5 + newCarouselCards.length) %
    //     supportedTokens2.length;
    //   const lastElement = supportedTokens2[lastElementIndex];
    //   newCarouselCards.push(lastElement!);
    //   newCarouselCards.splice(0, 0, firstElement!);
    //   return newCarouselCards;
    // });
    // setCurrentCard((prevCard) => {
    //   if (prevCard === null || prevCard === carouselCards.length - 1) {
    //     return 0;
    //   } else {
    //     return prevCard + 1;
    //   }
    // });
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
      zIndex: CardOverlay.End,
    };
    const basicSideStyle = {
      ...commonStyle,
      width: "204px",
      height: "282px",
      zIndex: CardOverlay.Side,
    };

    switch (location(index)) {
      case "isVisible":
        return { display: "none" };
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

  useEffect(() => {
    // middleControl.start({
    //   width: 256,
    //   height: 332,
    //   rotate: 0,
    // });
    // secondControl.start({
    //   width: 225,
    //   height: 298,
    //   rotate: -5,
    //   fontSize: 30,
    // });
    // secondRightControl.start({
    //   width: 225,
    //   height: 298,
    //   rotate: 5,
    // });
    // sideControl.start({
    //   width: 186,
    //   height: 242,
    //   rotate: -10,
    // });
    // sideRightControl.start({
    //   width: 186,
    //   height: 242,
    //   rotate: 10,
    // });
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
        // overflowX={"hidden"}
        w={"100%"}
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
              <motion.div
                style={{ width: "100%", height: "100%" }}
                transition={{ duration: 1 }}
                initial={{ opacity: 0 }}
                animate={{
                  translateY:
                    locate === "atEnd"
                      ? "-320px"
                      : locate === "atSide"
                      ? "-330px"
                      : locate === "atCenter"
                      ? "-350px"
                      : locate === "atSideRight"
                      ? "-330px"
                      : "-320px",
                  translateX:
                    locate === "atEnd"
                      ? "-250px"
                      : locate === "atSide"
                      ? "-150px"
                      : locate === "atCenter"
                      ? "1px"
                      : locate === "atSideRight"
                      ? "150px"
                      : "250px",
                  opacity: 1,
                }}
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
