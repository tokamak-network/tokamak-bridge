import { Box, Flex, Text } from "@chakra-ui/react";
import "@/css/bridgeSwap/selectNetwork.css";
import NetworkDropdown from "@/components/dropdown/Index";

export default function SelectNetwork() {
  return (
    <Flex pos={"relative"} className="card-wrapper">
      <NetworkDropdown inNetwork={false} />
      <Flex w={"224px"} h={"248px"} pos={"relative"} mt={"12px"} mb={"16px"}>
        <Flex className="first-layer" zIndex={100}>
          <Box
            w={"100%"}
            h={"100%"}
            display={"flex"}
            flexDir={"column"}
            rowGap={"70px"}
          >
            <Flex
              w={"100%"}
              h={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={20}
              fontWeight={500}
            >
              <Text>Search Network</Text>
            </Flex>
          </Box>
        </Flex>
        <Box className={"second-layer"} />
        <Box className={"third-layer"} />
      </Flex>
    </Flex>
  );
}
