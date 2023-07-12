import { usePool } from "@/hooks/pool/usePool";
import { PoolState } from "@/types/pool/pool";
import { Flex, Box, Text } from "@chakra-ui/layout";
import Title from "./Title";
import { Input } from "@chakra-ui/react";

export default function InitializeInfo() {
  const [poolStatus] = usePool();

  if (poolStatus === PoolState.NOT_EXISTS)
    return (
      <Flex flexDir={"column"}>
        <Title title="Set Starting Price" />
        <Box
          px={"14px"}
          py={"16px"}
          w={"384px"}
          bgColor={"#1F2128"}
          // maxH={"89px"}
        >
          <Text fontSize={"13px"} textAlign={"left"} color={"#007AFF"}>
            This pool must be initialized before you can add liquidity. To
            initialize, select a starting price for the pool. Then, enter your{" "}
            liquidity price range and deposit amount. Gas fees will be higher
            than usual due to the initialization transaction.
          </Text>
        </Box>
        <Input
          mt={"15px"}
          w={"100%"}
          h={"48px"}
          borderRadius={"8px"}
          border={"1px solid #313442"}
          _focus={{
            boxShadow: "none !important",
          }}
          boxShadow={"none !important"}
          fontSize={18}
          fontWeight={500}
          px={"16px"}
          py={"10px"}
        />
      </Flex>
    );

  return null;
}
