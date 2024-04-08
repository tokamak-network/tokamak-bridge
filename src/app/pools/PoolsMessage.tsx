import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import useMediaView from "@/hooks/mediaView/useMediaView";

export default function PoolsMessage() {
  const { mobileView } = useMediaView();

  return (
    <Flex
      h={"100vh"}
      pt={{ base: "32px", lg: "140px" }}
      justifyContent={"center"}
    >
      <Flex
        flexDir="column"
        justifyContent={"center"}
        alignItems={"center"}
        px={{ base: "12px", lg: 0 }}
      >
        <Box>
          <Image
            src={LOGO_IMAGE}
            alt={"LOGO_IMAGE"}
            height={mobileView ? 54 : 93}
            width={mobileView ? 56 : 93}
          />
        </Box>
        <Text
          fontSize={{ base: 28, lg: 64 }}
          fontWeight={600}
          height={{ base: "50px", lg: "96px" }}
          letterSpacing={{ base: "2px", lg: "normal" }}
        >
          Tokamak Pools
        </Text>
        <Text
          fontSize={{ base: 16, lg: 18 }}
          fontWeight={300}
          height={"27px"}
          fontStyle={"italic"}
          marginBottom={"32px"}
          letterSpacing={{ base: "1px", lg: "normal" }}
        >
          (coming soon)
        </Text>

        <Flex
          height={{ base: "fit-content", lg: "379px" }}
          width={{ base: "full", lg: "609px" }}
          borderRadius={{ base: "16px", lg: "24px" }}
          flexDir={"column"}
          p={{ base: "24px 16px", lg: "40px" }}
          bg={"#1F2128"}
          fontSize={{ base: "13px", lg: "16px" }}
          textAlign={{ base: "center", lg: "start" }}
          lineHeight={{ base: "22px", lg: "normal" }}
        >
          <Text mb={{ base: "20px", lg: "50px" }}>
            Tokamak Bridge will soon introduce the pools feature that enables
            liquidity providers to create and manage pools, thereby offering
            valuable liquidity to users.
          </Text>
          <Text mb={{ base: "20px", lg: "50px" }}>
            By providing liquidity and participating in token swaps, liquidity
            providers can earn fees and contribute to the thriving ecosystem.
          </Text>
          <Text>
            The upcoming integration of the pool functionality to the bridge
            service will leverage Uniswap v3's concentrated liquidity mechanisms
            to enable efficient token-swapping operations.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
