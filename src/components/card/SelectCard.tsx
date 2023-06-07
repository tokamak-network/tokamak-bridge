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

import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/react";
import TokenCard from "./TokenCard";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import LeftArrow from "assets/icons/tokenCardLeftArrow.svg";
import RightArrow from "assets/icons/tokenCardRightArrow.svg";
import { motion, useAnimation } from "framer-motion";
import { supportedTokens } from "types/token/supportedToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { Field } from "@/types/swap/swap";
import { CardCarrousel } from "./CardCarousel";
import {
  searchTokenList,
  searchTokenSelector,
  searchTokenStatus,
} from "@/recoil/card/selectCard/searchToken";
import useConnectedNetwork from "@/hooks/network";

enum CardOverlay {
  Middle = 100,
  Seconds = 90,
  Sides = 80,
}

export function SelectCardButton(props: { field: Field }) {
  const { field } = props;
  const { onOpenInToken, onOpenOutToken } = useTokenModal();
  return (
    <Flex
      w={"562px"}
      h={"100px"}
      alignItems={"center"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={() => (field === "INPUT" ? onOpenInToken() : onOpenOutToken())}
      pos={"relative"}
      // zIndex={Overlay_Index}
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
        mt={"10px"}
      >
        Select Token
      </Text>
    </Flex>
  );
}

const SearchToken = () => {
  const { onCloseTokenModal } = useTokenModal();
  const [searchToken, setSearchToken] = useRecoilState(searchTokenStatus);

  const { connectedChainId } = useConnectedNetwork();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      return setSearchToken(null);
    }
    if (connectedChainId) {
      return setSearchToken({ nameOrAdd: value, chainId: connectedChainId });
    }
  };

  return (
    <Flex w={"100%"} justifyContent={"center"} pos={"relative"}>
      <Input
        w={"430px"}
        h={"42px"}
        borderRadius={"21.5px"}
        placeholder={"Search token name or address"}
        border={{}}
        bgColor={"#0F0F12"}
        _focus={{}}
        _active={{}}
        onChange={onChange}
      ></Input>
      <Box pos={"absolute"} right={"69px"}>
        <Image
          src={CloseIcon}
          alt={"close"}
          style={{ cursor: "pointer" }}
          onClick={() => onCloseTokenModal()}
        />
      </Box>
    </Flex>
  );
};

export function SelectCardModal() {
  const { isInTokenOpen, isOutTokenOpen, onCloseTokenModal } = useTokenModal();

  return (
    <Modal
      isOpen={isInTokenOpen || isOutTokenOpen}
      // isOpen={false}
      onClose={useTokenModal}
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
              <Image
                src={BgImage}
                alt={"CloseIcon"}
                style={{
                  minWidth: "1362px",
                  width: "1362px",
                  minHeight: "486px",
                  height: "486px",
                }}
              ></Image>
            </Flex>
            <CardCarrousel />
            <SearchToken />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
