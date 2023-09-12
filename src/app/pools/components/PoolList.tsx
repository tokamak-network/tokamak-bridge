import { useGetPositionIds } from "@/hooks/pool/useGetPositionIds";
import { Grid } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import EmptyCard from "./EmptyCard";
import { useAccount } from "wagmi";
import { useRecoilValue } from "recoil";
import { ATOM_positions_loading } from "@/recoil/pool/positions";

export default function PoolList() {
  const { positions } = useGetPositionIds();
  const { isConnected } = useAccount();
  const isLoading = useRecoilValue(ATOM_positions_loading);

  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      rowGap={"16px"}
      columnGap={"16px"}
      overflow={"hidden"}
    >
      <LPGuide />
      <AddLiquidity />
      {isLoading &&
        Array.from({ length: isConnected ? 7 : 4 }, (_, index) => (
          <EmptyCard key={index} />
        ))}
      {positions?.map((position) => {
        return <PoolCard key={position.id} {...position} />;
      })}
      {positions &&
        Array.from(
          {
            length:
              positions.length < 7
                ? 7 - positions.length
                : positions.length % 3 === 0
                ? 1
                : positions.length % 3 === 2
                ? 2
                : 0,
          },
          (_, index) => <EmptyCard key={index} noSpinner={true} />
        )}
    </Grid>
  );
}
