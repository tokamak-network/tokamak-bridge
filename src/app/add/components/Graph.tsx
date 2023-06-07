import { Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import zoomInIcon from "@/assets/icons/zoomIn.svg";
import zoomOutIcon from "@/assets/icons/zoomOut.svg";

export default function Graph() {
  return (
    <>
      <Flex flexDir="row" mb={"20px"}>
        <Text>Set Price Range</Text>
        <Flex ml={"194px"}>
          <Box mr={"8px"}>
            <Image src={zoomInIcon} alt={"zoomIn"} />
          </Box>
          <Box>
            <Image src={zoomOutIcon} alt={"zoomOut"} />
          </Box>
        </Flex>
      </Flex>
      <Flex flexDir="column" alignItems={"center"}>
        <Text mb={"16px"}>Current Price: 1541.8 USDC per ETH</Text>
        <Box w={"384px"} h={"184px"} border="1px solid #313442"></Box>
      </Flex>
    </>
  );
}
