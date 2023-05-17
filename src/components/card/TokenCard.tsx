import { SupportedToken, TokenInfo } from "@/types/token/supportedToken";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Dropdown from "../dropdown/Index";
import { TokenSymbol } from "../image/TokenSymbol";
import { useMemo } from "react";

type TokenCardProps = {
  tokenInfo: TokenInfo;
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

const TokenTitle = (props: { tokenName: String }) => {
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
  const { tokenInfo, w, h, style } = props;
  const tokenColorCode = useMemo(() => {
    switch (tokenInfo?.tokenName) {
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
  }, [tokenInfo]);

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
      cursor={"pointer"}
      {...style}
    >
      <TopLine />
      <Flex justifyContent={"space-between"} w={"100%"}>
        <TokenTitle tokenName={tokenInfo?.tokenName ?? "TOKEN"} />
        <Dropdown />
      </Flex>
      <Flex
        pt={"25px"}
        pb={"37px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TokenSymbol tokenType={tokenInfo?.tokenName} />
      </Flex>
      <Flex flexDir={"column"} rowGap={"13px"}>
        <Flex fontSize={11} h={"8px"} color={"#222222"} columnGap={"2px"}>
          <Text fontWeight={400}>Blaance : </Text>
          <Text fontWeight={700}>0</Text>
        </Flex>
        <Flex justifyContent={"space-between"}>
          <Text
            // fontSize={36}
            color={"#222222"}
            fontWeight={700}
          >
            5000.00
          </Text>
          <Button
            w={"40px"}
            h={"22px"}
            bgColor={"#6a00f1"}
            fontSize={12}
            fontWeight={700}
          >
            Max
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
