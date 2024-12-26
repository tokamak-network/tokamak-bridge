import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export const TransactionHistoryBanner: React.FC = () => {
  return (
    <Flex
      px={"16px"}
      py={"12px"}
      backgroundColor={"#DD3A44"}
      borderRadius={"8px 8px 8px 8px"}
    >
      <Text
        color={"#FFFFFF"}
        fontSize={"12px"}
        fontWeight={400}
        lineHeight={"normal"}
      >
        Only finalize withdraw function and its history is supported here. L1
        claim transaction history will not show here.
      </Text>
    </Flex>
  );
};
