import { Flex, Box, Text, Button, Divider } from "@chakra-ui/react";
import TokenNetwork from "@/components/ui/TokenNetwork";
import Link from "next/link";
import AddIcon from "@/assets/icons/addIcon.svg";
import RemoveIcon from "@/assets/icons/removeIcon.svg";
import Image from "next/image";

type LiquidityInfo = {
  // liquidity
  // inputTokenAmount
  // outTokenAmount
  // slippage
};

export default function LiquidityInfo() {
  return (
    <Box
      bg="#1F2128"
      w="384px"
      h="213px"
      py="16px"
      px="16px"
      borderRadius={"12px"}
      mt={"16px"}
      alignItems="center"
    >
      <Flex flexDir="column" alignItems={"center"}>
        <Flex>
          <Flex flexDir={"column"} alignItems={"center"} mr={"35px"}>
            <Text color="#A0A3AD" mb={"17px"}>
              Remove
            </Text>
            <Link href="/remove">
              <Button
                bg="#15161D"
                _hover={{ bgColor: "#15161D", border: "1px solid #007AFF" }}
                mr={"7px"}
              >
                <Image src={RemoveIcon} alt={"RemoveLiquidity"} />
              </Button>
            </Link>
          </Flex>
          <Flex flexDir={"column"} alignItems={"center"} mr={"35px"}>
            <Text fontSize={"16px"} mb={"17px"} as="b">
              Liquidity
            </Text>
            <Text fontSize={"38px"} as="b">
              $4.30
            </Text>
          </Flex>
          <Flex flexDir={"column"} alignItems={"center"}>
            <Text color="#A0A3AD" mb={"20px"}>
              Increase
            </Text>
            <Link href="/increase">
              <Button
                bg="#15161D"
                _hover={{ bgColor: "#15161D", border: "1px solid #007AFF" }}
                ml={"7px"}
              >
                <Image src={AddIcon} alt={"IncreaseLiquidity"} />
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Divider style={{ border: "1px solid #313442" }} />
        <Flex flexDir={"column"} textAlign={"center"} justifyItems={"center"}>
          <Flex py="12px" justifyContent="space-between">
            <Flex justifyContent="start" mr={"118px"}>
              <TokenNetwork tokenType="LYDA" network="Ethereum" />
              <Text ml="12px" color="#A0A3AD">
                LYDA
              </Text>
            </Flex>
            <Flex justifyContent="end">
              <Text color="#A0A3AD" fontSize="18px">
                0.001403
              </Text>
              <Flex bgColor={"#15161D"} borderRadius={8} padding={1} ml={2}>
                <Text fontSize={"12px"} as="b">
                  {"30%"}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Flex justifyContent="start" mr={"118px"}>
              <TokenNetwork tokenType="USDC" network="Ethereum" />
              <Text ml="12px" color="#A0A3AD" fontSize="18px">
                USDC
              </Text>
            </Flex>
            <Flex justifyContent="end">
              <Text color="#A0A3AD" fontSize="18px">
                0.001403
              </Text>
              <Flex bgColor={"#15161D"} borderRadius={8} padding={1} ml={2}>
                <Text fontSize={"12px"} as="b">
                  30%
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
