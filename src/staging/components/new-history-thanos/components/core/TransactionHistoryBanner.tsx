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
        New Transactions are not reflected
      </Text>
    </Flex>
  );
};
