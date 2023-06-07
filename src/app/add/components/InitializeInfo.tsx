import { Flex, Box, Text } from "@chakra-ui/layout";

export default function InitializeInfo() {
  return (
    <>
      <Flex flexDir="row" mb={"20px"}>
        <Text>Set Price Range</Text>
      </Flex>
      <Box px={"14px"} py={"16px"} w={"384px"} bgColor={"#1F2128"}>
        <Text fontSize={"13px"} textAlign={"left"} color={"#007AFF"}>
          This pool must be initialized before you can add liquidity. To
          initialize, select a starting price for the pool. Then, enter your{" "}
          liquidity price range and depositamount. Gas fees will be higher than{" "}
          usual due to the initialization transaction.
        </Text>
      </Box>
    </>
  );
}
