import { Flex } from "@chakra-ui/layout";
import { Box, keyframes } from "@chakra-ui/react";
import { useAccount } from "wagmi";

const gradientAnimation = keyframes`
  0% { background-position: 0% 200%; }
  100% { background-position: 0% -200%; }
`;

const GradientSpinner = () => {
  return (
    <Box
      w="100%"
      h="100%"
      bgGradient="linear(to-b, #1c1d25 8%, #2b2f42 26%, #1c1d25 54%)"
      bgSize="100% 200%"
      borderRadius={"8px"}
      animation={`${gradientAnimation} 6s linear infinite`}
    />
  );
};

export default function EmptyCard(props: { noSpinner?: boolean }) {
  const { isConnected } = useAccount();

  return (
    <Flex
      flexDir="column"
      bgColor="#15161D"
      w="200px"
      h="248px"
      borderRadius={"16px"}
    >
      {!props.noSpinner && isConnected && <GradientSpinner />}
    </Flex>
  );
}
