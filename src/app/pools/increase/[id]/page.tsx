"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../../common/TopLine";
import Range from "../../components/Range";
import AddMoreLiquidity from "../components/AddMoreLiquidity";
import ActionButton from "../components/ActionButton";
import IncreaseModal from "../../components/IncreaseModal";
import PriceRange from "../../[info]/components/PriceRange";
import { useGetPositionIdFromPath } from "@/hooks/pool/useGetPositionIds";

export default function IncreaseLiquidity() {
  const { positionId } = useGetPositionIdFromPath();

  return (
    <Flex flexDir={"column"} w={"852px"} rowGap={"8px"}>
      <TopLine
        title="Increase Liquidity"
        clear={false}
        switcher={false}
        backwardLink={`/pools/${positionId}`}
      />
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        p="20px"
        justifyContent={"space-between"}
      >
        <Flex flexDirection={"column"} rowGap={"16px"} w={"364px"}>
          <Range page="Increase" />
          <PriceRange />
        </Flex>
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <AddMoreLiquidity />
          <ActionButton step="Preview" />
        </Flex>
      </Flex>
      <IncreaseModal />
      {/* <Modals /> */}
    </Flex>
  );
}
