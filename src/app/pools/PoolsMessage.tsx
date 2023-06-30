import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";

export default function PoolsMessage() {
  return (
    <Flex flexDir="column" justifyContent={"center"} alignItems={"center"}>
      <Box>
        <Image src={LOGO_IMAGE} alt={"LOGO_IMAGE"} height={93} width={93} />
      </Box>
      <Text fontSize={64} fontWeight={600} height={"96px"}>
        Tokamak Pools
      </Text>
      <Text
        fontSize={18}
        fontWeight={300}
        height={"27px"}
        fontStyle={"italic"}
        marginBottom={"32px"}
      >
        (coming soon)
      </Text>

      <Flex
        height={"379px"}
        width={"609px"}
        borderRadius={"24px"}
        flexDir={"column"}
        p="40px"
        bg={"#1F2128"}
      >
        <Text fontSize={"16px"} mb={"50px"}>
          Tokamak Bridge will soon introduce the pools feature that enables
          liquidity providers to create and manage pools, thereby offering
          valuable liquidity to users.
        </Text>
        <Text fontSize={"16px"} mb={"50px"}>
          By providing liquidity and participating in token swaps, liquidity
          providers can earn fees and contribute to the thriving ecosystem.
        </Text>
        <Text fontSize={"16px"}>
          The upcoming integration of the pool functionality to the bridge
          service will leverage Uniswap v3's concentrated liquidity mechanisms
          to enable efficient token-swapping operations.
        </Text>
      </Flex>
    </Flex>
  );
}
