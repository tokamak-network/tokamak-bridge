import { useGetPositionIds } from "@/hooks/pool/useGetPositionIds";
import { Grid } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import EmptyCard from "./EmptyCard";
import { useAccount } from "wagmi";
import { useRecoilValue } from "recoil";
import { ATOM_positions_loading } from "@/recoil/pool/positions";
import useConnectedNetwork from "@/hooks/network";

export default function PoolList() {
  const { positions } = useGetPositionIds();
  const { isConnected } = useAccount();
  const { isSupportedChain } = useConnectedNetwork();
  const isLoading = useRecoilValue(ATOM_positions_loading);

  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      rowGap={"16px"}
      columnGap={"16px"}
      overflow={"auto"}
      scrollBehavior={"initial"}
      //for scrollbar styles
      pr={"8px"}
      css={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "::-webkit-scrollbar-track": {
          background: "transparent",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#343741",
          borderRadius: "3px",
        },
      }}
    >
      {/* <LPGuide /> */}
      <AddLiquidity />
      {isSupportedChain &&
        positions === undefined &&
        Array.from({ length: isConnected ? 8 : 4 }, (_, index) => (
          <EmptyCard key={index} noSpinner={!isLoading} />
        ))}
      {(!isSupportedChain || !isConnected) &&
        Array.from({ length: 5 }, (_, index) => (
          <EmptyCard key={index} noSpinner={true} />
        ))}
      {isSupportedChain &&
        positions?.map((position) => {
          return (
            <PoolCard
              key={`${position.chainId}__${position.id}`}
              {...position}
            />
          );
        })}
      {positions &&
        Array.from(
          {
            length:
              positions.length < 5
                ? 5 - positions.length
                : positions.length % 3 === 1
                  ? 1
                  : positions.length % 3 === 2
                    ? 0
                    : 2,
          },
          (_, index) => <EmptyCard key={index} noSpinner={!isLoading} />,
        )}
    </Grid>
  );
}
