"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../components/TopLine";
import Range from "../components/Range";
import useGetIncreaseLiquidity from "@/hooks/pool/useIncreaseLiquidity";
import SelectPercentage from "./components/SelectPercentage";
import ActionButton from "../add/ActionButton";
import IncreaseModal from "../components/IncreaseModal";
import TxDetails from "./components/TxDetails";
import { useRecoilState } from "recoil";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import RemoveModal from "../components/RemoveModal";
export default function IncreaseLiquidityModal() {
  const { liquidityInfo } = useGetIncreaseLiquidity();
  const [amountPercentage, setAmountPercentage] = useRecoilState(removeAmount);

  return (
    <Flex flexDir={"column"}  rowGap={"8px"}>
      <TopLine title="Remove Liquidity" clear={false} />
      <Flex
        border="1px solid #20212B"
        borderRadius={"16px"}
        p="20px"
        justifyContent={"space-between"}
      >
        <Flex flexDirection={"column"} rowGap={"16px"}>
          <Range />
       
          <SelectPercentage/>
          {amountPercentage !== 0 && <TxDetails/> }
          <ActionButton actionName={'Preview'} page={'Remove'} />
        </Flex>
       
      </Flex>
      <IncreaseModal/>
      <RemoveModal/>
      {/* <Modals /> */}
    </Flex>
  );
}
