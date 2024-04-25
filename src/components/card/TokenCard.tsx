import { TokenInfo } from "types/token/supportedToken";
import { Box, Button, Flex, Text, TextProps, useTheme } from "@chakra-ui/react";
import { TokenSymbol } from "../image/TokenSymbol";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import useAddTokenToStorage from "@/hooks/storage/useAddTokenToStorage";
import { isETH } from "@/utils/token/isETH";
import useMediaView from "@/hooks/mediaView/useMediaView";
import "@fontsource/quicksand/500.css";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { trimAmount } from "@/utils/trim";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { ethers } from "ethers";

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
  onClick?: (e: any) => any;
  onMouseDown?: (e: any) => any;
  style?: {};
  type?: TokenCardSizeType;
  forBridge?: boolean;
  isPrice?: boolean;
  isInput?: boolean;
  requireCall?: boolean;
  watch?: boolean;
  isDark?: boolean;
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
      w={props.isName ? "110px" : "60px"}
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
    onMouseDown,
    style,
    type,
    forBridge,
    isPrice,
    isInput,
    requireCall,
    watch,
    isDark,
  } = props;
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

  const tokenData = useTokenBalance(tokenInfo, requireCall, watch);
  const thisTokenIsETH = isETH(tokenInfo);
  const theme = useTheme();

  const { addNewToken } = useAddTokenToStorage();
  const notAdded = isNew && agreeToAdd === false;
  const addNewCard = useCallback(() => {
    addNewToken(tokenInfo);
    return setAgreeToAdd(true);
  }, [agreeToAdd]);

  const [inTokenInfo] = useRecoilState(selectedInTokenStatus);
  const [outTokenInfo, setOutTokenInfo] = useRecoilState(
    selectedOutTokenStatus
  );
  const { amountOut } = useAmountOut();

  const { tokenPriceWithAmount: inTokenWithPrice } = useGetMarketPrice({
    tokenName: inTokenInfo?.tokenName as string,
    amount: Number(inTokenInfo?.parsedAmount?.replaceAll(",", "")),
  });

  const { pcView, mobileView } = useMediaView();
  const { mode } = useGetMode();

  const outAmount = useMemo(() => {
    if (
      (mode === "Wrap" ||
        mode === "Unwrap" ||
        mode === "ETH-Wrap" ||
        mode === "ETH-Unwrap") &&
      inTokenInfo?.parsedAmount
    ) {
      return inTokenInfo.parsedAmount;
    }
    return amountOut;
  }, [mode, inTokenInfo, amountOut]);

  const { tokenPriceWithAmount: outTokenWithPrice } = useGetMarketPrice({
    tokenName: outTokenInfo?.tokenName as string,
    amount: Number(outAmount),
  });

  useEffect(() => {
    if (mode === "Pool") return;
    if (!isInput && outTokenInfo && amountOut && mobileView) {
      const value: string = amountOut;
      if (value === "" || value === null) {
        return setOutTokenInfo({
          ...outTokenInfo,
          amountBN: null,
          parsedAmount: null,
        });
      }

      // 데시말 초과 버그 수정
      const roundedValue = Number(value).toFixed(outTokenInfo.decimals);
      const parsedAmount = ethers.utils.parseUnits(
        roundedValue,
        outTokenInfo.decimals
      );
      ////////////////////

      return setOutTokenInfo({
        ...outTokenInfo,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
      });
    }
  }, [amountOut, mode]);

  return (
    <Flex
      w={typeof w === "string" ? w : `${w ?? 200}px`}
      height={typeof h === "string" ? h : `${h ?? 248}px`}
      bg={`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${tokenColorCode};`}
      opacity={isNew || isDark ? 0.25 : 0.85}
      border={`3px solid ${tokenColorCode} `}
      borderRadius={{ base: "9px", lg: "16px" }}
      pos={"relative"}
      pt={{ base: "12px", lg: "15px" }}
      pb={type === "small" ? "13px" : type === "medium" ? "15px" : "30px"}
      overflow={"hidden"}
      flexDir={"column"}
      justifyContent={"space-between"}
      px={{ base: "12px", lg: "16px" }}
      cursor={"pointer"}
      onMouseDown={onMouseDown}
      onClick={notAdded ? addNewCard : onClick}
      fontFamily={theme.fonts.Quicksand}
      {...style}
    >
      <TopLine mainSchemCol={tokenColorCode} />
      {pcView && (
        <Flex justifyContent={"space-between"} w={"100%"}>
          <TokenTitle
            tokenName={
              thisTokenIsETH
                ? "Ethereum"
                : tokenInfo?.tokenSymbol === "WETH"
                ? "Wrapped Ethereum"
                : tokenInfo?.tokenName ?? "TOKEN"
            }
            isName={true}
            style={{
              fontSize:
                type === "small" ? "16px" : type === "medium" ? "20px" : "22px",
            }}
          />
          <TokenTitle
            tokenName={tokenInfo?.tokenSymbol ?? "TOK"}
            isName={false}
            style={{
              fontSize:
                type === "small" ? "12px" : type === "medium" ? "16px" : "18px",
            }}
          />
        </Flex>
      )}
      {!pcView && (
        <Flex
          flexDir={"column"}
          justifyContent={"space-between"}
          w={"100%"}
          color={"#222222"}
        >
          <Text fontWeight={700} fontSize={16} zIndex={100}>
            {tokenInfo?.tokenSymbol ?? "TOK"}
          </Text>
          <Text fontWeight={700} fontSize={10} zIndex={100}>
            {thisTokenIsETH
              ? "Ethereum"
              : tokenInfo?.tokenSymbol === "WETH"
              ? "Wrapped Ethereum"
              : tokenInfo?.tokenName ?? "TOKEN"}
          </Text>
        </Flex>
      )}
      <Flex
        // pt={"25px"}
        // pb={"37px"}
        // my={notAdded ? "20px" : ""}
        h={"100%"}
        justifyContent={"center"}
        alignItems={notAdded ? "baseline" : "center"}
        my={{ base: "10px", lg: "0px" }}
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
      ) : forBridge ? (
        pcView ? (
          <Flex flexDir={"column"} rowGap={"13px"}>
            <Flex fontSize={16} h={"8px"} color={"#222222"} columnGap={"2px"}>
              <Text fontWeight={500}>Balance: </Text>
              <Text fontWeight={700}>
                {trimAmount(tokenData?.data.parsedBalance, 10) || "0.0"}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex flexDir={"column"} rowGap={"7px"}>
            <Flex fontSize={12} h={"8px"} color={"#222222"}>
              <Text fontWeight={500}>Balance </Text>
            </Flex>
            <Text fontWeight={700} fontSize={18} color={"#222222"}>
              {trimAmount(tokenData?.data.parsedBalanceWithoutCommafied, 12)}
            </Text>
          </Flex>
        )
      ) : (
        <Flex
          flexDir={"column"}
          mt={"auto"}
          color={"#222"}
          rowGap={type === "small" ? "8px" : type === "medium" ? "9px" : "12px"}
        >
          {!isPrice && (
            <>
              {pcView ? (
                <>
                  <Text
                    fontWeight={400}
                    fontSize={
                      type === "small" ? 12 : type === "medium" ? 13 : 14
                    }
                    h={
                      type === "small"
                        ? "8px"
                        : type === "medium"
                        ? "9px"
                        : "10px"
                    }
                  >
                    balance:{" "}
                  </Text>
                  <Text
                    fontWeight={700}
                    fontSize={
                      type === "small" ? 24 : type === "medium" ? 30 : 36
                    }
                    h={
                      type === "small"
                        ? "33px"
                        : type === "medium"
                        ? "40px"
                        : "40px"
                    }
                  >
                    {trimAmount(tokenData?.data.parsedBalance, 10) || "0.0"}
                  </Text>
                </>
              ) : (
                <Text fontWeight={700} fontSize={18}>
                  {trimAmount(tokenData?.data.parsedBalance, 10) || "0.0"}
                </Text>
              )}
            </>
          )}

          {isPrice && (
            <Flex flexDir={"column"} rowGap={0}>
              <Text
                h={"28px"}
                fontFamily={theme.fonts.Quicksand}
                fontWeight={700}
                fontSize={22}
                textOverflow={"hidden"}
              >
                {isInput
                  ? trimAmount(inTokenInfo?.parsedAmount, 10) || "0"
                  : trimAmount(outAmount, 10) || "0"}
              </Text>
              <Text
                fontFamily={theme.fonts.Quicksand}
                fontWeight={700}
                fontSize={10}
              >
                ${isInput ? inTokenWithPrice || "0" : outTokenWithPrice || "0"}
              </Text>
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}
