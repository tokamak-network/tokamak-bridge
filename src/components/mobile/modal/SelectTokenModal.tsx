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
  VStack,
  Text,
  HStack,
  Icon,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';

import { useCallback, useEffect, useRef, useState } from "react";
import useTokenModal from "@/hooks/modal/useTokenModal";
import useAmountModal from "@/hooks/modal/useAmountModal"
import { useGetTokenList } from "@/hooks/tokenCard/useGetTokenList";
import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { TokenInfo } from "types/token/supportedToken";
import { TokenSymbol } from "@/componenets/image/TokenSymbol";
import AmountInputModal from "@/components/mobile/modal/AmountInputModal";
import { useRecoilState } from "recoil";
import {
isInputTokenAmount,
isOutputTokenAmount
} from "@/recoil/card/selectCard/searchToken";
import {
selectedInTokenStatus,
selectedOutTokenStatus,
tokenModalStatus,
} from "@/recoil/bridgeSwap/atom";

import useConnectedNetwork from "@/hooks/network";


export default function SelectTokenModal() {
  const { isInTokenOpen, isOutTokenOpen } = useTokenModal();
  const { onCloseTokenModal, setSelectedToken } = useTokenModal();
  const { filteredTokenList } = useGetTokenList();
  const { onOpenInAmount, onOpenOutAmount } = useAmountModal();
  const [isInputAmount, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const [isOutputAmount, setIsOutputAmount] = useRecoilState(isOutputTokenAmount);
  
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { chainName } = useConnectedNetwork();

  type TokenButtonProps = {
    tokenLabel: string;
  };

  type TokenListItemProps = {
    tokenData: TokenInfo;
  };

  const TokenButton = ({ tokenLabel }: TokenButtonProps) => {
      return (
        <Button
          size="md"
          bg="blackAlpha.500"
          fontWeight="normal"
          _hover={{ bg: "blackAlpha.600" }}
          leftIcon={<TokenSymbol
            w={20}
            h={20}
            tokenType={tokenLabel}
          />}
          borderRadius="full" 
        >
          {tokenLabel}
        </Button>
      );
    }

    const TokenListItem = ({ tokenData } : TokenListItemProps) => { 
      const tokeninfo = useTokenBalance(tokenData);
      let displayTokenName = tokenData.tokenName;
      if (tokenData.tokenName === "ETH") {
          displayTokenName = "Ethereum";
      }
      if (tokenData.tokenName === "WETH") {
        displayTokenName = "Wrapped Ethereum";
      }
      let mainLabel = tokenData.tokenSymbol
      let subLabel = displayTokenName
      let amount = tokeninfo?.data.balanceBN.formatted || "0.0";

      return (
        <HStack
          spacing={4}
          justifyContent="space-between" 
          w="full" 
          alignItems="center" 
          px={4} 
          _hover={{ bg: "#313442", px: 4 }} 
          cursor="pointer"
          onClick={() => {
            try {
              const inToken = selectedInToken;
              setSelectedToken(tokenData, true)

              if (isInTokenOpen) {
                setIsInputAmount(true);
                setSelectedInToken({
                  ...tokenData,
                  amountBN: inToken?.amountBN || null,
                  parsedAmount: inToken?.parsedAmount || null,
                  tokenAddress: inToken?.tokenAddress || null,
                })
                onOpenInAmount();
              }

              if (isOutTokenOpen && chainName) {
                setIsOutputAmount(true);
                setSelectedOutToken({
                  ...tokenData,
                  amountBN: inToken?.amountBN || null,
                  parsedAmount: inToken?.parsedAmount || null,
                  tokenAddress: tokenData.address[chainName],
                  
                })
                onOpenOutAmount();

              }

            } catch (e) {
              console.log("Open Input")

            } finally {
              
            }
          }}
        >
        <HStack spacing={2}>
          <TokenSymbol
            w={36}
            h={36}
            tokenType={mainLabel}
          />
          <VStack alignItems="flex-start" spacing={0}>
            <Text fontSize="lg" fontWeight="bold" noOfLines={1}>{mainLabel}</Text>
            <Text fontSize="sm" color="gray.500" noOfLines={1}>{subLabel}</Text>
          </VStack>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text fontSize="lg" textAlign="right" pr="2">{Number(amount).toFixed(5)}</Text>
          <Icon as={StarIcon} />
        </HStack>
      </HStack>
    )};
  return (
      <>
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
                fontSize="md"
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
                    border="none"
                    _focus={{ borderColor: 'none' }}
                    bg="blackAlpha.500"
                    color="white"
                />
            </InputGroup>
            <HStack mt={4} spacing={2} justifyContent="center">
                <TokenButton tokenLabel="TON" />
                <TokenButton tokenLabel="ETH" />
                <TokenButton tokenLabel="USDC" />
                <TokenButton tokenLabel="USDT" />
            </HStack>

            <ModalBody py={4} px={0}
                sx={{
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                    display: 'none'
                    }
                }}
                maxHeight="calc(70vh - 4rem)"
            >
                <VStack spacing={2}>
                  {filteredTokenList?.map((tokenData: TokenInfo, index: number) => {
                        return (
                            <TokenListItem
                                key={index}
                                tokenData={tokenData}
                            />
                        );
                    })}
                </VStack>
            </ModalBody>
            </ModalContent>
        </Modal>
        <AmountInputModal />
      </>
  );
}