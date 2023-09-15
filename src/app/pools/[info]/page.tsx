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
import { useRecoilValue } from "recoil";
import { ATOM_PositionForInfo_loading } from "@/recoil/pool/positions";

export default function Page() {
  const { info } = usePositionInfo();
  const isLoading = useRecoilValue(ATOM_PositionForInfo_loading);

  if (isLoading) {
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

  if (info === undefined) {
    return <>{"no position :("}</>;
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
        <InfoTitle info={info} />
        <Liquidity info={info} />
        <UnclaimedEarnings info={info} />
        <PriceRange info={info} />
      </Flex>
      {/* <ClaimEarningsModal /> */}
    </Flex>
  );
}
