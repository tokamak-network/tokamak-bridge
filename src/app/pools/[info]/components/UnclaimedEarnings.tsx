import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
// import TokenNetwork from "@/components/ui/TokenNetwork";

export default function UnclaimedEarnings() {
  const { info } = usePositionInfo();

  return (
    <Flex
      bgColor="#1F2128"
      w="100%"
      //   h="163px"
      h="121px"
      pt="14px"
      pb={"18px"}
      px="20px"
      borderRadius={"12px"}
      justifyContent={"space-between"}
    >
      <Flex alignItems={"left"} flexDir={"column"}>
        <Text>Unclaimed earnings</Text>
        <Text fontSize={"24px"} as="b" mt={"6px"}>
          $0.20
        </Text>
        <Flex mb={"8px"} alignItems={"center"} color="#A0A3AD">
          <Text fontSize={"12px"}>
            {commafy(info?.token0CollectedFee, 8)} {info?.token0.symbol}
          </Text>
          <Text w={"10px"} mx={"2px"}>
            +
          </Text>
          <Text fontSize={"12px"}>
            {commafy(info?.token1CollectedFee, 8)} {info?.token1.symbol}
          </Text>
        </Flex>
      </Flex>
      <Flex alignItems={"flex-end"} pb={"13px"}>
        <Button
          bgColor={"#007AFF"}
          _hover={{ bgColor: "#007AFF" }}
          _active={{}}
          // onClick={openModal}
        >
          Collect
        </Button>
      </Flex>
    </Flex>
  );
}
