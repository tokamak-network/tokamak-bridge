import { useGetPositions } from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import EmptyCard from "./EmptyCard";
export default function PoolList() {
  const { positions, isLoading } = useGetPositions();

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
      {(positions === undefined || isLoading) &&
        Array.from({ length: 7 }, (_, index) => <EmptyCard key={index} />)}
      {positions?.map((position) => {
        return <PoolCard {...position} />;
      })}
    </Wrap>
  );
}
