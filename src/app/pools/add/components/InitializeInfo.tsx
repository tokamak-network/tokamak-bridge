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
import useIsTon from "@/hooks/token/useIsTon";

export default function InitializeInfo() {
  const [poolStatus, pool] = usePool();
  const [inputIntialPrice, setInitialPrice] = useRecoilState(initialPrice);
  const { inToken, outToken } = useInOutTokens();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { isTONatPair } = useIsTon();

  const valueProp = useMemo(() => {
    if (Number(inputIntialPrice) === 0) return undefined;
    return isFocused ? inputIntialPrice : trimAmount(inputIntialPrice, 21);
  }, [isFocused, inputIntialPrice]);

  if (poolStatus === PoolState.NOT_EXISTS && !isTONatPair)
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
          px={"16px"}
        >
          <Input
            _hover={{}}
            _focus={{
              boxShadow: "none !important",
              border: "none !important",
            }}
            minW={"202px"}
            maxW={"202px"}
            border={"none"}
            onChange={(e) => {
              setInitialPrice(e.target.value);
            }}
            p={0}
            value={valueProp === undefined ? "" : valueProp}
            boxShadow={"none !important"}
            fontSize={18}
            fontWeight={500}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="0"
            _placeholder={{ color: "#C6C6D1" }}
            defaultValue={undefined}
          />
          <Text
            minW={"150px"}
            maxW={"150px"}
            color={"#A0A3AD"}
            fontSize={14}
            verticalAlign={"center"}
            fontWeight={400}
            textAlign={"right"}
          >
            {outToken?.tokenSymbol} per {inToken?.tokenSymbol}
          </Text>
        </Flex>
      </Flex>
    );

  return null;
}
