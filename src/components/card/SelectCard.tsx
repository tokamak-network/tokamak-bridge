import { Box, Flex, HStack, Input, Text } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';

import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import useTokenModal from '@/hooks/modal/useTokenModal';
import { Field } from '@/types/swap/swap';
import { CardCarrousel } from './CardCarousel';
import { searchTokenStatus, IsSearchToken, isInputTokenAmount } from '@/recoil/card/selectCard/searchToken';
import useConnectedNetwork from '@/hooks/network';
import { Overlay_Index } from '@/types/style/overlayIndex';
import { CardCarouselMobile } from './mobile/CardCarouselMobile';
import useMediaView from '@/hooks/mediaView/useMediaView';
import { selectedInTokenStatus, selectedOutTokenStatus, tokenModalStatus } from '@/recoil/bridgeSwap/atom';
import { useRecoilValue } from 'recoil';

import BgImage from 'assets/image/BridgeSwap/selectTokenCardBg.svg';
import BgImageButton from 'assets/image/BridgeSwap/selectTokenBg.svg';
import CloseIcon from 'assets/icons/close.svg';
import SearchIcon from 'assets/icons/search.svg';
import CancelIcon from 'assets/icons/close.svg';
import { TokenSymbol } from '../image/TokenSymbol';
import { useGetTokenList } from '@/hooks/tokenCard/useGetTokenList';

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
      w={'562px'}
      h={'100px'}
      alignItems={'center'}
      justifyContent={'center'}
      cursor={'pointer'}
      onClick={() => (field === 'INPUT' ? onOpenInToken() : onOpenOutToken())}
      pos={'relative'}
      // zIndex={Overlay_Index}
    >
      <Image src={BgImageButton} alt={'BgImageButton'} style={{ position: 'absolute' }} />
      <Text color={'#FFFFFF'} fontSize={24} fontWeight={'semibold'} zIndex={100} mt={'10px'}>
        Select Token
      </Text>
    </Flex>
  );
}

const SearchToken = () => {
  const { onCloseTokenModal } = useTokenModal();
  const [, setSearchToken] = useRecoilState(searchTokenStatus);
  const { mobileView, pcView } = useMediaView();

  const { connectedChainId } = useConnectedNetwork();
  const ref = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [isTokenSearch, setTokenSearch] = useRecoilState(IsSearchToken);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.blur();
    }, 0);
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchValue(value);
  };

  const handleFocus = () => {
    setTokenSearch(true);
  };

  const handleBlur = () => {
    setTokenSearch(false);
  };

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && mobileView) ref?.current?.blur();
  };

  useEffect(() => {
    if (searchValue === '') {
      return setSearchToken(null);
    }
    if (connectedChainId) {
      return setSearchToken({ nameOrAdd: searchValue, chainId: connectedChainId });
    }
  }, [searchValue]);

  return (
    <Flex
      w={'100%'}
      justifyContent={'center'}
      pos={'relative'}
      zIndex={Overlay_Index.BelowHeader}
      border={'1px solid transparent'}
      _hover={{ border: mobileView ? '1px solid #313442' : '' }}
      rounded={{ base: '8px', lg: '21.5px' }}
      bgColor={{ base: '#0F0F12', lg: 'transparent' }}
    >
      <Input
        w={{ base: '100%', lg: '430px' }}
        h={'42px'}
        borderRadius={{ base: '8px', lg: '21.5px' }}
        placeholder={'Search token name or address'}
        _placeholder={{ color: '#8E8E92', fontWeight: 500 }}
        boxShadow={'none !important'}
        border={{}}
        bgColor={'#0F0F12'}
        _focus={{}}
        _active={{}}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={onKeyDown}
        ref={ref}
        value={searchValue}
      ></Input>

      {mobileView && (
        <Image
          src={searchValue ? CancelIcon : SearchIcon}
          alt={'close'}
          style={{ cursor: 'pointer', marginRight: '10px' }}
          onMouseDown={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            setSearchValue('');
          }}
        />
      )}

      {pcView && (
        <Box pos={'absolute'} right={'69px'}>
          <Image src={CloseIcon} alt={'close'} style={{ cursor: 'pointer' }} onClick={() => onCloseTokenModal()} />
        </Box>
      )}
    </Flex>
  );
};

const SuggestTokenItem = ({ tokenSymbol, onClick }: { tokenSymbol: string; onClick: () => void }) => {
  return (
    <HStack borderRadius="24px" bg="#17181D" p="4px 8px" gap="0" cursor="pointer" onClick={onClick}>
      <TokenSymbol w={18} h={18} tokenType={tokenSymbol} />

      <Text fontSize="15px" lineHeight="22px">
        {tokenSymbol}
      </Text>
    </HStack>
  );
};

