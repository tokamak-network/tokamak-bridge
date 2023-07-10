import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import useGetIncreaseLiquidity from "@/hooks/pool/useIncreaseLiquidity";
import { RangeText } from "./ui";
import TokenSymbolPair from "../increase/components/TokenSymbolPair";
import RangeToken from "../increase/components/RangeToken";
import { useState } from "react";

export default function Range(props: {style?: {}}) {

  const { liquidityInfo } = useGetIncreaseLiquidity();
  const [estimatedGas, setEstimatedGas] = useState<number | undefined>(5);

  return (
    <Flex
      w="364px"
      borderRadius={"12px"}
      border={"3px solid #383736"}
      px="20px"
      py="16px"
      flexDir={"column"}
      {...props.style}
    >
      <Flex justifyContent={"space-between"} w="100%" h="36px">
        <Flex alignItems={"center"}>
          <Text fontWeight="bold" fontSize="23px">
            {liquidityInfo?.token0.tokenSymbol} /{" "}
            {liquidityInfo?.token1.tokenSymbol}
          </Text>
          <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
            <Text fontSize={"12px"} as="b">
              {"0.30%"}
            </Text>
          </Flex>
        </Flex>
        <RangeText inRange={liquidityInfo?.inRange ?? false} />
      </Flex>
      <Flex justifyContent={"center"} w="100%">
        <TokenSymbolPair
          token0={liquidityInfo.token0}
          token1={liquidityInfo.token1}
          //   symbolSize={32}
          marginTop="12px"
        />
      </Flex>
      <RangeToken
        token={liquidityInfo.token0}
        amount={liquidityInfo.token0Amount}
        style={{ marginBottom: "9px", marginTop: "14px" }}
      />

      <RangeToken
        token={liquidityInfo.token1}
        amount={liquidityInfo.token1Amount}
      />
      {estimatedGas !== undefined && (
        <Flex flexDir={"column"} mt="10px">
          <Flex h="1px" borderBottom={"1px solid #2E313A"}></Flex>
          <Flex mt='8px' justifyContent={'space-between'}>
            <Text fontSize={'14px'}>Estimated gas fees</Text>
            <Text fontSize={'16px'} fontWeight={500}>$4.44</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
