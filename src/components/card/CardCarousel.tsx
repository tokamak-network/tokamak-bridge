import { Flex } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Image from "next/image";
import LeftArrow from "assets/icons/tokenCardLeftArrow.svg";
import RightArrow from "assets/icons/tokenCardRightArrow.svg";
import { TokenInfo } from "types/token/supportedToken";
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import CarousellCardComponent from "./CarousellCardComponent";
import { AnimatePresence } from "framer-motion";

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

  const tokenColor = (symbol?: String) => {
    switch (symbol) {
      case "ETH":
        return "#627EEA";
      case "WETH":
        return "#393939";
      case "TON":
        return "#007AFF";
      case "WTON":
        return "#007AFF";
      case "TOS":
        return "#007AFF";
      case "DOC":
        return "#9e9e9e";
      case "AURA":
        return "#CB1000";
      case "LYDA":
        return "#4361EE";
      case "USDC":
        return "#2775CA";
      case "USDT":
        return "#50AF95";
      default:
        return "#9e9e9e";
    }
  };

  const length = newLists.length > 5 ? 5 : newLists.length;

  const generateItems = useCallback(() => {
    return Array.from({ length: length }, (_, i) => {
      let index = currentIndex - Math.floor(length / 2) + i;
      if (index < 0) index += newLists.length;
      if (index >= newLists.length) index %= newLists.length;
      const level = Math.floor(length / 2) - i;

      return (
        <CarousellCardComponent
          tokenData={newLists[index]}
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
      pl={"235px"}
      pr={"235px"}
      pos={"relative"}
    >
      <Flex
        onClick={newLists.length > 1 ? handlePrev : undefined}
        w={"64px"}
        minW={"64px"}
        maxW={"64px"}
        h={"64px"}
        p={0}
        pos={"absolute"}
        left={"135px"}
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
        pos={"absolute"}
        right={"135px"}
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
