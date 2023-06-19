import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { Flex, Text, Box } from "@chakra-ui/layout";
import Title from "../../add/components/Title";

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
      <Flex flexDir="column" alignItems={"center"}>
        <Flex>
          {/* <PriceInput
            isInputChange={false}
            value={minPrice}
            titleText="Min price"
            toolTip={true}
            toolTipLabel="Your position will be 100% ETH at this price."
            inToken={inToken}
            outToken={outToken}
            border={true}
          />
          <PriceInput
            isInputChange={false}
            value={maxPrice}
            titleText="Max price"
            toolTip={true}
            toolTipLabel="Your position will be 100% ETH at this price."
            inToken={inToken}
            outToken={outToken}
            border={true}
          /> */}
        </Flex>
        <Flex mt="10px">
          {/* <PriceInput
            isInputChange={false}
            value={currentPrice}
            titleText="Current price"
            toolTip={false}
            toolTipLabel=""
            inToken={inToken}
            outToken={outToken}
            border={false}
          /> */}
        </Flex>
      </Flex>
    </Flex>
  );
}
