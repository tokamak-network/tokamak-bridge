import { Box, Flex, Text } from "@chakra-ui/react";
import "@/css/bridgeSwap/selectNetwork.css";
import NetworkDropdown from "@/components/dropdown/Index";
import { useMemo, useState } from "react";

export default function SelectNetwork() {
  const NetworkSwitcher = useMemo(() => {
    return (
      <Box w={"200px"} h={"32px"}>
        <NetworkDropdown inNetwork={false} width={"200px"} height="32px" />
      </Box>
    );
  }, []);

  return (
    <Flex
      pos={"relative"}
      className="card-wrapper"
      maxH={"388px !important"}
      mt={"80px"}>
      {NetworkSwitcher}
      <Flex
        w={"224px"}
        h={"248px"}
        justifyContent={"center"}
        pos={"relative"}
        mt={"14px"}
        mb={"16px"}>
        <Box
          h={"100%"}
          border={"1px dashed #313442"}
          width={"192px"}
          display={"flex"}
          // className="card card-empty"
          flexDir={"column"}
          right={"16px"}
          borderRadius={"16px"}
          rowGap={"70px"}
          onClick={() => {
            //add the click function here
          }}
          cursor={"pointer"}>
          <Flex
            w={"100%"}
            h={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
            fontSize={20}
            fontWeight={500}>
            <Text>Select Network</Text>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
}
