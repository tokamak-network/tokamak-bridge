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



export default function SelectTokenModal() {
  
  const { isInTokenOpen, isOutTokenOpen, simpleCloseCheck } = useTokenModal();
  const { onCloseTokenModal, setSelectedToken, simpleCloseTokenModal } = useTokenModal();
  
  const [hasTokenBeenAdded, setHasTokenBeenAdded] = useState(false);

  const { likeList, toggleLike } = useAddLikeStorage();

  const { filteredTokenList } = useGetTokenList();
  

// Mobile token reordering function
const sortTokens = (tokenList: TokenInfo[], order: string[]) => {
  const orderedTokens: TokenInfo[] = [];
  const remainingTokens = [...tokenList];

  order.forEach(symbol => {
    const index = remainingTokens.findIndex(token => token.tokenSymbol === symbol);
    if (index > -1) {
      orderedTokens.push(remainingTokens[index]);
      remainingTokens.splice(index, 1);
    }
  });

  return orderedTokens.concat(remainingTokens);
}

  const sortedAndLikedTokenList = useMemo(() => {
    if (filteredTokenList.length === 1 && filteredTokenList[0].isNew) {
      return filteredTokenList;
    }
  
    const customOrder = ['TON', 'WTON', 'ETH', 'WETH', 'USDC', 'USDT', 'TOS', 'DOC', 'AURA', 'LYDA'];
    
    if (filteredTokenList.length === 1 && !customOrder.includes(filteredTokenList[0].tokenSymbol as string)) {
      return [{ ...filteredTokenList[0], isLiked: 'none' }];
    }
  
    const orderedTokens = sortTokens(filteredTokenList, customOrder);
  
    if (likeList.length > 0) {
      const likedTokens = likeList.map(like => {
        const token = orderedTokens.find(token => 
          token.tokenName === like.tokenName && token.tokenSymbol === like.tokenSymbol
        );
        return token ? { ...token, isLiked: 'true' } : null;
      }).filter(token => token !== null);
  
      const unlikedTokens = orderedTokens.filter(token => 
        !likeList.some(like => like.tokenName === token.tokenName && like.tokenSymbol === token.tokenSymbol)
      ).map(token => ({ ...token, isLiked: 'false'}));
      return [...likedTokens as TokenInfo[], ...unlikedTokens];
    }

    return orderedTokens;
  }, [filteredTokenList, likeList, hasTokenBeenAdded]);



  // Add new token re-rendering function
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

  const isActiveChain = (chainId:any) => [55007, 55004].includes(chainId);
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
  

  type TokenButtonProps = {
    tokenLabel: string;
  };

  type TokenListItemProps = {
    tokenData: TokenInfo;
  };

  const TokenListItem = ({ tokenData } : TokenListItemProps) => { 
    const tokeninfo = useTokenBalance(tokenData);
    const displayTokenName = tokenData.tokenName === "ETH" ? "Ethereum" : tokenData.tokenName === "WETH" ? "Wrapped Ethereum" : tokenData.tokenName;
    const mainLabel = tokenData.tokenSymbol
    const subLabel = displayTokenName
    const amount = tokeninfo?.data.balanceBN.formatted || "0.0";

    //like handler
    const handleStarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      event.stopPropagation();
      toggleLike(tokenData)

    };

    const formatAmount = (amount: string) => {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        return "0";
      }
      if (numericAmount === 0) {
        return "0";
      } else {
        return numericAmount.toFixed(5);
      }
    };


    return (
      <HStack
        spacing={4}
        justifyContent="space-between"
        w="full"
        alignItems="center"
        px={4}
        py={"6px"}
        _hover={{ bg: "#313442", px: 4, borderRadius: '8px' }} 
        cursor="pointer"
        onClick={() => {
          try {
            // If a change has occurred in the existing token, reset it to zero
            const inToken = selectedInToken;
            setSelectedToken(tokenData, true)
            setSearchValue("")
            simpleCloseTokenModal();
            
            if (isInTokenOpen) {
              setIsInputAmount(true);
              
              //Four decimal places
              const formatNumber = (number: string) => {
                const numericValue = Number(number);
                if (!isNaN(numericValue)) {
                  const factor = Math.pow(10, 4); // Coefficient of 10000 for rounding down to four decimal place
                  return (Math.floor(numericValue * factor) / factor).toString();
                } else {
                  console.error("Provided value cannot be converted to a number:", number);
                  return "0";
                }
              };
              
              // The modal is temporarily placed because it is detached
              setTokenAmountStatus({
                ...tokenData,
                amount: formatNumber(amount)
              })

              if(tokenData.tokenName != selectedOutToken?.tokenName){
                // If the token value is the same, insert the previously entered value; otherwise, prompt for re-entry
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
        <HStack spacing={3}>
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
          <Text fontSize={"16px"} fontWeight={600} textAlign="right" pr="2">{formatAmount(amount)}</Text>
          {tokenData.isLiked !== 'none' && (
            <Box onClick={handleStarClick} >
              <Icon as={StarIcon} color={tokenData.isLiked === 'true' ? '#007AFF' : '#A0A3AD'}/>
            </Box>
          )}
        </HStack>
      </HStack>
    )};
  return (
        <Modal
            isOpen={(isInTokenOpen || isOutTokenOpen) && mobileTokenOpen}
            onClose={handleClose}
            motionPreset="slideInBottom"
        >
          <ModalOverlay />
            <ModalContent
                alignSelf="flex-end"
                mb={"0px"}
                bg="#222225"
                height="85vh"
                overflow="hidden" 
                px={"16px"}
                borderRadius={"24px 24px 0px 0px"}
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
              searchValue={searchValue}
              onChange={onChange}
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
                overflowY="auto"
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
  );
}