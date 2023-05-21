import { Button, Flex, Input, Text } from "@chakra-ui/react";

export default function TokenInput(props: { style?: {} }) {
  const { style } = props;
  return (
    <Flex flexDir={"column"} rowGap={"16px"} {...style}>
      <Flex justifyContent={"space-between"}>
        <Input
          w={"153px"}
          h={"25px"}
          m={0}
          p={0}
          border={{}}
          _active={{}}
          _focus={{}}
          placeholder="0"
          color={"#ffffff"}
          fontSize={28}
          fontWeight={700}
        ></Input>
        <Button
          w={"40px"}
          h={"22px"}
          bgColor={"#6a00f1"}
          fontSize={12}
          fontWeight={700}
          _hover={{}}
          _active={{}}
          mt={"3px"}
        >
          Max
        </Button>
      </Flex>
      <Flex w={"100%"} justifyContent={"flex-start"}>
        <Text fontSize={13} fontWeight={500} color={"#ffffff"} opacity={0.8}>
          $0.00
        </Text>
      </Flex>
    </Flex>
  );
}
