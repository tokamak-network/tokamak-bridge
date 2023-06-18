"use client";

import { Flex } from "@chakra-ui/layout";
// import { PoolCardDetail } from "@/types/pool";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import Liquidity from "./components/Liquidity";
import UnclaimedEarnings from "./components/UnclaimedEarnings";
import PriceRange from "./components/PriceRange";
import InfoTitle from "./components/InfoTitle";
import InfoHeader from "./components/InfoHeader";
// import TokenSymbolPair from "@/components/ui/TokenSymbolPair";
// import LiquidityInfo from "../components/LiquidityInfo";
// import UnclaimedEarnings from "../components/UnclaimedEarnings";
// import PriceInput from "../../add/components/priceInput";
// import ClaimEarningsModal from "@/components/modal/ClaimEarnings";
// import PriceRange from "@/components/ui/PriceRange";

export default function Page() {
  const { info } = usePositionInfo();

  if (info === undefined) {
    return <>{`position id not founded with this account :(`}</>;
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
        rowGap={"12px"}
      >
        <InfoTitle />
        <Liquidity />
        <UnclaimedEarnings />
        <PriceRange />
      </Flex>

      {/* <ClaimEarningsModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
      /> */}
    </Flex>
  );
}
