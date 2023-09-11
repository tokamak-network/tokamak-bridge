import { Box, Flex, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

export function RangeText(props: {
  inRange: boolean;
  isClosed?: boolean;
  style?: CSSProperties;
}) {
  if (props.isClosed) {
    return (
      <Flex alignItems="center">
        <Box w="6px" h="6px" borderRadius="50%" bg={"#A0A3AD"} mr="6px" />
        <Text fontSize={11} fontWeight={600} color={"#A0A3AD"}>
          {"Closed"}
        </Text>
      </Flex>
    );
  }

  return (
    <Flex alignItems="center" fontSize={11} style={props.style}>
      <Box
        w="6px"
        h="6px"
        borderRadius="50%"
        bg={props.inRange ? "#00EE98" : "#DD3A44"}
        mr="6px"
      />
      <Text fontWeight={600} color={props.inRange ? "#00EE98" : "#DD3A44"}>
        {props.inRange ? "Earning Fees" : "Not Earning Fees"}
      </Text>
    </Flex>
  );
}
