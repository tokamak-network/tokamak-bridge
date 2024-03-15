"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import InitializeInfo from "./components/InitializeInfo";
import SelectNetwork from "./SelectNetwork";
import SelectFeeTier from "./SelectFeeTier";
import SelectPair from "./SelectPair";
import TopLine from "../common/TopLine";
import SetPriceRange from "./SetPriceRange";
import ActionButton from "./ActionButton";
import { WarningPool } from "./WarningPool";
import IncreaseModal from "../components/IncreaseModal";
import useConnectedNetwork from "@/hooks/network";
import { useInitialize } from "@/hooks/pool/useInitialize";
import { useEffect, useState } from "react";

export default function AddLiquidity() {
  const { initialzePoolValues } = useInitialize();
  const { connectedChainId } = useConnectedNetwork();
  const [exChainId, setExChainId] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (connectedChainId && exChainId !== connectedChainId) {
      initialzePoolValues();
      setExChainId(connectedChainId);
    }
  }, [connectedChainId]);

  return (
    <Flex flexDir={"column"} w={"872px"} rowGap={"16px"}>
      <TopLine title={"Add Liquidity"} clear={true} switcher={true} />
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        p="20px"
        justifyContent={"space-between"}
      >
        <Flex flexDirection={"column"} rowGap={"20px"}>
          <SelectNetwork />
          <SelectFeeTier />
          <SelectPair />
        </Flex>
        <Flex w={"384px"} flexDirection={"column"} rowGap={"20px"}>
          <InitializeInfo />
          <SetPriceRange />
          <WarningPool />
          <ActionButton />
        </Flex>
      </Flex>
      <IncreaseModal />
    </Flex>
  );
}
