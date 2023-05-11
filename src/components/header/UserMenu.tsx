import { Box, Flex } from "@chakra-ui/layout";

const Dots = () => {
  return <Box w={"6px"} h={"6px"} bgColor={"#ffffff"} borderRadius={25} />;
};

export default function UserMenu() {
  return (
    <Flex
      className="header-right-common"
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      rowGap={"6px"}
      w={"34px"}
      h={"48px"}
    >
      <Dots />
      <Dots />
      <Dots />
    </Flex>
  );
}