const SuggestTokenList = () => {
  const { filteredTokenList } = useGetTokenList();
  const { onCloseTokenModal, isInTokenOpen } = useTokenModal();
  const [selectedInToken, setSelectedInToken] = useRecoilState(selectedInTokenStatus);
  const [, setSelectedOutToken] = useRecoilState(selectedOutTokenStatus);
  const { chainName } = useConnectedNetwork();

  const ethTokenData = filteredTokenList?.find((token: any) => token.tokenSymbol === 'ETH');
  const usdcTokenData = filteredTokenList?.find((token: any) => token.tokenSymbol === 'USDC');
  const usdtTokenData = filteredTokenList?.find((token: any) => token.tokenSymbol === 'USDT');
  const tonTokenData = filteredTokenList?.find((token: any) => token.tokenSymbol === 'TON');

  const handleSelectToken = (tokenSymbol: string) => {
    const tokenData =
      tokenSymbol === 'ETH'
        ? ethTokenData
        : tokenSymbol === 'USDC'
        ? usdcTokenData
        : tokenSymbol === 'USDT'
        ? usdtTokenData
        : tonTokenData;

    isInTokenOpen && tokenData
      ? setSelectedInToken({
          ...tokenData,
          amountBN: null,
          parsedAmount: null,
          tokenAddress: selectedInToken?.tokenAddress || null,
        })
      : tokenData &&
        chainName &&
        setSelectedOutToken({
          ...tokenData,
          amountBN: null,
          parsedAmount: null,
          tokenAddress: tokenData.address[chainName],
        });

    onCloseTokenModal();
  };

  return (
    <HStack justifyContent="space-between" w="100%">
      <SuggestTokenItem tokenSymbol="ETH" onClick={() => handleSelectToken('ETH')} />
      <SuggestTokenItem tokenSymbol="USDC" onClick={() => handleSelectToken('USDC')} />
      <SuggestTokenItem tokenSymbol="USDT" onClick={() => handleSelectToken('USDT')} />
      <SuggestTokenItem tokenSymbol="TON" onClick={() => handleSelectToken('TON')} />
    </HStack>
  );
};

export function SelectCardModal() {
  const { isInTokenOpen, isOutTokenOpen, onCloseTokenModal } = useTokenModal();
  const { mobileView, pcView } = useMediaView();
  const { isOpen } = useRecoilValue(tokenModalStatus);
  const [isTokenSearch, setTokenSearch] = useRecoilState(IsSearchToken);
  const ref = useRef<HTMLInputElement>(null);
  const [selectedInToken, setSelectedInToken] = useRecoilState(selectedInTokenStatus);
  const [isInputAmount] = useRecoilState(isInputTokenAmount);
  //close when click at outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (event.target.id === 'out-area') {
        return onCloseTokenModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedInToken?.parsedAmount]);

  const handleBlur = useCallback(() => {
    if (!isTokenSearch) {
      onCloseTokenModal();
      if (mobileView && selectedInToken?.parsedAmount === null) setSelectedInToken(null);
    }
  }, [isTokenSearch, selectedInToken?.parsedAmount, mobileView]);

  const handleClose = useCallback(() => {
    onCloseTokenModal();
    // if (mobileView && selectedInToken?.parsedAmount === null) setSelectedInToken(null);
  }, [selectedInToken?.parsedAmount, mobileView]);

  return (
    <Modal
      isOpen={isInTokenOpen || isOutTokenOpen}
      onClose={mobileView ? handleClose : onCloseTokenModal}
      autoFocus={false}
    >
      <ModalOverlay bg="rgb(0 0 0 / 95%)" />
      <ModalContent
        minW={'100%'}
        maxW={'100%'}
        h={{
          base: isTokenSearch ? 'calc(100% - 60px)' : 'fit-content',
          lg: '100%',
        }}
        m={{ base: 'none', lg: 0 }}
        mt={'auto'}
        mb={0}
        p={0}
        bg={{ base: '#1F2128', lg: 'transparent' }}
        overflow={'hidden'}
        __css={{
          '.react-stacked-center-carousel-slide--3, .react-stacked-center-carousel-slide--2, .react-stacked-center-carousel-slide--1':
            {
              opacity: 0.5,
            },
        }}
      >
        <ModalBody
          minW={'100%'}
          maxW={'100%'}
          p={0}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'end'}
          bg={'transparent'}
          id="out-area"
          zIndex={1}
        >
          <Flex
            w={'1362px'}
            h={{ base: '100%', lg: '486px' }}
            bgColor={{ base: '#1F2128', lg: 'transparent' }}
            rounded={'24px 24px 0px 0px'}
            padding={{ base: '16px 10px', lg: 0 }}
            // borderRadius={"150px 150px 0px 0px"}
            rowGap={'17.43px'}
            flexDir={'column'}
            alignItems={'center'}
            backgroundImage={BgImage}
            zIndex={100}
            overflow={{ base: 'hidden' }}
            mb={{ base: 'auto', lg: '0' }}
          >
            {pcView && (
              <Flex pos={'absolute'}>
                <Image
                  src={BgImage}
                  alt={'CloseIcon'}
                  style={{
                    minWidth: '1362px',
                    width: '1362px',
                    minHeight: '486px',
                    height: '486px',
                  }}
                ></Image>
              </Flex>
            )}
            {pcView && (
              <>
                <CardCarrousel />
                <SearchToken />
              </>
            )}
            {!pcView && (
              <>
                <HStack justifyContent="space-between" w="100%" px="2px">
                  <Text fontWeight={500} fontSize="15px" lineHeight="22.5px">
                    Select token
                  </Text>

                  <Image
                    width={20}
                    height={20}
                    src={CloseIcon}
                    alt={'close'}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onCloseTokenModal()}
                  />
                </HStack>
                <SearchToken />
                <SuggestTokenList />
                <CardCarouselMobile />
              </>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
