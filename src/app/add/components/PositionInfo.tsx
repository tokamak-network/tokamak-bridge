import { Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import PositionIcon from "@/assets/icons/position.svg";

type PositionInfoProps = {
  currentPrice: number;
  inToken: string;
  outToken: string;
};

export default function PositionInfo(props: PositionInfoProps) {
  const { currentPrice, inToken, outToken } = props;
  return (
    <>
      <Flex flexDir="row" mb={"20px"}>
        <Text>Set Price Range</Text>
      </Flex>
      <Flex flexDir="column" alignItems={"center"} textAlign={"center"}>
        {currentPrice && (
          <Text mb={"16px"} fontSize={12}>
            {`Current Price: ${currentPrice} ${inToken} ${outToken}`}
          </Text>
        )}
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
