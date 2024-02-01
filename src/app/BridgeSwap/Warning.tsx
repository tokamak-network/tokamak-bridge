import { useInOutTokens } from '@/hooks/token/useInOutTokens';
import { Flex, Link, Text } from '@chakra-ui/react';
import Image from 'next/image';
import WARNING_ICON from 'assets/icons/warning.svg';
import WARNING_RED_ICON from 'assets/icons/warningRed.svg';

import useBridgeSupport from '@/hooks/bridge/useBridgeSupport';
import useInputBalanceCheck from '@/hooks/token/useInputCheck';
import { useGetMode } from '@/hooks/mode/useGetMode';
import { WarningText } from '@/components/ui/WarningText';
import useIsTon from '@/hooks/token/useIsTon';
import { GOERLI_CONTRACTS, MAINNET_CONTRACTS, TOKAMAK_CONTRACTS } from '@/constant/contracts';
import useConnectedNetwork from '@/hooks/network';
// import { isETH } from "@/utils/token/isETH";

interface WarningProps {
  fallbackComponent?: any;
}

export default function Warning({ fallbackComponent }: WarningProps) {
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { inToken, outToken } = useInOutTokens();
  const { isBalanceOver } = useInputBalanceCheck();
  const { mode } = useGetMode();
  const { isTONatPair } = useIsTon();
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  // const outTokenIsETH = isETH(outTokenInfo);

  // if (mode === "Swap" && outTokenIsETH !== undefined && outTokenIsETH) {
  //   return (
  //     <Flex color={"#F9C03E"} fontSize={12} columnGap={"10px"}>
  //       <Image src={WARNING_ICON} alt={"WARNING_ICON"} />
  //       <Text>
  //         <Link
  //           href="https://onther.notion.site/WETH-ETH-f9fbe0a04204404c9b4dbef23a795f68"
  //           isExternal
  //           textDecor={"underline"}
  //         >
  //           Cannot swap to ETH right now.
  //         </Link>{" "}
  //         Swap to WETH
  //       </Text>
  //     </Flex>
  //   );
  // }

  if (mode === 'Swap' && isTONatPair) {
    if (
      outToken?.tokenAddress === MAINNET_CONTRACTS.TON_ADDRESS ||
      outToken?.tokenAddress === GOERLI_CONTRACTS.TON_ADDRESS
    ) {
      return <WarningText label={'TON is not supported to swap on L1. Please swap to WTON.'} />;
    }
    return <WarningText label={'TON is not supported to swap on L1. Please wrap to WTON and swap.'} />;
  }

  if (isNotSupportForBridge) {
    if (
      inToken?.tokenAddress === MAINNET_CONTRACTS.WETH_ADDRESS ||
      inToken?.tokenAddress === GOERLI_CONTRACTS.WETH_ADDRESS
    )
      return (
        <WarningText
          label={`Cannot deposit WETH to ${
            isConnectedToMainNetwork ? 'Titan' : 'Titan Goerli'
          }. Unwrap to ETH and deposit.`}
        />
      );
    if (
      inToken?.tokenAddress === MAINNET_CONTRACTS.WTON_ADDRESS ||
      inToken?.tokenAddress === GOERLI_CONTRACTS.WTON_ADDRESS
    )
      return <WarningText label={`WTON is not supported on L2. Please unwrap to TON and deposit`} />;

    if (inToken?.tokenAddress === TOKAMAK_CONTRACTS.WETH_ADDRESS)
      return (
        <WarningText
          label={`Cannot withdraw WETH to ${
            isConnectedToMainNetwork ? 'Ethereum' : 'Goerli'
          }. Unwrap to ETH and withdraw.`}
        />
      );
  }

  if (mode === 'Swap' && isNotSupportForSwap) {
    return (
      <Flex color={'#DD3A44'} fontSize={12} columnGap={'10px'}>
        <Image src={WARNING_RED_ICON} alt={'WARNING_ICON'} />
        <Text>Swap route not found on this network</Text>
      </Flex>
    );
  }

  if (isBalanceOver) {
    return (
      <Flex color={'#DD3A44'} fontSize={12} columnGap={'10px'}>
        <Image src={WARNING_RED_ICON} alt={'WARNING_ICON'} />
        <Text>Insufficient ({inToken?.tokenSymbol}) balance </Text>
      </Flex>
    );
  }

  return fallbackComponent || null;
}
