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
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import {
selectedInTokenStatus,
tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";

import {
selectedTokenAmountStatus
} from "@/recoil/mobile/atom"
import Image from "next/image";

import TokenInput from "@/components/mobile/input/MobileTokenInput";
import useAmountModal from "@/hooks/modal/useAmountModal";
import { useMediaQuery } from "@chakra-ui/react";
import { useWarning } from '@/hooks/mobile/useMobileWarning';
import { isDesktop, isAndroid, isIOS } from 'react-device-detect';

export default function AmountInputModal() {
  const { isOpen } = useRecoilValue(tokenModalStatus);
  const { isInAmountOpen, isOutAmountOpen, onCloseAmountModal } = useAmountModal();
  const [selectedInToken] = useRecoilState(selectedInTokenStatus);
  const [tokenAmountStatus, ] = useRecoilState(selectedTokenAmountStatus);
  // 키보드 높이와 측정 여부를 상태로 관리합니다.
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const warning = useWarning();

  useEffect(() => {
    if(isLargerThan768) return;

    const handleResize = () => {

      if (window.visualViewport) {
        const newKeyboardHeight = Math.max(window.innerHeight - window.visualViewport.height, 0);

        // AND
        if(isAndroid){
          setKeyboardHeight(0);
        }
        //Desktop
        else if(isDesktop || newKeyboardHeight == 0){
          setKeyboardHeight(550);
        
        // IOS
        } 
        else if(isIOS) {
          setKeyboardHeight(newKeyboardHeight);
        }

        else {
          setKeyboardHeight(550);
        }
      }

    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };

  }, []);
  
  return (
      <>
      <Modal 
          isOpen={isInAmountOpen || isOutAmountOpen}
          onClose={onCloseAmountModal}
          motionPreset="slideInBottom"
      >
          <ModalOverlay />
          <ModalContent
            mt="auto" 
            mb={!isLargerThan768 ? `${keyboardHeight}px` : "550px"}
            mx="auto" 
            bg="#222225" 
            borderRadius="24px 24px 0 0"
          >
        <ModalHeader fontSize="md" pt={2} pb={0}>
          {warning ? (
            <Flex color={warning.type === "error" ? "#DD3A44" : "#F9C03E"} fontWeight={400} fontSize={12} columnGap={"10px"}>
              <Text>{warning.message}</Text>
            </Flex>
          ) : (
            <>
              <Text as="span" fontWeight={500} fontSize={15} color="#a0a3ad">Balance:{' '}</Text>
              <Text as="span" fontWeight={500} fontSize={15} color="#FFFFFF">{`${tokenAmountStatus?.amount} ${tokenAmountStatus?.tokenSymbol}`}</Text>
            </>
          )}
        </ModalHeader>
            <ModalCloseButton pb={"2"}/>
            <ModalBody>
            <TokenInput
              inToken={isOpen === "INPUT" ? true : false}
              hasMaxButton={isOpen === "INPUT" ? true : false}
              placeholder={"input amount"}
              defaultValue={
                isOpen === "INPUT" ? selectedInToken?.parsedAmount : ""
              }
            />
            </ModalBody>
          </ModalContent>
      </Modal>
    </>
  );
}