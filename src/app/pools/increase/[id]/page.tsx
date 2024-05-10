"use client";

import { Flex } from "@chakra-ui/layout";
import TopLine from "../../common/TopLine";
import Range from "../../components/Range";
import AddMoreLiquidity from "../components/AddMoreLiquidity";
import ActionButton from "../components/ActionButton";
import IncreaseModal from "../../components/IncreaseModal";
import PriceRange from "../../[info]/components/PriceRange";
import {
  useGetPositionIdFromPath,
  usePositionInfo,
} from "@/hooks/pool/useGetPositionIds";
import useBlockNum from "@/hooks/network/useBlockNumber";
import { usePoolContract } from "@/hooks/pool/usePoolContract";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { estimatedGasFee } from "@/recoil/global/transaction";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useIsOwner } from "@/hooks/pool/useIsOwner";
import { redirect } from "next/navigation";

export default function IncreaseLiquidity() {
  const { info } = usePositionInfo();
  const { backwardLink } = useGetPositionIdFromPath();
  const { estimateGasToIncrease } = usePoolContract();
  const { blockNumber } = useBlockNum();
  const [estimatedGasUsageValue, setEstimatedGasUsage] = useRecoilState<
    number | undefined | null
  >(estimatedGasFee);
  const { inToken, outToken, tokensPairHasAmount } = useInOutTokens();
  const { needToRedirect } = useIsOwner(info);

  useEffect(() => {
    const fetchData = async () => {
      if (tokensPairHasAmount) {
        const gasData = await estimateGasToIncrease();
        setEstimatedGasUsage(gasData);
      }
    };
    fetchData();
  }, [blockNumber, inToken?.amountBN, outToken?.amountBN, tokensPairHasAmount]);

  if (needToRedirect) {
    redirect(backwardLink);
  }

  return (
    <Flex flexDir={"column"} w={"852px"} rowGap={"8px"} pt={"134px"}>
      <TopLine
        title="Increase Liquidity"
        clear={false}
        switcher={false}
        backwardLink={backwardLink}
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
            estimatedGas={estimatedGasUsageValue}
          />
          <PriceRange info={info} />
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
