"use client";

import YourPools from "@/pools/YourPools";
import { CTBetaWarning } from "@/staging/components/cross-trade/components/core/comfirm/CTBetaWarning";
import ComingPools from "@/staging/components/cross-trade/components/core/coming/pool";
import CrossTrade from "@/staging/components/cross-trade/components/core/main";

import { Flex } from "@chakra-ui/react";

export default function Page() {
  return (
    /** original code @Robert */
    // <Flex pt={"134px"} justifyContent={"center"} h={"100%"}>
    //   <YourPools />
    // </Flex>
    <>
      <CrossTrade />
      <CTBetaWarning />
    </>
  );
}
