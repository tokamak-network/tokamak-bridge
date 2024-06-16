import React, { useMemo, useState } from "react";
import {
  Modal,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import useSwapConfirm from "@/components/confirmn/hooks/useSwapConfirmModal";
import CloseButton from "@/components/button/CloseButton";

export default function SwapConfirmModal() {
  const { swapConfirmModal, onCloseSwapConfirmModal } = useSwapConfirm();
  return (
    <Modal
      isOpen={swapConfirmModal}
      onClose={onCloseSwapConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Swap
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseSwapConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bg='#0F0F12'
          ></Box>
          <Box
            my={"12px"}
            px={"20px"}
            pt={"16px"}
            borderRadius={"8px"}
            bg='#15161D'
          ></Box>
        </ModalBody>
        <ModalFooter p={0} display='block'></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
