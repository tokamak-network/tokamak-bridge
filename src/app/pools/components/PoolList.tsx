import useGetPositionIds from "@/hooks/pool/useGetPositionIds";
import { Wrap } from "@chakra-ui/react";
import LPGuide from "./LPGuide";
import AddLiquidity from "./AddLiquidity";

export default function PoolList() {
  const { positionInfo } = useGetPositionIds();

  console.log(positionInfo);

  return (
    <Wrap spacing="16px">
      <LPGuide />
      <AddLiquidity />
    </Wrap>
  );
}
