import { Flex, Box, Text } from "@chakra-ui/react";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetPool, useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useRecoilState } from "recoil";
import { ATOM_addInverted } from "@/recoil/pool/positions";

export default function ToggleSwitch() {
  const { invertTokenPair } = useInOutTokens();
  const { pool } = useGetPool();
  const { invertPrice } = useV3MintInfo();
  const [inverted, setInvert] = useRecoilState(ATOM_addInverted);

  const onClick = () => {
    invertTokenPair();
    setInvert(!inverted);
  };

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
        h={"24px !important"}
        bg={!invertPrice ? "#313442" : "transparent"}
        borderRadius={!invertPrice ? "8px" : ""}
        onClick={onClick}
        alignItems={"center"}
      >
        <Text verticalAlign={"center"} lineHeight={"24px"}>
          {pool?.token0.symbol}
        </Text>
      </Box>
      <Box
        w={"50%"}
        h={"24px !important"}
        bg={invertPrice ? "#313442" : "transparent"}
        borderRadius={invertPrice ? "8px" : ""}
        onClick={onClick}
        alignItems={"center"}
      >
        <Text verticalAlign={"center"} lineHeight={"24px"}>
          {pool?.token1.symbol}
        </Text>
      </Box>
    </Flex>
  );
}
