import { useGetPositions } from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";

export default function PoolList() {
  const { positions } = useGetPositions();

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
      {positions?.map((position) => {
        return <PoolCard {...position} />;
      })}
    </Wrap>
  );
}
