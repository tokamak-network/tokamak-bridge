import {
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button, Flex } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useState } from "react";
import Image from "next/image";
import LeftArrow from "assets/icons/tokenCardLeftArrow.svg";
import RightArrow from "assets/icons/tokenCardRightArrow.svg";
import { TokenInfo } from "types/token/supportedToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import CarousellCardComponent from "./CarousellCardComponent";

export const CardCarrousel = () => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isHover, setIsHover] = useState<number | null>(null);

  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { onCloseTokenModal, isInTokenOpen } = useTokenModal();
  const { inNetwork } = useRecoilValue(networkStatus);
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
        {/* 시연용 */}
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
              : startIndex === filteredTokenList.length - 1
              ? startIndex - 7 === index ||
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
            />
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
