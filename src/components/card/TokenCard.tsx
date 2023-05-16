import { SupportedToken } from "@/types/token/supportedToken";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Dropdown from "../dropdown/Index";
import { TokenSymbol } from "../image/TokenSymbol";
import { useMemo } from "react";

type TokenCardProps = {
  tokenName: SupportedToken | string;
  w?: string | number;
  h?: string | number;
  style?: {};
};

const TopLine = () => {
  return (
    <Box
      pos={"absolute"}
      w={"400px"}
      h={"4.63px"}
      top={"-17px"}
      left={"-30px"}
      bg={"rgba(255, 255, 255, 0.5)"}
      transform={"rotate(-30deg)"}
    ></Box>
  );
};

const TokenTitle = (props: { tokenName: string }) => {
  return (
    <Text
      w={"60px"}
      h={"13px"}
      fontSize={18}
      fontWeight={700}
      color={"#222222"}
    >
      {props.tokenName.toUpperCase()}
    </Text>
  );
};

export default function TokenCard(props: TokenCardProps) {
  const { tokenName, w, h, style } = props;
  const tokenColorCode = useMemo(() => {
    switch (tokenName as SupportedToken) {
      case "ETH":
        return "#222222";
      case "TON":
        return "#007AFF";
      case "WTON":
        return "#007AFF";
      case "TOS":
        return "#007AFF";
      case "DOC":
        return "#9e9e9e";
      case "AURA":
        return "#CB1000";
      case "LYDA":
        return "#4361EE";
      case "USDC":
        return "#2775CA";
      default:
        return "#9e9e9e";
    }
  }, [tokenName]);

  return (
    <Flex
      w={typeof w === "string" ? w : `${w ?? 208}px`}
      height={typeof h === "string" ? h : `${h ?? 270}px`}
      bg={`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${tokenColorCode};`}
      opacity={0.85}
      border={`3px solid ${tokenColorCode} `}
      borderRadius={"16px"}
      pos={"relative"}
      pt={"24px"}
      overflow={"hidden"}
      flexDir={"column"}
      px={"16px"}
      {...style}
    >
      <TopLine />
      <Flex justifyContent={"space-between"} w={"100%"}>
        <TokenTitle tokenName={tokenName ?? "TOKEN"} />
        <Dropdown />
      </Flex>
      <Flex
        pt={"25px"}
        pb={"37px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TokenSymbol tokenType={tokenName} />
      </Flex>
      <Flex flexDir={"column"} rowGap={"13px"}>
        <Flex fontSize={11} h={"8px"}>
          <Text>Blaance : </Text>
          <Text>0</Text>
        </Flex>
        <Flex justifyContent={"space-between"}>
          <Text>5000.00</Text>
          <Button>Max</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
