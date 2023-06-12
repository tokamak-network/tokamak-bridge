import { Flex, Text } from "@chakra-ui/layout";
import PriceInput from "@/app/add/components/PriceInput";

type PriceRangeProps = {
  title: string;
  inToken: string;
  outToken: string;
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  inRange: boolean;
};

export default function PriceRange(props: PriceRangeProps) {
  const {
    title,
    inToken,
    outToken,
    minPrice,
    maxPrice,
    currentPrice,
    inRange,
  } = props;
  return (
    <Flex w="384px" flexDir={"column"}>
      <Flex justifyContent={"space-between"} mb={"8px"}>
        <Flex justifyContent={"start"}>{title}</Flex>
        <Flex justifyContent={"end"}>
          {inRange === false ? (
            <Text color="#DD3A44" fontSize={"11px"}>
              Your position is not currently earning fees.
            </Text>
          ) : (
            <Text color="#00EE98" fontSize={"11px"}>
              Your position is currently earning fees.
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex flexDir="column" alignItems={"center"}>
        <Flex>
          <PriceInput
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
          />
        </Flex>
        <Flex>
          <PriceInput
            isInputChange={false}
            value={currentPrice}
            titleText="Current price"
            toolTip={false}
            toolTipLabel=""
            inToken={inToken}
            outToken={outToken}
            border={false}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}
