"use client";

import { Flex, Wrap, Text, Box, Grid } from "@chakra-ui/layout";
import LPGuide from "./components/LPGuide";
import CreateNew from "./components/CreateNew";
import "css/scrollbar.css";
import PoolCard from "./components/PoolCard";
import { PoolCardDetail } from "@/types/pool";
import EmptyCard from "./components/EmptyCard";
import { Token } from "@uniswap/sdk-core";
import Link from "next/link";

// Token symbol urls
import EthL1 from "@/assets/tokens/ethGroup.svg";
import UsdcL1 from "@/assets/tokens/usdcEth.svg";
import TokL1 from "@/assets/tokens/tokEth.svg";
import TonL1 from "@/assets/tokens/tonEth.svg";
import TonL2 from "@/assets/tokens/tonL2.svg";
import UsdcL2 from "@/assets/tokens/usdcL2.svg";

// * MOCK DATA
// const poolData: any[] = [];
const poolData: PoolCardDetail[] = [
  {
    id: 1,
    in: "ETH",
    out: "USDC",
    slippage: "0.30%",
    range: false,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: EthL1,
      outTokenSymbol: UsdcL1,
    },
  },
  {
    id: 2,
    in: "ETH",
    out: "TOK",
    slippage: "0.30%",
    range: true,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: EthL1,
      outTokenSymbol: TokL1,
    },
  },
  {
    id: 3,
    in: "ETH",
    out: "TON",
    slippage: "0.30%",
    range: true,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: EthL1,
      outTokenSymbol: TonL1,
    },
  },
  {
    id: 4,
    in: "TON",
    out: "USDC",
    slippage: "0.30%",
    range: true,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: TonL2,
      outTokenSymbol: UsdcL2,
    },
  },
  {
    id: 5,
    in: "ETH",
    out: "TON",
    slippage: "0.30%",
    range: true,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: EthL1,
      outTokenSymbol: TonL1,
    },
  },
  {
    id: 6,
    in: "ETH",
    out: "TON",
    slippage: "0.30%",
    range: true,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: EthL1,
      outTokenSymbol: TonL1,
    },
  },
  {
    id: 7,
    in: "ETH",
    out: "TON",
    slippage: "0.30%",
    range: true,
    trade: {
      inputAmount: 0.0084,
      outTokenAmount: 3090.234,
      gasFee: 3.18,
    },
    symbol: {
      inTokenSymbol: EthL1,
      outTokenSymbol: TonL1,
    },
  },
];

export default function Pools() {
  return (
    <Flex flexDir="column">
      <Text fontSize="36px" fontWeight="medium" marginBottom="24px">
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
            Array.from({ length: 7 }, (_, index) => <EmptyCard key={index} />)}
          {poolData.length > 0 &&
            poolData.map((card) => (
              <Link href="/pools/[slug]" as={`/pools/${card.id}`} key={card.id}>
                <PoolCard
                  in={card.in}
                  out={card.out}
                  range={card.range}
                  slippage={card.slippage}
                  trade={{
                    inputAmount: card.trade.inputAmount,
                    outTokenAmount: card.trade.outTokenAmount,
                    gasFee: card.trade.gasFee,
                  }}
                  symbol={{
                    inTokenSymbol: card.symbol.inTokenSymbol,
                    outTokenSymbol: card.symbol.outTokenSymbol,
                  }}
                />
              </Link>
            ))}
        </Wrap>
      </Flex>
    </Flex>
  );
}
