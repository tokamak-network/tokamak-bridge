import { Flex } from "@chakra-ui/layout";
import { Box, keyframes } from "@chakra-ui/react";

const gradientAnimation = keyframes`
100% { background-position: -300% 0%; }
0% { background-position: 300% 0%; }
`;

const GradientSpinner = () => {
  return (
    <Box
      w="100%"
      h="100%"
      bgGradient="linear(to-r, #15161D 10%, #2b2f42 40%, #15161D 90%)"
      bgSize="200% 100%"
      borderRadius={"8px"}
      animation={`${gradientAnimation} 2s linear infinite`}
    />
  );
};

export default function LoadingTx() {
  return (
    <Flex
      h={{ base: "73px", lg: "160px" }}
      w={{ baes: "100%", lg: "336px" }}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
      flexDir={"column"}
      rowGap={"8px"}
    >
      <GradientSpinner />
    </Flex>
  );
}
