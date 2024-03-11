import { Flex, Box } from "@chakra-ui/react";


const Line = (props: { progress: string; color: string }) => {
  const { progress, color } = props;

  return (
    <Flex flexDir={"column"} rowGap={"6px"} pl="6px">
      <Box height={"46px"} w={"1px"} bgColor={"#313442"} />
      {/* <Flex bg={color} height={"2px"} w="2px">
        {" "}
      </Flex>
      <Flex bg={color} height={"2px"} w="2px">
        {" "}
      </Flex>
      <Flex bg={color} height={"2px"} w="2px">
        {" "}
      </Flex> */}
    </Flex>
  );
};

export default Line;
