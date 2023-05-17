import { Box, Flex, Text } from "@chakra-ui/react";
import "@/css/bridgeSwap/selectNetwork.css";
import NetworkDropdown from "@/components/dropdown/Index";

export default function SelectNetwork() {
  return (
    <Flex pos={"relative"} className="go" w={"193px"} h={"100%"}>
      <Flex className="first-layer" zIndex={100}>
        <Box
          className="card card-empty"
          pt={"15px"}
          display={"flex"}
          flexDir={"column"}
          rowGap={"70px"}
        >
          <Flex justifyContent={"flex-end"} pr={"16px"}>
            <NetworkDropdown inNetwork={false} />
          </Flex>
          <Flex
            w={"100%"}
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
      <Box className={"last-layer"} />
    </Flex>
  );
}
