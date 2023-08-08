import { usePool } from "@/hooks/pool/usePool";
import { PoolState } from "@/types/pool/pool";
import { Flex, Box, Text } from "@chakra-ui/layout";
import Title from "./Title";
import { Input } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { initialPrice } from "@/recoil/pool/setPoolPosition";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { trimAmount } from "@/utils/trim";
import { useState, useMemo } from "react";

export default function InitializeInfo() {
  const [poolStatus] = usePool();
  const [inputIntialPrice, setInitialPrice] = useRecoilState(initialPrice);
  const { inToken, outToken } = useInOutTokens();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const valueProp = useMemo(() => {
    if (Number(inputIntialPrice) === 0) return undefined;
    return isFocused ? inputIntialPrice : trimAmount(inputIntialPrice, 20);
  }, [isFocused, inputIntialPrice]);

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
          borderRadius={"4px"}
        >
          <Text fontSize={"13px"} textAlign={"left"} color={"#007AFF"}>
            This pool must be initialized before you can add liquidity. To
            initialize, select a starting price for the pool. Then, enter your{" "}
            liquidity price range and deposit amount. Gas fees will be higher
            than usual due to the initialization transaction.
          </Text>
        </Box>
        <Flex
          mt={"15px"}
          w={"100%"}
          h={"48px"}
          borderRadius={"8px"}
          border={"1px solid #313442"}
          alignItems={"center"}
          pr={"16px"}
        >
          <Input
            _hover={{}}
            _focus={{
              boxShadow: "none !important",
              border: "none !important",
            }}
            border={"none"}
            onChange={(e) => {
              console.log("?");
              setInitialPrice(e.target.value);
            }}
            value={valueProp ?? undefined}
            boxShadow={"none !important"}
            fontSize={18}
            fontWeight={500}
            pl={"16px"}
            pr={"18px"}
            py={"10px"}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
            _placeholder={{ color: "#C6C6D1" }}
            defaultValue={undefined}
          />
          <Text
            minW={"100px"}
            color={"#A0A3AD"}
            fontSize={14}
            verticalAlign={"center"}
            fontWeight={400}
          >
            {outToken?.tokenSymbol} per {inToken?.tokenSymbol}
          </Text>
        </Flex>
      </Flex>
    );

  return null;
}
