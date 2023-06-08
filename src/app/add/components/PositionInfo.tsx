import { Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import PositionIcon from "@/assets/icons/position.svg";

export default function PositionInfo() {
  return (
    <>
      <Flex flexDir="row" mb={"20px"}>
        <Text>Set Price Range</Text>
      </Flex>
      <Flex flexDir="column" alignItems={"center"} textAlign={"center"}>
        <Text mb={"16px"} fontSize={12}>
          Current Price: 1541.8 USDC per ETH
        </Text>
        <Flex
          w={"384px"}
          h={"140px"}
          flexDir={"column"}
          textAlign={"center"}
          alignItems={"center"}
          mt={"44px"}
        >
          <Image src={PositionIcon} alt={"PositionIcon"} />
          <Text fontSize={"20px"} fontWeight={"normal"} mt={"20px"}>
            Your position will appear here.
          </Text>
        </Flex>
      </Flex>
    </>
  );
}
