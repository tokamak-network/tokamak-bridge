import { Flex, Box, Text, Circle } from "@chakra-ui/react";

export default function PendingFooter() {
  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex alignItems='center'>
          <Circle size='6px' bg={"#007AFF"} />
          <Text
            ml={"6px"}
            fontSize={"11px"}
            fontWeight={600}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            Initiate
          </Text>
        </Flex>
        <Text
          fontSize={"11px"}
          fontWeight={400}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          2023.04.03
        </Text>
      </Flex>
      {/* 반복되는 내용 */}
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex alignItems='center'>
          <Circle size='6px' bg={"#007AFF"} />
          <Text
            ml={"6px"}
            fontSize={"11px"}
            fontWeight={600}
            lineHeight={"22px"}
            color={"#A0A3AD"}
          >
            Finalize
          </Text>
        </Flex>
        <Text
          fontSize={"11px"}
          fontWeight={400}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          00 : 00
        </Text>
      </Flex>
    </>
  );
}
