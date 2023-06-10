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
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import {
  getTokenCardStyle,
  location,
  useCarrousellAnimation,
} from "@/hooks/tokenCard/useCarrousellAnimation";

export const CardCarrousel = () => {
  const [currentCard, setCurrentCard] = useState<number>(2);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { onCloseTokenModal, isInTokenOpen } = useTokenModal();

  // const [scope, animate] = useAnimate();

  // useEffect(() => {
  //   const animation = async () => {
  //     console.log(scope);
  //     await animate(scope.current, { x: "100px" });
  //     animate("li", { opacity: 1 });
  //   };

  //   animation();
  // }, []);

  const { inNetwork } = useRecoilValue(networkStatus);

  const handlePrev = () => {
    setCurrentCard(currentCard - 1);
  };

  const handleNext = () => {
    setCurrentCard(currentCard + 1);
  };

  const { filterTokenList } = useGetTokenList();
  const {
    endLeftControl,
    endRightControl,
    sideLeftControl,
    sideRightControl,
    centerControl,
    outLeftControl,
    outRightControl,
    waitControl,
  } = useCarrousellAnimation({ currentCard });

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
        {filterTokenList.map((tokenData: any, index: number) => {
          return (
            <motion.div
              key={`${index}_${tokenData.tokenName}`}
              className={"motion-div"}
              style={getTokenCardStyle(index, filterTokenList.length - 1)}
              transition={{ duration: 0.5 }}
              initial={{ opacity: 0 }}
              animate={
                index > 5 && index === currentCard + 2
                  ? waitControl
                  : filterTokenList.length === 1
                  ? centerControl
                  : index === 0
                  ? endLeftControl
                  : index === 1
                  ? sideLeftControl
                  : index === 2
                  ? centerControl
                  : index === 3
                  ? sideRightControl
                  : index === 4
                  ? endRightControl
                  : index === 5
                  ? outRightControl
                  : index === filterTokenList.length - 1
                  ? outLeftControl
                  : undefined
                // index === filterTokenList.length - 2
                // ? waitControl
                // : undefined
              }
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
