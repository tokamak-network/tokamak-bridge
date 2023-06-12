import { SupportedTokenName, TokenInfo } from "types/token/supportedToken";
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
  const { tokenInfo, w, h, hasInput, inNetwork, style } = props;
  const { inNetwork: inNetworkInfo } = useRecoilValue(networkStatus);
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

  const tokenAddress =
    inNetworkInfo && tokenInfo.address[inNetworkInfo?.chainName];
  const tokenData = useTokenBalance(tokenAddress ?? "0x");

  return (
    <Flex
      w={typeof w === "string" ? w : `${w ?? 200}px`}
      height={typeof h === "string" ? h : `${h ?? 248}px`}
      bg={`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${tokenColorCode};`}
      opacity={0.85}
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
      {...style}
    >
      <TopLine mainSchemCol={tokenColorCode} />
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"100%"}>
        <TokenTitle tokenName={tokenInfo?.tokenName ?? "TOKEN"} />
      </Flex>
      <Flex
        // pt={"25px"}
        // pb={"37px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TokenSymbol tokenType={tokenInfo?.tokenName} />
      </Flex>
      <Flex flexDir={"column"} rowGap={"13px"}>
        <Flex fontSize={16} h={"8px"} color={"#222222"} columnGap={"2px"}>
          <Text fontWeight={400}>Balance: </Text>
          <Text fontWeight={700}>{tokenData?.data.parsedBalance}</Text>
        </Flex>
        {/* <Flex justifyContent={"space-between"}>
          <Flex
            color={"#222222"}
            fontSize={28}
            fontWeight={700}
            w={hasInput ? "110px" : "100%"}
            h={"20px"}
          >
            {hasInput ? (
              <TokenInput />
            ) : (
              <Text w={"100%"} h={"100%"}>
                5000.00
              </Text>
            )}
          </Flex>
        </Flex> */}
      </Flex>
    </Flex>
  );
}
