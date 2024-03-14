import { Box, Flex, Text } from "@chakra-ui/react";
import "@/css/bridgeSwap/selectNetwork.css";
import NetworkDropdown from "@/components/dropdown/Index";
import { useMemo, useState } from "react";

export default function SelectNetwork() {
  const NetworkSwitcher = useMemo(() => {
    return (
      <Box w={"200px"} h={"32px"}>
        <NetworkDropdown inNetwork={false} height="32px" width={"200px"} />
      </Box>
    );
  }, []);

  return (
    <Flex
      pos={"relative"}
      className="card-wrapper"
      maxH={"388px !important"}
      mt={"80px"}
    >
      {NetworkSwitcher}
      <Flex w={"224px"} h={"248px"} pos={"relative"} mt={"12px"} mb={"16px"}>
        <Flex className="first-layer" zIndex={100}>
          <Box
            w={"100%"}
            h={"100%"}
            display={"flex"}
            flexDir={"column"}
            rowGap={"70px"}
            onClick={() => {
              //add the click function here
            }}
            cursor={"pointer"}
          >
            <Flex
              w={"100%"}
              h={"100%"}
              alignItems={"center"}
              justifyContent={"center"}
              fontSize={20}
              fontWeight={500}
            >
              <Text>Select Network</Text>
            </Flex>
          </Box>
        </Flex>
        <Box className={"second-layer"} />
        <Box className={"third-layer"} />
      </Flex>
    </Flex>
  );
}
