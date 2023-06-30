import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/warning.svg";
import WARNING_RED_ICON from "assets/icons/warningRed.svg";

import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";

export default function Warning() {
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { inToken } = useInOutTokens();
  const { isBalanceOver } = useInputBalanceCheck();

  if (isNotSupportForBridge)
    return (
      <Flex color={"#F9C03E"} fontSize={12} columnGap={"10px"}>
        <Image src={WARNING_ICON} alt={"WARNING_ICON"} />
        <Text>{inToken?.tokenSymbol} is not supported on L2</Text>
      </Flex>
    );

  if (isNotSupportForSwap) {
    return (
      <Flex color={"#DD3A44"} fontSize={12} columnGap={"10px"}>
        <Image src={WARNING_RED_ICON} alt={"WARNING_ICON"} />
        <Text>Swap route not founded on this network</Text>
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
