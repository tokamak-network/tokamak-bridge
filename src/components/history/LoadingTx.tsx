import { Flex } from "@chakra-ui/layout";
import { Box, keyframes } from "@chakra-ui/react";

const gradientAnimation = keyframes`
0% { background-position: 0% 0%; }
100% { background-position: 100% 0%; }
`;

const GradientSpinner = () => {
  return (
    <Box
      w="100%"
      h="100%"
      bgGradient="linear(to-b, #15161D 8%, #2b2f42 26%, #15161D 54%)"
      bgSize="100% 200%"
      borderRadius={"8px"}
      animation={`${gradientAnimation} 6s linear infinite`}
    />
  );
};

export default function LoadingTx () {
return (
    <Flex
    h={"160px"}
    w="336px"
    borderRadius={"8px"}
    border={"1px solid #313442"}
    bg={"#15161D"}
  
    flexDir={"column"}
    rowGap={"8px"}
  >
    <GradientSpinner/>

  </Flex>
)
    
}