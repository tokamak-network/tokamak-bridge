import { Flex, Text } from "@chakra-ui/react";
import PoolList from "./components/PoolList";
import { useAccount } from "wagmi";
import { useGetPositionIds } from "@/hooks/pool/useGetPositionIds";

export default function YourPools() {
  const { isConnected } = useAccount();
  const { positions } = useGetPositionIds();

  const isReducedHeight = !isConnected || positions?.length === 0;

  return (
    <Flex flexDir="column" alignSelf={"baseline"} h={"100%"}>
      <Flex flexDir={"column"} mb={"32px"}>
        <Text fontSize={36} fontWeight="medium" h={"54px"}>
          Your Uniswap Poolsh
        </Text>
        <Text fontSize={14} h={"21px"} color={"#A0A3AD"}>
          Add liquidity to a pool, and earn a swap fee based on the trading
          volume.
        </Text>
      </Flex>
      <Flex
        w="672px"
        h={isReducedHeight ? "440px" : "600px"}
        p={"20px"}
        pr={"0px"}
        border="1px solid #313442"
        borderRadius="13px"
        overflowY={"hidden"}
      >
        <PoolList />
      </Flex>
      {/* <LoadingModal /> */}
    </Flex>
  );
}
