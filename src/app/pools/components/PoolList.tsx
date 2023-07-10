import useGetPositionIds from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import { usePool } from "@/hooks/pool/usePool";
import IncreaseLiquidity from "./IncreaseLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
export default function PoolList() {
  const { positionInfo } = useGetPositionIds();
  const { poolData } = usePool();

  console.log(poolData);

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
      <IncreaseLiquidity/>
      <RemoveLiquidity/>
      {positionInfo?.map((position) => {
        return <PoolCard {...position} />;
      })}
    </Wrap>
  );
}
