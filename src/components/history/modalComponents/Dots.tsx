import { Flex, Box } from "@chakra-ui/react";


const Dots = (props: { progress?: string; color?: string }) => {
  const { progress, color } = props;

  return (
    <Flex flexDir={"column"} rowGap={"6px"} w={"full"} justify={"center"} align={"center"} mt={3}>
      <Flex bg={"#FFFFFF"} height={"2px"} w="2px">
        {" "}
      </Flex>
      <Flex bg={"#FFFFFF"} height={"2px"} w="2px">
        {" "}
      </Flex>
      <Flex bg={"#FFFFFF"} height={"2px"} w="2px">
        {" "}
      </Flex>
    </Flex>
  );
};

export default Dots;
