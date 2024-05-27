import { Flex, Text } from "@chakra-ui/react";
import PoolList from "./components/PoolList";
import { useAccount } from "wagmi";
import { useGetPositionIds } from "@/hooks/pool/useGetPositionIds";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { ATOM_positionForInfo } from "@/recoil/pool/positions";

export default function YourPools() {
  const { isConnected } = useAccount();
  const { positions } = useGetPositionIds();

  const isReducedHeight = !isConnected || positions?.length === 0;

  //initialize positionInfo to make sure info page would be able to start from zero base
  const [, setPositions] = useRecoilState(ATOM_positionForInfo);
  useEffect(() => {
    setPositions(undefined);
  }, []);

  return (
    <Flex flexDir='column' alignSelf={"baseline"} h={"100%"}>
      {/*
      Coming Update @Robert 
      <Flex flexDir={"column"} mb={"32px"}>
        <Text fontSize={36} fontWeight="medium" h={"54px"}>
          Your Uniswap Pool
        </Text>
        <Text fontSize={14} h={"21px"} color={"#A0A3AD"}>
          Add liquidity to a pool, and earn a swap fee based on the trading
          volume.
        </Text>
      </Flex> 
      */}
      <Flex
        w='672px'
        h={isReducedHeight ? "440px" : "600px"}
        p={"20px"}
        pr={"0px"}
        border='1px solid #313442'
        borderRadius='13px'
        overflowY={"hidden"}
      >
        <PoolList />
      </Flex>
      {/* <LoadingModal /> */}
    </Flex>
  );
}
