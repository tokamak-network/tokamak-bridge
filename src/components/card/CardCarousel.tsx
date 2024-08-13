import { Flex } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import LeftArrow from "assets/icons/tokenCardLeftArrow.svg";
import RightArrow from "assets/icons/tokenCardRightArrow.svg";
import { TokenInfo } from "types/token/supportedToken";
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import CarousellCardComponent from "./CarousellCardComponent";
import { AnimatePresence } from "framer-motion";
import { tokenColor } from "@/utils/carousel/tokenColorCode";
import { useRecoilState } from "recoil";
import { handUiOpenedStatus } from "@/recoil/card/selectCard/handUiOpen";

export const CardCarrousel = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isHover, setIsHover] = useState<number | null>(null);

  const { filteredTokenList } = useGetTokenList();
  let newLists: TokenInfo[] = [...filteredTokenList];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev + 1) % newLists.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev - 1 + newLists.length) % newLists.length);
  };

  const length = newLists.length > 5 ? 5 : newLists.length;

  const [handUiOpened, setHandUiOpened] = useRecoilState(handUiOpenedStatus);

  const requireCall = useMemo(() => {
    if (handUiOpened) return false;
    setHandUiOpened(true);
    return true;
  }, [handUiOpened]);

  const generateItems = useCallback(() => {
    return Array.from({ length: length }, (_, i) => {
      let index = currentIndex - Math.floor(length / 2) + i;
      if (index < 0) index += newLists.length;
      if (index >= newLists.length) index %= newLists.length;
      const level = Math.floor(length / 2) - i;

      return (
        <CarousellCardComponent
          tokenData={newLists[index]}
          requireCall={requireCall}
          isHover={isHover}
          level={level}
          index={i}
          tokenColor={tokenColor(newLists[index].tokenSymbol)}
          setIsHover={setIsHover}
          length={length}
          key={`${newLists[index].tokenName}_${index}` as string}
        />
      );
    });
  }, [currentIndex, newLists]);

  return (
    <Flex
      alignItems={"end"}
      w={"100%"}
      justifyContent={"center"}
      pt={"70px"}
      pl={"165px"}
      pr={"171px"}
      pos={"relative"}
      bg={"transparent"}
    >
      <Flex
        onClick={newLists.length > 1 ? handlePrev : undefined}
        w={"64px"}
        minW={"64px"}
        maxW={"64px"}
        h={"64px"}
        p={0}
        m={0}
        borderRadius={100}
        mb={"40px"}
        zIndex={10}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
      >
        <Image src={LeftArrow} alt={"LeftArrow"} />
      </Flex>

      <Flex
        w={"100%"}
        alignItems={"end"}
        justifyContent={"center"}
        h={"332px"}
        pos={"relative"}
        bg={"transparent"}
      >
        <AnimatePresence>{generateItems()}</AnimatePresence>
      </Flex>

      <Flex
        onClick={newLists.length > 1 ? handleNext : undefined}
        w={"64px"}
        minW={"64px"}
        maxW={"64px"}
        h={"64px"}
        _hover={{}}
        p={0}
        borderRadius={100}
        mb={"40px"}
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
