"use client";

import { Flex } from "@chakra-ui/layout";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import Liquidity from "./components/Liquidity";
import UnclaimedEarnings from "./components/UnclaimedEarnings";
import PriceRange from "./components/PriceRange";
import InfoTitle from "./components/InfoTitle";
import InfoHeader from "./components/InfoHeader";
import ClaimEarningsModal from "./components/ClaimEarningsModal";

export default function Page() {
  const { info } = usePositionInfo();

  console.log("info");
  console.log(info);

  if (info === undefined) {
    return null;
    // return <>{`position id not founded with this account :(`}</>;
  }
  return (
    <Flex w={"424px"} flexDir="column">
      <InfoHeader />
      <Flex
        flexDir="column"
        border="1px solid #383736"
        w="424px"
        p={"20px"}
        borderRadius={"16px"}
        flexGrow={1}
        rowGap={"16px"}
        height={"720px"}
        maxH={"720px"}
      >
        <InfoTitle />
        <Liquidity />
        <UnclaimedEarnings />
        <PriceRange />
      </Flex>
      <ClaimEarningsModal />
    </Flex>
  );
}
