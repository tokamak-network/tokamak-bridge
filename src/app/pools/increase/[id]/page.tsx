"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../../common/TopLine";
import Range from "../../components/Range";
import AddMoreLiquidity from "../components/AddMoreLiquidity";
import ActionButton from "../components/ActionButton";
import IncreaseModal from "../../components/IncreaseModal";
import PriceRange from "../../[info]/components/PriceRange";
import { useGetPositionIdFromPath } from "@/hooks/pool/useGetPositionIds";
import { ApproveButtonsContrainer } from "../../add/ActionButton";
import useBlockNum from "@/hooks/network/useBlockNumber";
import { usePoolContract, usePoolMint } from "@/hooks/pool/usePoolContract";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { estimatedGasFee } from "@/recoil/global/transaction";
import commafy from "@/utils/trim/commafy";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

export default function IncreaseLiquidity() {
  const { positionId } = useGetPositionIdFromPath();
  const { estimateGasToIncrease } = usePoolContract();
  const { blockNumber } = useBlockNum();
  const [estimatedGasUsageValue, setEstimatedGasUsage] =
    useRecoilState(estimatedGasFee);
  const { inToken, outToken } = useInOutTokens();

  useEffect(() => {
    const fetchData = async () => {
      const gasData = await estimateGasToIncrease();
      setEstimatedGasUsage(gasData);
    };
    fetchData();
  }, [blockNumber, inToken?.amountBN, outToken?.amountBN]);

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
          <Range
            page="increaseLiquidity"
            estimatedGas={
              estimatedGasUsageValue
                ? commafy(estimatedGasUsageValue, 2)
                : undefined
            }
          />
          <PriceRange />
        </Flex>
        <Flex flexDirection={"column"} justifyContent={"space-between"}>
          <AddMoreLiquidity />
          <ActionButton />
        </Flex>
      </Flex>
      <IncreaseModal />
      {/* <Modals /> */}
    </Flex>
  );
}
