import { useGetPositions } from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import IncreaseLiquidity from "./IncreaseLiquidity";
import RemoveLiquidity from "./RemoveLiquidity";
export default function PoolList() {
  const { positions } = useGetPositions();

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
      <IncreaseLiquidity />
      <RemoveLiquidity />
      {positions?.map((position) => {
        return <PoolCard {...position} />;
      })}
    </Wrap>
  );
}
