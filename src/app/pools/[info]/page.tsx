"use client";

import { Flex } from "@chakra-ui/layout";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import Liquidity from "./components/Liquidity";
import UnclaimedEarnings from "./components/UnclaimedEarnings";
import PriceRange from "./components/PriceRange";
import InfoTitle from "./components/InfoTitle";
import InfoHeader from "./components/InfoHeader";
import ClaimEarningsModal from "./components/ClaimEarningsModal";
import GradientSpinner from "@/components/ui/GradientSpinner";
import { useRecoilState, useRecoilValue } from "recoil";
import { ATOM_positionForInfo_loading } from "@/recoil/pool/positions";
import { NoPosition } from "./components/NoPosition";
import { useEffect } from "react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
// import { LoadingCircleSpinner } from "@/components/ui/CircleSpinner";

export default function Page() {
  const { info } = usePositionInfo();
  const isLoading = useRecoilValue(ATOM_positionForInfo_loading);

  const { initializeTokenPairAmount } = useInOutTokens();
  const [, setAmountPercentage] = useRecoilState(removeAmount);

  //initialize input values
  useEffect(() => {
    initializeTokenPairAmount();
    setAmountPercentage(0);
  }, []);

  if (isLoading) {
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
          height={"712px"}
          maxH={"712px"}
        >
          {/* <LoadingCircleSpinner
            width={88}
            height={88}
            containerHeight={"100%"}
            isSlim={true}
          /> */}
        </Flex>
      </Flex>
    );
  }

  if (info === undefined) {
    return <NoPosition />;
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
        height={info?.hasETH ? "712px" : "666px"}
        maxH={info?.hasETH ? "712px" : "666px"}
      >
        <InfoTitle info={info} />
        <Liquidity info={info} />
        <UnclaimedEarnings info={info} />
        <PriceRange info={info} />
      </Flex>
      <ClaimEarningsModal info={info} />
    </Flex>
  );
}
