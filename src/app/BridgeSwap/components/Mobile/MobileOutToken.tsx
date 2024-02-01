import Image from 'next/image';
import { useMemo } from 'react';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import ETHIcon from '@/assets/tokens/eth_half_rounded.svg';
import TitanIcon from '@/assets/tokens/titan_half_rounded.svg';

import { useRecoilState, useRecoilValue } from 'recoil';
import { networkStatus, tokenModalStatus } from '@/recoil/bridgeSwap/atom';
import TokenCard from '@/components/card/TokenCard';
import { useInOutTokens } from '@/hooks/token/useInOutTokens';
import { useGetMode } from '@/hooks/mode/useGetMode';
import { useGetMarketPrice } from '@/hooks/price/useGetMarketPrice';
import useTokenModal from '@/hooks/modal/useTokenModal';
import { IsSearchToken } from '@/recoil/card/selectCard/searchToken';

const MobileOutToken = () => {
  const { outNetwork } = useRecoilValue(networkStatus);
  const { mode, swapSection } = useGetMode();
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const [isTokenSearch] = useRecoilState(IsSearchToken);
  const { outToken } = useInOutTokens();
  const { isOutTokenOpen } = useTokenModal();

  const { tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: outToken?.tokenName as string,
    amount: Number(outToken?.parsedAmount?.replaceAll(',', '')),
  });

  const tokenColorCode = useMemo(() => {
    switch (outToken?.tokenSymbol) {
      case 'ETH':
        return '#627EEA';
      case 'WETH':
        return '#393939';
      case 'TON':
        return '#007AFF';
      case 'WTON':
        return '#007AFF';
      case 'TOS':
        return '#007AFF';
      case 'DOC':
        return '#9e9e9e';
      case 'AURA':
        return '#CB1000';
      case 'LYDA':
        return '#4361EE';
      case 'USDC':
        return '#2775CA';
      case 'USDT':
        return '#50AF95';
      default:
        return '#9e9e9e';
    }
  }, [outToken]);

  return (
    <VStack alignItems="start">
      <Box
        pos="relative"
        w={'148px'}
        h={'184px'}
        cursor={'pointer'}
        onClick={() => swapSection && setTokenModal({ ...tokenModal, isOpen: 'OUTPUT' })}
      >
        {outToken?.tokenName ? (
          <TokenCard
            w={'100%'}
            h={'100%'}
            tokenInfo={outToken}
            hasInput={false}
            inNetwork={true}
            symbolSize={{ w: 64, h: 64 }}
            isSwapPair={true}
            isInput
            style={{ padding: '12px 12px 10px 12px', zIndex: isOutTokenOpen && !isTokenSearch ? 1401 : 'auto' }}
            type="small"
          />
        ) : (
          <Flex
            pos={'relative'}
            w={'148px'}
            h={'184px'}
            border={'2px dashed #313442'}
            rounded={'9px'}
            justify={'center'}
            align={'center'}
            rowGap={'8px'}
            flexDir={'column'}
            zIndex={isOutTokenOpen && !isTokenSearch ? 1401 : 'auto'}
          >
            {mode === 'Deposit' ? (
              <Image alt="titan" src={TitanIcon} />
            ) : mode === 'Withdraw' ? (
              <Image alt="eth" src={ETHIcon} />
            ) : (
              ''
            )}
            <Text fontSize={16} fontWeight={500}>
              {mode === 'Deposit' ? 'Titan' : mode === 'Withdraw' ? 'Ethereum' : 'Select Token'}
            </Text>
          </Flex>
        )}
        {mode !== 'Deposit' && mode !== 'Withdraw' && (
          <Flex
            pos={'absolute'}
            top={'0px'}
            right={'0px'}
            w={'34px'}
            h={'34px'}
            borderRadius={'0px 9px 0px 9px'}
            bg={outToken?.tokenName ? tokenColorCode : '#2E3140'}
            justify={'center'}
            align={'center'}
            zIndex={isOutTokenOpen && !isTokenSearch ? 1401 : 100}
          >
            <Flex w={'28px'} h={'28px'} borderRadius={'0px 6px 0px 6px'}>
              <Image
                alt="eth"
                src={outNetwork?.chainId === 5050 || outNetwork?.chainId === 55004 ? TitanIcon : ETHIcon}
              />
            </Flex>
          </Flex>
        )}
      </Box>

      {outToken?.tokenName && (
        <Box mt="12px">
          <Text
            color="#A0A3AD"
            fontSize={22}
            fontWeight={700}
            lineHeight="normal"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            maxWidth="148px"
          >
            {outToken?.parsedAmount || '0.0'}
          </Text>

          <Text
            color="#A0A3AD"
            fontSize={14}
            fontWeight={500}
            lineHeight="18px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            maxWidth="148px"
          >
            ${tokenPriceWithAmount || '0.00'}
          </Text>
        </Box>
      )}
    </VStack>
  );
};

export default MobileOutToken;
