import { useGetPositions } from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import EmptyCard from "./EmptyCard";
import { useAccount } from "wagmi";
export default function PoolList() {
  const { positions } = useGetPositions();
  const { isConnected } = useAccount();

  // console.log(positions && 8 % 3 === 2일때2개, 0일때 1개);

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
      {positions === undefined &&
        Array.from({ length: isConnected ? 7 : 4 }, (_, index) => (
          <EmptyCard key={index} />
        ))}
      {positions?.map((position) => {
        return <PoolCard {...position} />;
      })}
      {positions &&
        Array.from(
          {
            length:
              positions.length === 1
                ? 3
                : positions.length % 3 === 0
                ? 1
                : positions.length % 3 === 2
                ? 2
                : 0,
          },
          (_, index) => <EmptyCard key={index} noSpinner={true} />
        )}
    </Wrap>
  );
}
