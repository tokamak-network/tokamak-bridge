import { Flex } from "@chakra-ui/react";

const Dots = (props: { progress: string; color: string }) => {
  const { progress, color } = props;

  return (
    <Flex flexDir={"column"} rowGap={"6px"} pl="6px">
      <Flex bg={color} height={"2px"} w="2px">
        {" "}
      </Flex>
      <Flex bg={color} height={"2px"} w="2px">
        {" "}
      </Flex>
      <Flex bg={color} height={"2px"} w="2px">
        {" "}
      </Flex>
    </Flex>
  );
};

export default Dots;
