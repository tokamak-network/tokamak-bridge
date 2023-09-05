import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/warning.svg";
import WARNING_RED_ICON from "assets/icons/warningRed.svg";

import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { WarningText } from "@/components/ui/WarningText";
import useIsTon from "@/hooks/token/useIsTon";
import { MAINNET_CONTRACTS } from "@/constant/contracts";

export default function Warning() {
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { inToken } = useInOutTokens();
  const { isBalanceOver } = useInputBalanceCheck();
  const { mode } = useGetMode();
  const { isTONatPair } = useIsTon();

  if (mode === "Swap" && isTONatPair) {
    return (
      <WarningText
        label={
          "TON is not supported to swap on L1. Please wrap to WTON and swap."
        }
      />
    );
  }

  if (isNotSupportForBridge) {
    if (inToken?.tokenAddress === MAINNET_CONTRACTS.WETH_ADDRESS)
      return <WarningText label="Please unwrap to ETH and deposit." />;
    if (inToken?.tokenAddress === MAINNET_CONTRACTS.WTON_ADDRESS)
      return (
        <WarningText label="WTON is not supported on L2. Please unwrap to TON and deposit" />
      );

    return (
      <Flex color={"#F9C03E"} fontSize={12} columnGap={"10px"}>
        <Image src={WARNING_ICON} alt={"WARNING_ICON"} />
        <Text>{inToken?.tokenSymbol} is not supported on L2. </Text>
      </Flex>
    );
  }

  if (mode === "Swap" && isNotSupportForSwap) {
    return (
      <Flex color={"#DD3A44"} fontSize={12} columnGap={"10px"}>
        <Image src={WARNING_RED_ICON} alt={"WARNING_ICON"} />
        <Text>Swap route not found on this network</Text>
      </Flex>
    );
  }

  if (isBalanceOver) {
    return (
      <Flex color={"#DD3A44"} fontSize={12} columnGap={"10px"}>
        <Image src={WARNING_RED_ICON} alt={"WARNING_ICON"} />
        <Text>Insufficient ({inToken?.tokenSymbol}) balance </Text>
      </Flex>
    );
  }

  return null;
}
