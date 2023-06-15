import { useState } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import zoomInIcon from "@/assets/icons/zoomIn.svg";
import zoomOutIcon from "@/assets/icons/zoomOut.svg";
import { Line } from "react-chartjs-2";
import { Range } from "react-range";
import useV3SwapPools from "@uniswap/sdk-core";

export default function Graph() {
  // const pools = useV3SwapPools();
  // const sortedPools = pools.sort((a, b) => a.price.current - b.price.current);
  // const priceRange = sortedPools.reduce(
  //   (acc, pool, i) => {
  //     if (i === 0) {
  //       acc.min = pool.price.current;
  //     }
  //     if (i === sortedPools.length - 1) {
  //       acc.max = pool.price.current;
  //     }
  //     return acc;
  //   },
  //   { min: Number.MAX_VALUE, max: Number.MIN_VALUE }
  // );

  // const chart = new Chart(document.getElementById("price-range-selector"), {
  //   type: "line",
  //   data: {
  //     labels: sortedPools.map((pool) => pool.price.current),
  //     datasets: [
  //       {
  //         data: sortedPools.map((pool) => pool.price.current),
  //         fill: false,
  //         lineTension: 0.1,
  //       },
  //     ],
  //   },
  //   options: {
  //     title: {
  //       text: "Price Range Selector",
  //     },
  //     xaxis: {
  //       title: {
  //         text: "Price",
  //       },
  //     },
  //     yaxis: {
  //       title: {
  //         text: "Number of Pools",
  //       },
  //     },
  //   },
  // });

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
        <Text mb={"16px"} fontSize={12}>
          Current Price: 1541.8 USDC per ETH
        </Text>
      </Flex>

      <Flex h={"17px"}></Flex>
    </>
  );
}
