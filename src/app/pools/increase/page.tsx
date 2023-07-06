"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../components/TopLine";
import Range from "./components/Range";
import useGetIncreaseLiquidity from "@/hooks/pool/useIncreaseLiquidity";
import SelectedRange from "./components/SelectedRange";
import AddMoreLiquidity from "./components/AddMoreLiquidity";
import ActionButton from "../add/ActionButton";
import IncreaseModal from "./components/IncreaseModal";
export default function IncreaseLiquidityModal() {
  const { liquidityInfo } = useGetIncreaseLiquidity();

  return (
    <Flex flexDir={"column"} w={"852px"} rowGap={"8px"}>
      <TopLine title="Increase Liquidity" clear={false} />
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        p="20px"
        justifyContent={"space-between"}
      >
        <Flex flexDirection={"column"} rowGap={"16px"}>
          <Range />
          <SelectedRange show={true}/>
        </Flex>
        <Flex flexDirection={"column"}>
       <AddMoreLiquidity/>
       <ActionButton/>
        </Flex>
      </Flex>
      <IncreaseModal/>
      {/* <Modals /> */}
    </Flex>
  );
}
