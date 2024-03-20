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

import MobileSearchInput from "@/components/mobile/input/mobileSearchInput"
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

import {
  selectedTokenAmountStatus
} from "@/recoil/mobile/atom"

import useConnectedNetwork from "@/hooks/network";

import {
  mobileTokenModalStatus
} from "@/recoil/mobile/atom";

import {
  searchTokenStatus,
  IsSearchToken,
} from "@/recoil/card/selectCard/searchToken";

export default function SelectTokenModal() {
  const { isInTokenOpen, isOutTokenOpen, simpleCloseCheck } = useTokenModal();
  const { onCloseTokenModal, setSelectedToken, simpleCloseTokenModal } = useTokenModal();
  const { filteredTokenList } = useGetTokenList();
  const { onOpenInAmount, onOpenOutAmount } = useAmountModal();
  const [isInputAmount, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const [isOutputAmount, setIsOutputAmount] = useRecoilState(isOutputTokenAmount);
  
  const [, setTokenAmountStatus] = useRecoilState(selectedTokenAmountStatus);
  
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const [mobileTokenOpen, setMobileTokenOpen] = useRecoilState(mobileTokenModalStatus);

  /////////////// 검색관련
  const [, setSearchToken] = useRecoilState(searchTokenStatus);
  const [searchValue, setSearchValue] = useState<string>("");
  const { connectedChainId } = useConnectedNetwork();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      setSearchValue(value);
  };

  useEffect(() => {
      if (searchValue === "") {
          return setSearchToken(null);
      }
      if (connectedChainId) {
          return setSearchToken({ nameOrAdd: searchValue, chainId: connectedChainId });
      }
  }, [searchValue])


  const handleClose = () => {
    onCloseTokenModal();
    setSearchValue('');
  };
  
///////////////////


  const { chainName } = useConnectedNetwork();

  type TokenButtonProps = {
    tokenLabel: string;
  };

  type TokenListItemProps = {
    tokenData: TokenInfo;
  };

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
            setSearchValue("")
            
            //추가된 사항
            setTokenAmountStatus({
              ...tokenData,
              amount
            })
            simpleCloseTokenModal();
            //

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
            isOpen={(isInTokenOpen || isOutTokenOpen) && mobileTokenOpen}
            onClose={handleClose}
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
            <MobileSearchInput
              searchValue={searchValue} onChange={onChange}            
            />

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