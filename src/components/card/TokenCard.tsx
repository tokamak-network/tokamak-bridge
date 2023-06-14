import { SupportedTokenSymbol, TokenInfo } from "types/token/supportedToken";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { TokenSymbol } from "../image/TokenSymbol";
import { useMemo } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { networkStatus, selectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import { ethers } from "ethers";
import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";

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

const TokenTitle = (props: { tokenName: String }) => {
  return (
    <Text w={"60px"} fontSize={18} fontWeight={700} color={"#222222"}>
      {props.tokenName.toUpperCase()}
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
  } = props;
  const { inNetwork: inNetworkInfo } = useRecoilValue(networkStatus);
  const tokenColorCode = useMemo(() => {
    switch (tokenInfo?.tokenSymbol) {
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

  const tokenAddress =
    inNetworkInfo && tokenInfo.address[inNetworkInfo?.chainName];
  const tokenData = useTokenBalance(tokenAddress ?? "0x");

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
      pb={"32px"}
      overflow={"hidden"}
      flexDir={"column"}
      justifyContent={"space-between"}
      px={"16px"}
      cursor={"pointer"}
      onClick={onClick}
      {...style}
    >
      <TopLine mainSchemCol={tokenColorCode} />
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"100%"}>
        <TokenTitle tokenName={tokenInfo?.tokenSymbol ?? "TOKEN"} />
      </Flex>
      <Flex
        // pt={"25px"}
        // pb={"37px"}
        my={isNew ? "20px" : ""}
        justifyContent={"center"}
        alignItems={isNew ? "baseline" : "center"}
      >
        <TokenSymbol
          w={symbolSize?.w ?? isNew ? 40 : 92}
          h={symbolSize?.w ?? isNew ? 40 : 92}
          tokenType={tokenInfo?.tokenSymbol}
        />
      </Flex>
      {isNew ? (
        <Flex flexDir={"column"} alignItems={"center"}>
          <Text fontSize={12} color={"#fff"} w={"206px"}>
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
          >
            I Agree
          </Button>
          <Text fontSize={16} fontWeight={400}>
            Cancel
          </Text>
        </Flex>
      ) : (
        <Flex flexDir={"column"} rowGap={"13px"}>
          <Flex fontSize={16} h={"8px"} color={"#222222"} columnGap={"2px"}>
            <Text fontWeight={400}>Balance: </Text>
            <Text fontWeight={700}>{tokenData?.data.parsedBalance}</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
