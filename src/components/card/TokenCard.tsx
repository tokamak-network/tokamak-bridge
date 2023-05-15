import { SupportedToken } from "@/types/token/supportedToken";
import { Box, Flex, Text } from "@chakra-ui/react";

type TokenCardProps = {
  tokenName?: SupportedToken | string;
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
  return (
    <Flex
      w={typeof w === "string" ? w : `${w ?? 208}px`}
      height={typeof h === "string" ? h : `${h ?? 270}px`}
      bg={
        "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), #9E9E9E;"
      }
      opacity={0.85}
      border={"3px solid #9E9E9E"}
      borderRadius={"16px"}
      pos={"relative"}
      pt={"24px"}
      pl={"16px"}
      overflow={"hidden"}
      {...style}
    >
      <TopLine />
      <TokenTitle tokenName={tokenName ?? "TOKEN"} />
    </Flex>
  );
}
