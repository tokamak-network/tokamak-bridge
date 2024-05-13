import { Flex, Text } from "@chakra-ui/layout";
import Title from "../../add/components/Title";
import { PriceRangeInfo } from "@/pools/components/PriceRangeInfo";
import { PoolCardDetail } from "../../components/PoolCard";
import { useGetMode } from "@/hooks/mode/useGetMode";

export default function PriceRange(props: {
  info: PoolCardDetail | undefined;
}) {
  const { info } = props;
  const { subMode } = useGetMode();

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
        <Title title={"Price Range"} style={{ marginBottom: 0 }} />
        <Flex minW={"250px"} justifyContent={"end"}>
          {!subMode.add && (
            <Text
              color={info.inRange ? "#00EE98" : "#DD3A44"}
              fontSize={"11px"}
            >
              Your position is {info.inRange === false && "not"} currently
              earning fees.
            </Text>
          )}
        </Flex>
      </Flex>
      <PriceRangeInfo />
    </Flex>
  );
}
