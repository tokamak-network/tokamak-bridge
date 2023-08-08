import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { Flex, Text, Box } from "@chakra-ui/layout";
import Title from "../../add/components/Title";
import { PriceRangeInfo } from "@/pools/components/PriceRangeInfo";
import { useMintPositionInfo } from "@/hooks/pool/useMintPositionInfo";

export default function PriceRange() {
  const { info } = usePositionInfo();

  if (info === undefined) {
    return null;
  }

  return (
    <Flex
      w={"100%"}
      flexDir={"column"}
      justifyContent={"center"}
      textAlign={"center"}
      rowGap={"8px"}
    >
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Title title={"Price range"} style={{ marginBottom: 0 }} />
        <Flex minW={"250px"} justifyContent={"end"}>
          <Text color={info.inRange ? "#00EE98" : "#DD3A44"} fontSize={"11px"}>
            Your position is {info.inRange === false && "not"} currently earning
            fees.
          </Text>
        </Flex>
      </Flex>
      <PriceRangeInfo />
    </Flex>
  );
}
