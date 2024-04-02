import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  HStack,
  Icon,
  Box,
  Flex
} from '@chakra-ui/react';
import { SearchIcon, StarIcon } from '@chakra-ui/icons';

import MobileSearchInput from "@/components/mobile/input/MobileSearchInput"
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
networkStatus,
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
import TokenMobileCard from "@/componenets/mobile/card/TokenMobileCard";

import ETHIcon from "@/assets/tokens/eth_half_rounded.svg";
import TitanIcon from "@/assets/tokens/titan_half_rounded.svg";
import Image from "next/image";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useMobileChainIds from "@/hooks/mobile/useMobileChainIds"
import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { useAccount, useSwitchNetwork } from "wagmi";
import { actionMethodStatus } from "@/recoil/modal/atom";
import useAddLikeStorage from "@/hooks/mobile/useAddLikeStorage";



// 컴포넌트 외부에 sortTokens 함수를 정의
function sortTokens(tokenList: TokenInfo[], order: string[]) {
  const orderedTokens: TokenInfo[] = [];
  const remainingTokens = [...tokenList]; // 원본 목록의 복사본을 생성

  // customOrder에 정의된 순서대로 토큰을 배열
  order.forEach(symbol => {
    const index = remainingTokens.findIndex(token => token.tokenSymbol === symbol);
    if (index > -1) {
      orderedTokens.push(remainingTokens[index]);
      remainingTokens.splice(index, 1); // 배열된 토큰은 제거
    }
  });

  // 남은 토큰들을 원래 순서대로 뒤에 추가
  return orderedTokens.concat(remainingTokens);
}

export default function SelectTokenModal() {
  
  const { isInTokenOpen, isOutTokenOpen, simpleCloseCheck } = useTokenModal();
  const { onCloseTokenModal, setSelectedToken, simpleCloseTokenModal } = useTokenModal();
  
  const [hasTokenBeenAdded, setHasTokenBeenAdded] = useState(false);

  const { likeList, toggleLike } = useAddLikeStorage();

  const { filteredTokenList } = useGetTokenList();
  
  const sortedAndLikedTokenList = useMemo(() => {
    if (filteredTokenList.length === 1 && filteredTokenList[0].isNew) {
      return filteredTokenList;
    }
  
    const customOrder = ['TON', 'WTON', 'ETH', 'WETH', 'USDC', 'USDT', 'TOS', 'DOC', 'AURA', 'LYDA'];
    
    if (filteredTokenList.length === 1 && !customOrder.includes(filteredTokenList[0].tokenSymbol as string)) {
      return [{ ...filteredTokenList[0], isLiked: 'none' }];
    }
  
    let orderedTokens = sortTokens(filteredTokenList, customOrder);
  
    if (likeList.length > 0) {
      const likedTokens = orderedTokens.filter(token => 
        likeList.some(like => like.tokenName === token.tokenName && like.tokenSymbol === token.tokenSymbol)
      ).map(token => ({ ...token, isLiked: 'true'}));
  
      const unlikedTokens = orderedTokens.filter(token => 
        !likeList.some(like => like.tokenName === token.tokenName && like.tokenSymbol === token.tokenSymbol)
      ).map(token => ({ ...token, isLiked: 'false'}));
  
      orderedTokens = [...likedTokens, ...unlikedTokens];
    }

    return orderedTokens;
  }, [filteredTokenList, likeList, hasTokenBeenAdded]);



  //토큰 추가 리랜더링 
  const addNewTokenToList = useCallback(() => {
    setHasTokenBeenAdded(true);
  }, []);

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


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const value = e.target.value;
      setSearchValue(value);
  };

  const network = useConnectedNetwork(); 
  const { mode } = useGetMode();
  const { ethChainId, titanChainId } = useMobileChainIds(network);
  const [networkStatusValue, setNetworkStatusValue] = useRecoilState(networkStatus);

  const isActiveChain = (chainId:any) => [5050, 55004].includes(chainId);
  const { isConnected } = useAccount();
  const { switchNetworkAsync, isError } = useSwitchNetwork();
  const [, setActionMethodStatus] = useRecoilState(actionMethodStatus);


  const calculateChainValues = async (from: Number|undefined, to: Number|undefined) => {
    const inValue: SupportedChainProperties["chainId"] = Number(from);
    const outValue: SupportedChainProperties["chainId"] = Number(to);
    
    const selectedInNetwork = supportedChain.filter((supportedChain) => {
      return supportedChain.chainId === inValue;
    })[0];

    const selectedOutNetwork = supportedChain.filter((supportedChain) => {
      return supportedChain.chainId === outValue;
    })[0];

    if (selectedInNetwork.chainId !== network.connectedChainId) {
      return isConnected
        ? (await switchNetworkAsync?.(selectedInNetwork.chainId),
        setNetworkStatusValue({
            inNetwork: selectedInNetwork,
            outNetwork: selectedOutNetwork,
          }),
          setActionMethodStatus(false))
        : setNetworkStatusValue({
            inNetwork: selectedInNetwork,
            outNetwork: selectedOutNetwork,
          });
    } else if (selectedInNetwork.chainId === network.connectedChainId) {
      setNetworkStatusValue({
        inNetwork: selectedInNetwork,
        outNetwork: selectedOutNetwork,
      });
    }
  };

  
  const changeNetwork = async () => {

    if(
      mode === "Swap" ||
      mode === "Wrap" ||
      mode === "Unwrap" ||
      mode === "ETH-Unwrap" ||
      mode === "ETH-Wrap"
    ){
      await calculateChainValues(network.otherLayerChainInfo?.chainId, network.otherLayerChainInfo?.chainId);

    } else if(mode === "Withdraw" || mode === "Deposit"){        
      await calculateChainValues(networkStatusValue.outNetwork?.chainId, networkStatusValue.inNetwork?.chainId);
    }

  }

  useEffect(() => {
      if (searchValue === "") {
          return setSearchToken(null);
      }
      if (network.connectedChainId) {
          return setSearchToken({ nameOrAdd: searchValue, chainId: network.connectedChainId });
      }
  }, [searchValue])


  const handleClose = () => {
    onCloseTokenModal();
    setSearchValue('');
  };
  
