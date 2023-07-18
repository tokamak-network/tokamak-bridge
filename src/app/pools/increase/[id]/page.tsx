"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../../common/TopLine";
import Range from "../../components/Range";
import useGetIncreaseLiquidity from "@/hooks/pool/useIncreaseLiquidity";
import SelectedRange from "../components/SelectedRange";
import AddMoreLiquidity from "../components/AddMoreLiquidity";
import ActionButton from "../components/ActionButton";
import IncreaseModal from "../../components/IncreaseModal";

export default function IncreaseLiquidity() {
  const { liquidityInfo } = useGetIncreaseLiquidity();

  return (
    <Flex flexDir={"column"} w={"852px"} rowGap={"8px"}>
      <TopLine title="Increase Liquidity" clear={false} switcher={false} />
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        p="20px"
        justifyContent={"space-between"}
      >
        <Flex flexDirection={"column"} rowGap={"16px"}>
          <Range page="Increase" />
          <SelectedRange show={true} />
        </Flex>
        <Flex flexDirection={"column"}>
          <AddMoreLiquidity />
          <ActionButton step="preview" />
        </Flex>
      </Flex>
      <IncreaseModal />
      {/* <Modals /> */}
    </Flex>
  );
}
