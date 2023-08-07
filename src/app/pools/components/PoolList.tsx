import { useGetPositions } from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";
import PoolCard from "./PoolCard";
import EmptyCard from "./EmptyCard";
import { useAccount } from "wagmi";
import { css } from "@emotion/react";

const customWrapStyle = css`
& > *:nth-of-type(n + 2) {
    margin-top: 10px; /* Adjust the spacing as per your requirement */
  }
`;

export default function PoolList() {
  const { positions } = useGetPositions();
  const { isConnected } = useAccount();

  return (
    <Wrap>
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
    </Wrap>
  );
}
