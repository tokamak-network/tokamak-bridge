import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import LeftArrow from "assets/icons/tokenCardLeftArrow.svg";
import RightArrow from "assets/icons/tokenCardRightArrow.svg";
import { TokenInfo } from "types/token/supportedToken";
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import CarousellCardComponent from "./CarousellCardComponent";

export const CardCarrousel = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isHover, setIsHover] = useState<number | null>(null);

  const { filteredTokenList } = useGetTokenList();

  const handlePrev = () => {
    setCurrentIndex(
      currentIndex !== null
        ? currentIndex + 1 === filteredTokenList.length
          ? 0
          : currentIndex + 1
        : 3
    );
  };

  const handleNext = () => {
    setCurrentIndex(
      currentIndex !== null
        ? currentIndex - 1 < 0
          ? filteredTokenList.length - 1
          : currentIndex - 1
        : 1
    );
  };

  return (
    <Flex
      alignItems={"end"}
      w={"100%"}
      justifyContent={"center"}
      pt={"75px"}
      pl={"165px"}
      pr={"171px"}
    >
      <Flex
        onClick={handlePrev}
        // border={"2px solid #17181D"}
        // bgColor={"#0f0f12"}
        w={"64px"}
        minW={"64px"}
        maxW={"64px"}
        h={"64px"}
        _active={{}}
        _hover={{}}
        p={0}
        m={0}
        borderRadius={100}
        mb={"70px"}
        zIndex={10}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
      >
        <Image src={LeftArrow} alt={"LeftArrow"} />
      </Flex>
      <Flex
        // overflowX={"hidden"}
        w={"100%"}
        alignItems={"end"}
        // pb={"10px"}
        justifyContent={"center"}
        h={"332px"}
        pos={"relative"}
      >
        {filteredTokenList?.map((tokenData: TokenInfo, index: number) => {
          // const {
          //   endLeftControl,
          //   endRightControl,
          //   sideLeftControl,
          //   sideRightControl,
          //   centerControl,
          //   outLeftControl,
          //   outRightControl,
          //   waitControl,
          // } = useCarrousellAnimation({ currentIndex, index });

          const startIndex =
            currentIndex !== null
              ? currentIndex - 4 < 0
                ? currentIndex - 4 + filteredTokenList.length
                : currentIndex - 4
              : null;

          const waitCondition =
            filteredTokenList.length < 6
              ? false
              : startIndex === filteredTokenList.length
              ? startIndex - 11 === index ||
                startIndex - 10 === index ||
                startIndex - 9 === index ||
                startIndex - 8 === index ||
                startIndex - 7 === index ||
                startIndex - 6 === index ||
                startIndex - 5 === index ||
                startIndex - 4 === index ||
                startIndex - 3 === index ||
                startIndex - 2 === index ||
                startIndex - 1 === index ||
                startIndex === index
              : startIndex === filteredTokenList.length - 1
              ? startIndex - 11 === index ||
                startIndex - 10 === index ||
                startIndex - 9 === index ||
                startIndex - 8 === index ||
                startIndex - 7 === index ||
                startIndex - 6 === index ||
                startIndex - 5 === index ||
                startIndex - 4 === index ||
                startIndex - 3 === index ||
                startIndex - 2 === index ||
                startIndex - 1 === index ||
                startIndex === index
              : startIndex === filteredTokenList.length - 2
              ? startIndex - 7 === index ||
                startIndex - 6 === index ||
                startIndex - 5 === index ||
                startIndex - 4 === index ||
                startIndex - 3 === index ||
                startIndex - 2 === index ||
                startIndex - 1 === index ||
                startIndex === index
              : (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 1 === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 2 === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 3 === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 4 === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 5 === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 6 === index) ||
                (startIndex !== null &&
                  startIndex !== undefined &&
                  startIndex + 7 === index);

          return (
            <CarousellCardComponent
              tokenData={tokenData}
              currentIndex={currentIndex}
              index={index}
              filteredTokenList={filteredTokenList}
              waitCondition={waitCondition}
              isHover={isHover}
              setIsHover={setIsHover}
              key={`${tokenData.tokenName}_${index}` as string}
            />
          );
        })}
      </Flex>

      <Flex
        onClick={handleNext}
        // border={"2px solid #17181D"}
        // bgColor={"#0f0f12"}
        w={"64px"}
        minW={"64px"}
        maxW={"64px"}
        h={"64px"}
        _active={{}}
        _hover={{}}
        p={0}
        borderRadius={100}
        mb={"70px"}
        zIndex={10}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
      >
        <Image src={RightArrow} alt={"RightArrow"} />
      </Flex>
    </Flex>
  );
};
