"use client";

import { Flex } from "@chakra-ui/layout";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import Liquidity from "./components/Liquidity";
import UnclaimedEarnings from "./components/UnclaimedEarnings";
import PriceRange from "./components/PriceRange";
import InfoTitle from "./components/InfoTitle";
import InfoHeader from "./components/InfoHeader";
import ClaimEarningsModal from "./components/ClaimEarningsModal";
import GradientSpinner from "@/components/ui/gradientSpinner";

export default function Page() {
  const { info } = usePositionInfo();

  if (info === undefined) {
    return (
      <Flex w={"95%"} flexDir={"column"}>
        <Flex h={"25px"}>
          <GradientSpinner />
        </Flex>
        <Flex mt={"10px"} justifyContent={"space-between"}>
          <Flex w={"49%"} h={"25px"}>
            <GradientSpinner />
          </Flex>
          <Flex w={"49%"} h={"25px"}>
            <GradientSpinner />
          </Flex>
        </Flex>
      </Flex>
    );
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
