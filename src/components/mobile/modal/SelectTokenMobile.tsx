import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  IconButton,
  Box,
  VStack,
  Text,
  HStack,
  Icon,
  Button
} from '@chakra-ui/react';
import { SearchIcon, StarIcon, SunIcon } from '@chakra-ui/icons';

import { useRecoilState } from "recoil";
import { useCallback, useEffect, useRef, useState } from "react";
import useTokenModal from "@/hooks/modal/useTokenModal";


import {
  selectedInTokenStatus,
  tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";
import { useRecoilValue } from "recoil";

import Image from "next/image";

export default function SelectTokenMobileModal() {
  const { isInTokenOpen, isOutTokenOpen, onCloseTokenModal } = useTokenModal();
  const { isOpen } = useRecoilValue(tokenModalStatus);

  const TokenButton = ({ tokenLabel }) => {
      return (
        <Button
          size="md" // 버튼 크기 설정
          bg="blackAlpha.500" // 버튼 배경색 설정
          fontWeight="normal"
          _hover={{ bg: "blackAlpha.600" }} // 호버 상태의 배경색 설정
          leftIcon={<Icon as={SunIcon} />} // 이미지 아이콘
          borderRadius="full" 
        >
          {tokenLabel}
        </Button>
      );
    }

    const TokenListItem = ({ icon, mainLabel, subLabel, amount }) => (
      <HStack spacing={4} justifyContent="space-between" w="full" alignItems="center">
        <HStack spacing={2}>
          <Icon as={icon} /> // Use the icon component
          <VStack alignItems="flex-start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" noOfLines={1}>{mainLabel}</Text>
            <Text fontSize="sm" color="gray.500" noOfLines={1}>{subLabel}</Text>
          </VStack>
        </HStack>
        <Text fontSize="md">{amount}</Text>
        <Icon as={StarIcon} />
      </HStack>
    );

  return (
      <Modal
          isOpen={isInTokenOpen || isOutTokenOpen}
          onClose={onCloseTokenModal}
          motionPreset="slideInBottom"
      >
          <ModalOverlay />
          <ModalContent
              position="absolute"
              bottom="0"
              bg="#222225"
              height="70vh"
              overflow="hidden" 
              px={{ base: "16px", md: "24px" }}
              borderRadius={"24px 24px 0px 0px"}
              sx={{
                  marginBottom: '0',
                }}
          >
          <ModalHeader 
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              fontSize="md" // 글자 크기를 조정합니다.
              pl={1}
          >
              Select token
          <ModalCloseButton />
          </ModalHeader>
          <InputGroup>
              <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
              <Input 
                  type="text"
                  placeholder="Search token name or address"
                  border="none" // 테두리를 없앱니다.
                  _focus={{ borderColor: 'none' }} // 포커스 시 테두리를 없앱니다.
                  bg="blackAlpha.500" // 버튼과 동일한 배경색을 적용합니다.
                  color="white" // 입력 텍스트 색상을 설정합니다.
              />
          </InputGroup>
          <HStack mt={4} spacing={2} justifyContent="center">
              <TokenButton tokenLabel="TON" />
              <TokenButton tokenLabel="ETH" />
              <TokenButton tokenLabel="USDC" />
              <TokenButton tokenLabel="USDT" />
          </HStack>

          <ModalBody p={4}
              sx={{
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                  display: 'none' // 스크롤바를 숨깁니다.
                  }
              }}
              maxHeight="calc(70vh - 4rem)"
          >
              <VStack spacing={4}>
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TON" subLabel="Tokamak Network" amount="0.000003" />
                  <TokenListItem icon={SunIcon} mainLabel="TONed" subLabel="Tokamak Network" amount="0.000003" />
              </VStack>
          </ModalBody>
          </ModalContent>
      </Modal>
      
  );
}