import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import "@/css/spinner.css";
import CloseButton from "../button/CloseButton";
import { useEffect, useState } from "react";
import { ATOM_positions_loading } from "@/recoil/pool/positions";

export default function LoadingModal() {
  const isLoading = useRecoilValue(ATOM_positions_loading);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeThisModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(isLoading);
  }, [isLoading]);

  return (
    <Modal isOpen={isOpen} onClose={closeThisModal}>
      <ModalOverlay />
      <ModalContent
        h={"100%"}
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
      >
        <Flex
          w={"254px"}
          bgColor={"#1f2128"}
          borderRadius={"16px"}
          flexDir={"column"}
          alignItems={"center"}
        >
          <Flex w={"100%"} justifyContent={"flex-end"} pt={"14px"} pr={"14px"}>
            <CloseButton onClick={closeThisModal} />
          </Flex>
          <Text mt={"26px"} fontSize={18} mb={"41px"}>
            Liquidity Data Loading
          </Text>
          <Flex pos={"relative"} w={"100%"} justifyContent={"center"}>
            <Box w={"96px"} h={"96px"} className="loading2 spinner2"></Box>
          </Flex>

          <Text
            mt={"46px"}
            textAlign={"center"}
            fontSize={14}
            fontWeight={500}
            pb={"36px"}
          >
            Loading Uniswap v3 liquidity from Titan & Ethereum Networks.
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
