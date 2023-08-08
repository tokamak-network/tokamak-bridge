import { TokenInfo } from "types/token/supportedToken";
import { Box, Button, Flex, Text, TextProps } from "@chakra-ui/react";
import { TokenSymbol } from "../image/TokenSymbol";
import { useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import useAddTokenToStorage from "@/hooks/storage/useAddTokenToStorage";
import { type } from "os";

type TokenCardSizeType = "small" | "medium" | "large";

type TokenCardProps = {
  tokenInfo: TokenInfo;
  w?: string | number;
  h?: string | number;
  hasInput: boolean;
  inNetwork: boolean;
  isNew?: boolean;
  symbolSize?: {
    w: number;
    h: number;
  };
  onClick?: () => any;
  style?: {};
  type?: TokenCardSizeType;
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

const TokenTitle = (props: {
  tokenName: String;
  isName: boolean;
  style?: TextProps;
}) => {
  const { style } = props;
  return (
    <Text
      w={props.isName ? "100px" : "60px"}
      fontSize={props.isName ? 18 : 14}
      fontWeight={props.isName ? 700 : 400}
      color={"#222222"}
      textAlign={props.isName ? "left" : "right"}
      lineHeight={props?.isName ? "20px" : ""}
      zIndex={100}
      {...props.style}
    >
      {/* {props.tokenName.toUpperCase()} */}
      {props.tokenName}
    </Text>
  );
};

export default function TokenCard(props: TokenCardProps) {
  const {
    tokenInfo,
    w,
    h,
    hasInput,
    inNetwork,
    isNew,
    symbolSize,
    onClick,
    style,
    type,
  } = props;
  const { inNetwork: inNetworkInfo } = useRecoilValue(networkStatus);
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

  const tokenData = useTokenBalance(tokenInfo);

  const { addNewToken } = useAddTokenToStorage();
  const notAdded = isNew && agreeToAdd === false;
  const addNewCard = useCallback(() => {
    addNewToken(tokenInfo);
    return setAgreeToAdd(true);
  }, [agreeToAdd]);

  return (
    <Flex
      w={typeof w === "string" ? w : `${w ?? 200}px`}
      height={typeof h === "string" ? h : `${h ?? 248}px`}
      bg={`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${tokenColorCode};`}
      opacity={isNew ? 0.25 : 0.85}
      border={`3px solid ${tokenColorCode} `}
      borderRadius={"16px"}
      pos={"relative"}
      pt={"15px"}
      pb={type === "small" ? "13px" : type === "medium" ? "15px" : "30px"}
      overflow={"hidden"}
      flexDir={"column"}
      justifyContent={"space-between"}
      px={"16px"}
      cursor={"pointer"}
      onClick={notAdded ? addNewCard : onClick}
      {...style}
    >
      <TopLine mainSchemCol={tokenColorCode} />
      <Flex justifyContent={"space-between"} w={"100%"}>
        <TokenTitle
          tokenName={tokenInfo?.tokenName ?? "TOKEN"}
          isName={true}
          style={{ fontSize: type === "small" ? "16px" : "" }}
        />
        <TokenTitle
          tokenName={tokenInfo?.tokenSymbol ?? "TOK"}
          isName={false}
          style={{ fontSize: type === "small" ? "12px" : "" }}
        />
      </Flex>
      <Flex
        // pt={"25px"}
        // pb={"37px"}
        // my={notAdded ? "20px" : ""}
        h={"100%"}
        justifyContent={"center"}
        alignItems={notAdded ? "baseline" : "center"}
      >
        <TokenSymbol
          w={symbolSize?.w ?? (notAdded ? 40 : 92)}
          h={symbolSize?.w ?? (notAdded ? 40 : 92)}
          tokenType={tokenInfo?.tokenSymbol}
        />
      </Flex>
      {notAdded ? (
        <Flex flexDir={"column"} alignItems={"center"}>
          <Text fontSize={12} color={"#222222"} w={"206px"}>
            This token isn’t traded on leading U.S. centralized exchanges or
            frequently swapped on Tokamak Network. Always conduct your own
            research before trading.
          </Text>
          <Button
            w={"206px"}
            h={"40px"}
            my={"20px"}
            bg={"#007AFF"}
            _hover={{}}
            _active={{}}
            fontSize={16}
            fontWeight={600}
            onClick={() => addNewCard}
          >
            I Agree
          </Button>
          <Text fontSize={16} fontWeight={400} color={"#222222"}>
            Cancel
          </Text>
        </Flex>
      ) : (
        <Flex
          flexDir={"column"}
          mt={"auto"}
          color={"#222"}
          rowGap={type === "small" ? "8px" : type === "medium" ? "9px" : "12px"}
        >
          <Text
            fontWeight={400}
            fontSize={type === "small" ? 12 : type === "medium" ? 13 : 14}
            h={type === "small" ? "8px" : type === "medium" ? "9px" : "10px"}
          >
            Balance:{" "}
          </Text>
          <Text
            fontWeight={700}
            fontSize={type === "small" ? 24 : type === "medium" ? 30 : 36}
            h={type === "small" ? "33px" : type === "medium" ? "40px" : "40px"}
          >
            {tokenData?.data.parsedBalance}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
