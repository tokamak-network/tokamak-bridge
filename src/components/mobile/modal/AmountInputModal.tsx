import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Input,
    Flex,
    Button,
    InputGroup,
    InputRightElement,
    Text
} from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  selectedInTokenStatus,
  tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";
import TokenInput from "@/componenets/input/TokenInput";
import useAmountModal from "@/hooks/modal/useAmountModal";

export default function AmountInputModal() {
    const { isOpen } = useRecoilValue(tokenModalStatus);
    console.log("isOpen=====", isOpen)
    const { isInAmountOpen, isOutAmountOpen, onCloseAmountModal } = useAmountModal();
    const ref = useRef<HTMLInputElement>(null);
    const [selectedInToken] = useRecoilState(selectedInTokenStatus);

    return (
        <>
        <Modal 
            isOpen={isInAmountOpen || isOutAmountOpen}
            onClose={onCloseAmountModal}
            motionPreset="slideInBottom"
        >
            <ModalOverlay />
            <ModalContent mt="30vh" mb="auto" mx="auto" bg="#222225">
              <ModalHeader fontSize="md" py={2}>
                <Text as="span" color="#a0a3ad">
                  Balance:{' '}
                </Text>
                <Text as="span">
                  2000.00 TON
                </Text>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <TokenInput
                inToken={isOpen === "INPUT" ? true : false}
                hasMaxButton={isOpen === "INPUT" ? true : false}
                customRef={ref}
                placeholder={"input amount"}
                isDisabled={isOpen === "INPUT" ? false : true}
                defaultValue={
                  isOpen === "INPUT" ? selectedInToken?.parsedAmount : ""
                }
              />
                {/* <Flex justifyContent="space-between" align="center">
                <InputGroup>
              <Input
                placeholder="Input amount"
                _placeholder={{ color: 'gray.500' }}
                borderColor="#59628d"
                _hover={{ borderColor: "#59628d" }}
                _focus={{ borderColor: "#59628d", boxShadow: "none" }}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" colorScheme="blue">
                  Max
                </Button>
                </InputRightElement>
              </InputGroup>
                </Flex> */}
              </ModalBody>
            </ModalContent>
        </Modal>
      </>
    );
  }