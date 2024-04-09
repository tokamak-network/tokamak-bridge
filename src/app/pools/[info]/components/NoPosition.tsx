import { Button, Text, Flex, Link, Box } from "@chakra-ui/react";

export function NoPosition() {
  return (
    <Flex flexDir={"column"} mt={"280px"} alignItems={"center"}>
      <Text fontWeight={500} fontSize={28} h={"42px"} mb={"16px"}>
        Liquidity Unavailable Right Now
      </Text>
      <Flex
        fontWeight={400}
        fontSize={16}
        h={"62px"}
        mb={"40px"}
        flexDir={"column"}
        justifyContent={"space-around"}
      >
        <Flex alignItems={"center"} columnGap={"10px"}>
          <Box w={"6px"} h={"6px"} backgroundColor={"#A0A3AD"}></Box>
          <Text>
            Adding new liquidity to this page may take up to 10 seconds. Please
            refresh.
          </Text>
        </Flex>
        <Flex alignItems={"center"} columnGap={"10px"}>
          <Box w={"6px"} h={"6px"} backgroundColor={"#A0A3AD"}></Box>
          <Text>
            OR this liquidity does not exist on Ethereum or Titan, or it has
            been burned.
          </Text>
        </Flex>
      </Flex>
      <Link href={"/pools"}>
        <Button
          w={"200px"}
          h={"48px"}
          borderRadius={"8px"}
          bgColor={"#007AFF"}
          fontSize={16}
          _hover={{}}
          _active={{}}
        >
          Back to Pools
        </Button>
      </Link>
    </Flex>
  );
}
