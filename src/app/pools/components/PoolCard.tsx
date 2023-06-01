"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import Image from "next/image";

type poolProps = {};

export default function PoolTile() {
  return (
    <Flex
      flexDir="column"
      border="1px solid #20212B"
      bgColor="#15161D"
      w="200px"
      h="248px"
      marginRight={"16px"}
      paddingTop={"32px"}
      paddingBottom={"24px"}
      borderRadius={"16px"}
      alignItems="center"
      textAlign="center"
    ></Flex>
  );
}
