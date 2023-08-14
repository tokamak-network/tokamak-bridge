import { Box, Flex, Text } from "@chakra-ui/react";

export function RangeText(props: { inRange: boolean; isClosed?: boolean }) {
  if (props.isClosed) {
    return (
      <Flex alignItems="center">
        <Box w="6px" h="6px" borderRadius="50%" bg={"#DD3A44"} mr="6px" />
        <Text fontSize={11} fontWeight={600} color={"#DD3A44"}>
          {"Closed"}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center">
      <Box
        w="6px"
        h="6px"
        borderRadius="50%"
        bg={props.inRange ? "#00EE98" : "#DD3A44"}
        mr="6px"
      />
      <Text
        fontSize={11}
        fontWeight={600}
        color={props.inRange ? "#00EE98" : "#DD3A44"}
      >
        {props.inRange ? "Earning Fees" : "Not Earning Fees"}
      </Text>
    </Flex>
  );
}
