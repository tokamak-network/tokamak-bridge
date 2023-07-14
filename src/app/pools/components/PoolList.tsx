import useGetPositionIds from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import { useMemo } from "react";

export default function PoolList() {
  const { positionInfo } = useGetPositionIds();

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
      {positionInfo?.map((position) => {
        return <PoolCard {...position} />;
      })}
    </Wrap>
  );
}
