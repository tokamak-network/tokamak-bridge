import { Button, Center, Text, Flex, Link } from "@chakra-ui/react";

export function NoPosition() {
  return (
    <Flex flexDir={"column"} mt={"280px"} alignItems={"center"}>
      <Text fontWeight={500} fontSize={32} h={"48px"}>
        Position Unavailable
      </Text>
      <Text fontWeight={400} fontSize={16} h={"24px"} mt={"8px"} mb={"40px"}>
        This position either does not exist on Ethereum or Titan or has been
        burned.
      </Text>
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
