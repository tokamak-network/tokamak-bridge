import { Flex, Box, Text } from "@chakra-ui/react";
import TokenPair from "@/components/historyn/components/TokenPair";
import { TokenSymbol } from "@/componenets/image/TokenSymbol";
import { TransactionHistory } from "@/componenets/historyn/types";

export default function Complete(transaction: TransactionHistory) {
  const transactionData = transaction;

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={500}
          fontSize={"12px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          {transactionData.action} completed
        </Text>
        <TokenPair
          networkI={transactionData.inNetwork}
          networkO={transactionData.outNetwork}
          networkW={16}
          networkH={16}
        />
      </Flex>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"12px"}
        py={"4px"}
        my={"4px"}
        borderRadius={"6px"}
        border={"1px solid rgba(0, 122, 255, 0.40)"}
      >
        <Flex alignItems='center'>
          <TokenSymbol w={22} h={22} tokenType={transactionData.tokenSymbol} />
          <Box ml={"6px"}>
            <Text
              fontWeight={400}
              fontSize={"9px"}
              lineHeight={"13.5px"}
              color={"#A0A3AD"}
            >
              {transactionData.tokenSymbol}
            </Text>
            <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
              {transactionData.amount}
            </Text>
          </Box>
        </Flex>
        <Text
          fontWeight={400}
          fontSize={"11px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          2023.04.03
        </Text>
      </Flex>
    </>
  );
}
