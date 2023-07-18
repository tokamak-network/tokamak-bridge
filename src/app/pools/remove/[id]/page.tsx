"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../../common/TopLine";
import Range from "../../components/Range";
import SelectPercentage from "../components/SelectPercentage";
import ActionButton from "../components/ActionButton";
import IncreaseModal from "../../components/IncreaseModal";
import TxDetails from "../components/TxDetails";
import RemoveModal from "../../components/RemoveModal";

export default function IncreaseLiquidityModal() {
  return (
    <Flex flexDir={"column"} rowGap={"8px"}>
      <TopLine title="Remove Liquidity" clear={false} switcher={false} />
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        p="20px"
        justifyContent={"space-between"}
      >
        <Flex flexDirection={"column"} rowGap={"16px"}>
          <Range page="Remove" />
          <SelectPercentage />
          <TxDetails />
          <ActionButton step="preview" />
        </Flex>
      </Flex>
      <IncreaseModal />
      <RemoveModal />
    </Flex>
  );
}
