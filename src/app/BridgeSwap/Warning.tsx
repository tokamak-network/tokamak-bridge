import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/warning.svg";
import WARNING_RED_ICON from "assets/icons/warningRed.svg";

import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";

export default function Warning() {
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { inToken } = useInOutTokens();

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
        <Text>Insufficient ({inToken?.tokenSymbol}) liquidity</Text>
      </Flex>
    );
  }

  return null;
}
