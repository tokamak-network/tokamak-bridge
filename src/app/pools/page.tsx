"use client";

import { Flex, Wrap, Text, Box, Grid } from "@chakra-ui/layout";
import LPGuide from "./components/LPGuide";
import CreateNew from "./components/CreateNew";
import "css/scrollbar.css";
import PoolCard from "./components/PoolCard";

const poolData: any[] = [];
// const poolData = [
//   {
//     Token1: "ETH",
//     Token2: "USDC",
//     slippage: "0.30%",
//     range: "In Range",
//     Token1Price: "0.0084 ($1.25)",
//     Token2Price: "3090.234 ($1.25)",
//     gasFee: "$3.18",
//   },
//   {
//     Token1: "ETH",
//     Token2: "USDC",
//     slippage: "0.30%",
//     range: "In Range",
//     Token1Price: "0.0084 ($1.25)",
//     Token2Price: "3090.234 ($1.25)",
//     gasFee: "$3.18",
//   },
// ];

export default function Pools() {
  return (
    <Flex flexDir={"column"}>
      <Text fontSize={"36px"} fontWeight="medium" marginBottom={"24px"}>
        Your Pools
      </Text>
      <Flex
        w="673px"
        h="600px"
        alignItems="flex-start"
        padding="16px"
        border="1px solid #313442"
        borderRadius="13px"
        overflowY={poolData.length === 0 ? "hidden" : "auto"}
        css={{
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "::-webkit-scrollbar-track": {
            background: "transparent",
            borderRadius: "4px",
          },
          "::-webkit-scrollbar-thumb": {
            background: "#343741",
            borderRadius: "3px",
          },
        }}
      >
        <Wrap spacing="16px">
          <LPGuide />
          <CreateNew />
          {poolData.length === 0 &&
            Array.from({ length: 7 }, (_, index) => <PoolCard key={index} />)}
          {poolData.length > 0 &&
            poolData.map((card, index) => <PoolCard key={index} />)}
        </Wrap>
      </Flex>
    </Flex>
  );
}
