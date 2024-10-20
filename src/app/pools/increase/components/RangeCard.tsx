import { Flex, Text, Box } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/react";
import { QuestionOutlineIcon } from "@chakra-ui/icons";

export default function RangeCard(props: {
  border: boolean;
  tooltip: string;
  title: string;
  price: string;
  token1: string;
  token0: string;
}) {
  const { border, tooltip, title, price, token1, token0 } = props;

  return (
    <Flex
      h="96px"
      w="176px"
      border={border ? "1px solid #313442" : ""}
      flexDir={"column"}
      rowGap={"8px"}
      py="10px"
      mt={!border ? "5px" : ""}
      borderRadius={"12px"}
    >
      <Flex
        color={"#A0A3AD"}
        justifyContent={"center"}
        alignItems={"center"}
        fontSize={"12px"}
      >
        <Text mr="3px">{title}</Text>
        {tooltip && (
          <Tooltip label={tooltip} fontSize="md">
            <QuestionOutlineIcon h="12px" />
          </Tooltip>
        )}
      </Flex>
      <Text lineHeight="24px" color={"#FFF"} fontSize={"20px"}>
        {price}
      </Text>
      <Text fontSize={"12px"} color={"#A0A3AD"} mr="3px">
        {token0} per {token1}
      </Text>
    </Flex>
  );
}
