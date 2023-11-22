"use client";

import { Flex, Text, Box } from "@chakra-ui/layout";
import TopLine from "../../common/TopLine";
import Range from "../../components/Range";
import SelectPercentage from "../components/SelectPercentage";
import ActionButton from "../components/ActionButton";
import IncreaseModal from "../../components/IncreaseModal";
import TxDetails from "../components/TxDetails";
import RemoveModal from "../../components/RemoveModal";
import { redirect, usePathname } from "next/navigation";
import {
  useGetPositionIdFromPath,
  usePositionInfo,
} from "@/hooks/pool/useGetPositionIds";
import UnclaimedEarnings, {
  CollectFeeAsWETH,
} from "../../[info]/components/UnclaimedEarnings";
import ClaimEarningsModal from "../../[info]/components/ClaimEarningsModal";
import { useIsOwner } from "@/hooks/pool/useIsOwner";

export default function RemoveLiquidity() {
  const { positionId, chainIdParam, backwardLink } = useGetPositionIdFromPath();
  const { info } = usePositionInfo();
  const { needToRedirect } = useIsOwner(info);

  if (needToRedirect) {
    redirect(backwardLink);
  }

  if (info === undefined) return null;

  return (
    <Flex flexDir={"column"} rowGap={"8px"}>
      <TopLine
        title="Remove Liquidity"
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
        <Flex flexDirection={"column"} rowGap={"16px"} maxW={"364px"}>
          <Range page="removeLiquidity" />
          <UnclaimedEarnings info={info} />
          <SelectPercentage />
          <TxDetails />
          <CollectFeeAsWETH />
          <ActionButton />
        </Flex>
      </Flex>
      <IncreaseModal />
      <RemoveModal />
      <ClaimEarningsModal info={info} />
    </Flex>
  );
}
