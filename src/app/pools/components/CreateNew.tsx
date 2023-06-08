"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import React, { useState } from "react";
import Image from "next/image";
import plus from "@/assets/icons/plus.svg";
import NextLink from "next/link";

export default function CreateNew() {
  return (
    <NextLink href="/add" passHref>
      <Flex
        flexDir="column"
        border="1px solid #20212B"
        w="200px"
        h="248px"
        paddingTop={"32px"}
        paddingBottom={"24px"}
        borderRadius={"16px"}
        alignItems="center"
        textAlign="center"
        cursor={"pointer"}
        _hover={{
          border: "1px solid #007AFF",
        }}
      >
        <Text fontWeight="semibold" marginBottom={"61px"} fontSize={"16px"}>
          Add Liquidity
        </Text>
        <Image src={plus} alt={"AddLiquidityIcon"} />
        <Box
          width="100%"
          fontStyle="normal"
          fontWeight={400}
          fontSize="12px"
          lineHeight="18px"
          color="#A0A3AD"
          marginTop={"40px"} // ! sizes does not match for 54px
        >
          Earn fees when users swap
          <br />
          with your provided tokens
        </Box>
      </Flex>
    </NextLink>
  );
}
