import { Flex, Box, Text } from "@chakra-ui/react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { usePool } from "@/hooks/pool/usePool";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";

export default function ToggleSwitch() {
  const { invertTokenPair } = useInOutTokens();
  const [, pool] = usePool();
  const { invertPrice } = useV3MintInfo();

  return (
    <Flex
      w={"96px"}
      h={"24px"}
      border={"1px solid #313442"}
      borderRadius={"8px"}
      fontSize={11}
      fontWeight={600}
      textAlign={"center"}
      alignItems={"center"}
      cursor={"pointer"}
      lineHeight={"22px"}
    >
      <Box
        w={"50%"}
        h={"100%"}
        bg={!invertPrice ? "#313442" : "transparent"}
        borderRadius={!invertPrice ? "8px" : ""}
        onClick={invertTokenPair}
      >
        <Text>{pool?.token0.name}</Text>
      </Box>
      <Box
        w={"50%"}
        bg={invertPrice ? "#313442" : "transparent"}
        borderRadius={invertPrice ? "8px" : ""}
        onClick={invertTokenPair}
      >
        <Text>{pool?.token1.name}</Text>
      </Box>
    </Flex>
  );
}
