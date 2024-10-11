import { TokenInfo } from "types/token/supportedToken";
import { Box, Button, Flex, Text, useTheme, HStack } from "@chakra-ui/react";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { useCallback, useMemo, useState } from "react";
import useAddTokenToStorage from "@/hooks/storage/useAddTokenToStorage";
import { isETH } from "@/utils/token/isETH";
import "@fontsource/quicksand/500.css";

type TokenCardSizeType = "small" | "medium" | "large";

type TokenCardProps = {
  tokenInfo: TokenInfo;
  isNew?: boolean;
  symbolSize?: {
    w: number;
    h: number;
  };
  onAddToken?: () => void;
};

const TopLine = (props: { mainSchemCol: string }) => {
  return (
    <>
      <Box
        pos={"absolute"}
        w={"400px"}
        h={"100px"}
        top={"-83px"}
        left={"-100px"}
        bg={props.mainSchemCol}
        transform={"rotate(-30deg)"}
        opacity={0.15}
      ></Box>
      <Box
        pos={"absolute"}
        w={"400px"}
        h={"4.63px"}
        top={"15px"}
        left={"-100px"}
        bg={"rgba(255, 255, 255, 0.5)"}
        transform={"rotate(-30deg)"}
      ></Box>
      <Box
        pos={"absolute"}
        w={"400px"}
        h={"47px"}
        top={"28px"}
        left={"-100px"}
        bg={`linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)`}
        transform={"rotate(-30deg)"}
      ></Box>
      {/* <Box
        pos={"absolute"}
        w={"400px"}
        h={"20px"}
        top={"25px"}
        left={"-100px"}
        bg={`linear-gradient(180deg, #fff, props.mainSchemCol)`}
        transform={"rotate(-30deg)"}
      ></Box> */}
    </>
  );
};

export default function TokenMobileCard(props: TokenCardProps) {
  const { tokenInfo, isNew, symbolSize, onAddToken } = props;
  const [agreeToAdd, setAgreeToAdd] = useState<boolean>(false);

  const tokenColorCode = useMemo(() => {
    switch (tokenInfo?.tokenSymbol) {
      case "ETH":
        return "#627EEA";
      case "WETH":
        return "#393939";
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
      case "USDT":
        return "#50AF95";
      default:
        return "#9e9e9e";
    }
  }, [tokenInfo]);

  const thisTokenIsETH = isETH(tokenInfo);
  const theme = useTheme();

  const { addNewToken } = useAddTokenToStorage();
  const notAdded = isNew && agreeToAdd === false;
  const addNewCard = useCallback(() => {
    addNewToken(tokenInfo);
    setAgreeToAdd(true);
    if (onAddToken) {
      onAddToken();
    }
  }, [agreeToAdd]);

  return (
    <Flex
      width="auto"
      maxWidth={"250px"}
      height="auto"
      bg={`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${tokenColorCode};`}
      border={`3px solid ${tokenColorCode} `}
      borderRadius={"16px"}
      pos={"relative"}
      pt={"12px"}
      pb={"13px"}
      px={"12px"}
      overflow={"hidden"}
      flexDir={"column"}
      justifyContent={"space-between"}
      fontFamily={theme.fonts.Quicksand}
    >
      <TopLine mainSchemCol={tokenColorCode} />
      <HStack justifyContent="space-between" width="100%" px={4} py={2}>
        <Box width="50%">
          <Text
            fontWeight={700}
            fontSize={20}
            zIndex={100}
            color={"#222222"}
            isTruncated={false}
            lineHeight={"tight"}
            textAlign="left"
          >
            {thisTokenIsETH
              ? "Ethereum"
              : tokenInfo?.tokenSymbol === "WETH"
              ? "Wrapped Ethereum"
              : tokenInfo?.tokenName ?? "TOKEN"}
          </Text>
        </Box>
        <Text
          fontWeight={400}
          fontSize={16}
          zIndex={100}
          color={"#222222"}
          textAlign="right"
        >
          {tokenInfo?.tokenSymbol ?? "TOK"}
        </Text>
      </HStack>
      <Flex
        h={"100%"}
        justifyContent={"center"}
        alignItems={"baseline"}
        my={"10px"}
      >
        <TokenSymbol
          w={symbolSize?.w ?? 48}
          h={symbolSize?.w ?? 48}
          tokenType={tokenInfo?.tokenSymbol}
        />
      </Flex>
      <Flex flexDir={"column"} alignItems={"center"}>
        <Text fontSize={12} fontWeight={400} color={"#222222"} w={"206px"}>
          This token isn’t traded on leading U.S. centralized exchanges or
          frequently swapped on Tokamak Bridge. Always conduct your own research
          before trading.
        </Text>
        <Button
          w={"136px"}
          h={"38px"}
          my={"20px"}
          bg={"#007AFF"}
          cursor={"pointer"}
          _hover={{}}
          _active={{}}
          fontSize={16}
          fontWeight={600}
          onClick={addNewCard}
        >
          <Text fontSize={"14px"} fontWeight={600}>
            I Agree
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
}