/////////////////////////////////////////////////////////////////////



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

    //좋아요
    const handleStarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      toggleLike(tokenData)

    };


    return (
      <HStack
        spacing={4}
        justifyContent="space-between"
        w="full"
        alignItems="center"
        px={4} 
        _hover={{ bg: "#313442", px: 4, borderRadius: '8px' }} 
        cursor="pointer"
        onClick={() => {
          try {
            //기존 토큰에서 변경이 이루어 졌다면, 0으로 바꿔야함
            const inToken = selectedInToken;
            setSelectedToken(tokenData, true)
            setSearchValue("")
            simpleCloseTokenModal();
            
            if (isInTokenOpen) {
              setIsInputAmount(true);
              
              //추가된 사항
              //소수점 4자리
              const formatNumber = (number: string) => {
                const numericValue = Number(number);
                if (!isNaN(numericValue)) {
                  const factor = Math.pow(10, 4); // 4자리 버림을 위한 계수 10000
                  return (Math.floor(numericValue * factor) / factor).toString();
                } else {
                  console.error("Provided value cannot be converted to a number:", number);
                  return "0";
                }
              };
              
              //modal이 떨어져서 있어 현재 임시로 해놈
              setTokenAmountStatus({
                ...tokenData,
                amount: formatNumber(amount)
              })

              if(tokenData.tokenName != selectedOutToken?.tokenName){
                //만약, 토큰 값이 같은거면, 기존에 입력한 값을 넣는다면, 같지 않다면, 다시 입력하게 한다.
                const isSameToken = tokenData.tokenName === inToken?.tokenName;
                setSelectedInToken({
                  ...tokenData,
                  amountBN: isSameToken ? inToken?.amountBN : null,
                  parsedAmount: isSameToken ? inToken?.parsedAmount : null,
                  tokenAddress: isSameToken ? inToken?.tokenAddress : null,
                })
                onOpenInAmount();

              } else {

                setSelectedInToken({
                  ...tokenData,
                  amountBN: BigInt(0),
                  parsedAmount: "0",
                  tokenAddress: inToken?.tokenAddress || null
                })
              }
              
            }
            
            if (isOutTokenOpen && network.chainName) {
              setIsOutputAmount(true);
              setSelectedOutToken({
                ...tokenData,
                amountBN: inToken?.amountBN || null,
                parsedAmount: inToken?.parsedAmount || null,
                tokenAddress: tokenData.address[network.chainName],
                
              })
              
            }

          } catch (e) {
            console.log("Open Input")
            console.log(e)

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
            <Text fontSize={"16px"} fontWeight={600} noOfLines={1}>{mainLabel}</Text>
            <Text fontSize={"10px"} fontWeight={400} color={"#A0A3AD"} noOfLines={1}>{subLabel}</Text>
          </VStack>
        </HStack>
        <HStack justifyContent="flex-end">
          <Text fontSize={"16px"} fontWeight={600} textAlign="right" pr="2">{Number(amount).toFixed(5)}</Text>
          {tokenData.isLiked !== 'none' && (
            <Box onClick={handleStarClick} >
              <Icon as={StarIcon} color={tokenData.isLiked === 'true' ? '#007AFF' : '#A0A3AD'}/>
            </Box>
          )}
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
              <HStack justifyContent="space-between" px={2} pt={3}>
                <Text fontSize="12" fontWeight="500" color="#A0A3AD">Token</Text>
                <HStack spacing="2">
                  <Flex
                    w={"32px"}
                    h={"32px"}
                    borderRadius={"6px"}
                    justify={"center"}
                    align={"center"}
                    bg={"#17181D"}
                    border={!isActiveChain(network?.connectedChainId) ? "1px solid #007AFF" : ""}
                    cursor={isActiveChain(network?.connectedChainId) ? "pointer" : "default"}
                    onClick={isActiveChain(network?.connectedChainId) ? changeNetwork : undefined}
                  >
                    <Flex w={"20px"} h={"20px"} borderRadius={"0px 6px 0px 6px"}>
                      <Image
                        alt="eth"
                        src={ETHIcon}
                      />
                    </Flex>
                  </Flex>
                  <Flex
                    w={"32px"}
                    h={"32px"}
                    borderRadius={"6px"}
                    justify={"center"}
                    align={"center"}
                    bg={"#17181D"}
                    border={isActiveChain(network?.connectedChainId) ? "1px solid #007AFF" : ""}
                    cursor={!isActiveChain(network?.connectedChainId) ? "pointer" : "default"}
                    onClick={!isActiveChain(network?.connectedChainId) ? changeNetwork : undefined}
                  >
                    <Flex w={"20px"} h={"20px"} borderRadius={"0px 6px 0px 6px"}>
                    <Image
                          alt="titan"
                          src={TitanIcon}
                        />
                    </Flex>
                  </Flex>
                </HStack>
              </HStack>

            <ModalBody 
                py={4} 
                px={0}
                sx={{
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                    display: 'none'
                    },
                    padding: filteredTokenList.length === 1 && filteredTokenList[0].isNew? '40px 66px 86px' : '',
                    
                }}
                maxHeight="calc(70vh - 4rem)"
                
            >
            {filteredTokenList.length === 1 && filteredTokenList[0].isNew
              ? (
                  <Flex
                  direction="column"
                  justify="center"
                  align="center"
                  maxH="calc(100vh - [HeaderHeight]px)"
                  overflowY="scroll" 
                  sx={
                      { 
                    '::-webkit-scrollbar':{
                            display:'none'
                        }
                    }
                  }
                  >
                    <TokenMobileCard
                      tokenInfo={filteredTokenList[0]}
                      isNew={filteredTokenList[0].isNew}
                      onAddToken={addNewTokenToList}
                    />
                  </Flex>
                )
              : <VStack spacing={2}>
                  {sortedAndLikedTokenList?.map((tokenData, index) => (
                    <TokenListItem
                        key={index}
                        tokenData={tokenData}
                    />
                  ))}
                </VStack>
            }
            </ModalBody>
            </ModalContent>
        </Modal>
        <AmountInputModal />
      </>
  );
}