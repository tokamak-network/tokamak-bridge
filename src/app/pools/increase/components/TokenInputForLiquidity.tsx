import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
import { useGetAmountForLiquidity } from "@/hooks/pool/useGetAmountForLiquidity";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import usePriceImpact from "@/hooks/swap/usePriceImpact";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { TokenInfo } from "@/types/token/supportedToken";
import { trimAmount } from "@/utils/trim";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import JSBI from "jsbi";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";

export function TokenInputForLiquidity(props: {
  inToken: boolean;
  tokenInfo: TokenInfo;
  otherTokenInfo: TokenInfo;
  style?: {};
}) {
  const { inToken, tokenInfo, otherTokenInfo, style } = props;
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { chainName } = useConnectedNetwork();

  const { amountForToken0, amountForToken1 } = useGetAmountForLiquidity(true);
  const { inverted, deposit0Disabled, deposit1Disabled } = usePoolInfo();

  const tokenData = useTokenBalance(tokenInfo);

  useEffect(() => {
    if (deposit0Disabled) {
      return setSelectedInToken(null);
    }
    if (deposit1Disabled) {
      return setSelectedOutToken(null);
    }
    if (inToken && !amountForToken1)
      return setSelectedOutToken({
        ...otherTokenInfo,
        amountBN: null,
        parsedAmount: null,
        tokenAddress: chainName ? otherTokenInfo.address[chainName] : null,
      });
    if (!inToken && !amountForToken0)
      return setSelectedInToken({
        ...otherTokenInfo,
        amountBN: null,
        parsedAmount: null,
        tokenAddress: chainName ? otherTokenInfo.address[chainName] : null,
      });
  }, [deposit0Disabled, deposit1Disabled]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    //This token is inToken
    if (inToken && tokenInfo && chainName) {
      if (value === "") {
        return setSelectedInToken({
          ...tokenInfo,
          amountBN: null,
          parsedAmount: null,
          tokenAddress: tokenInfo.address[chainName],
        });
      }
      const parsedAmount = ethers.utils.parseUnits(value, tokenInfo.decimals);
      return setSelectedInToken({
        ...tokenInfo,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
        tokenAddress: tokenInfo.address[chainName],
      });
    }

    //This token is outToken
    if (!inToken && tokenInfo && chainName) {
      if (value === "" || value === null) {
        return setSelectedOutToken({
          ...tokenInfo,
          amountBN: null,
          parsedAmount: null,
          tokenAddress: tokenInfo.address[chainName],
        });
      }
      const parsedAmount = ethers.utils.parseUnits(value, tokenInfo.decimals);

      return setSelectedOutToken({
        ...tokenInfo,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
        tokenAddress: tokenInfo.address[chainName],
      });
    }
  };

  const inputRef = useRef(null);

  const onMax = useCallback(() => {
    try {
      if (tokenData) {
        if (inToken && selectedInToken) {
          return setSelectedInToken({
            ...selectedInToken,
            amountBN: tokenData.data.balanceBN.value,
            parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
          });
        }
        if (inToken === false && selectedOutToken) {
          return setSelectedOutToken({
            ...selectedOutToken,
            amountBN: tokenData.data.balanceBN.value,
            parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
          });
        }
        return console.error("a input field not founded");
      }
    } finally {
      setTimeout(() => {
        //@ts-ignore
        inputRef?.current?.focus();
        //@ts-ignore
        inputRef?.current?.blur();
      }, 100);
    }
  }, [tokenData, inToken, selectedInToken, selectedOutToken]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    //for pool's price and amount on liquidity

    if (inToken && selectedOutToken && amountForToken1) {
      const formattedAmount = ethers.utils.formatUnits(
        amountForToken1.toString().replaceAll("-", ""),
        selectedOutToken.decimals
      );

      const parsedAmount = ethers.utils.parseUnits(
        formattedAmount,
        selectedOutToken.decimals
      );

      return setSelectedOutToken({
        ...selectedOutToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: formattedAmount.toString(),
      });
    }
    if (!inToken && selectedInToken && amountForToken0) {
      const formattedAmount = ethers.utils.formatUnits(
        amountForToken0.toString().replaceAll("-", ""),
        selectedInToken.decimals
      );

      const parsedAmount = ethers.utils.parseUnits(
        formattedAmount,
        selectedInToken.decimals
      );

      return setSelectedInToken({
        ...selectedInToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: formattedAmount.toString(),
      });
    }
  };

  const valueProp = useMemo(() => {
    return inToken && selectedInToken && selectedInToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedInToken?.parsedAmount)
        : trimAmount(selectedInToken?.parsedAmount, 11)
      : !inToken && selectedOutToken && selectedOutToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedOutToken?.parsedAmount)
        : trimAmount(selectedOutToken?.parsedAmount, 11)
      : "";
  }, [inToken, selectedInToken, selectedOutToken, isFocused]);

  const { tokenPriceWithAmount: token0PriceWiwhtAmount } = useGetMarketPrice({
    tokenName: selectedInToken?.tokenName as string,
    amount: Number(selectedInToken?.parsedAmount?.replaceAll(",", "")),
  });

  const { tokenPriceWithAmount: token1PriceWiwhtAmount } = useGetMarketPrice({
    tokenName: selectedOutToken?.tokenName as string,
    amount: Number(selectedOutToken?.parsedAmount?.replaceAll(",", "")),
  });

  const marketPrice = useMemo(() => {
    if (inToken && token0PriceWiwhtAmount) {
      return token0PriceWiwhtAmount;
    }
    if (!inToken && token1PriceWiwhtAmount) {
      return token1PriceWiwhtAmount;
    }
    return "0.00";
  }, [token0PriceWiwhtAmount, token1PriceWiwhtAmount, inToken]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"space-between"}
      pb={"16px"}
      w={"100%"}
      rowGap={"6px"}
      h={"34px"}
      {...style}
    >
      <Flex>
        <Input
          w={"100%"}
          h={"27px"}
          m={0}
          p={0}
          border={{}}
          _active={{}}
          _focus={{ boxShadow: "none !important" }}
          placeholder="0"
          _placeholder={{ color: "#C6C6D1 !important" }}
          color={"#ffffff"}
          fontSize={28}
          fontWeight={700}
          ref={inputRef}
          // isDisabled={isDisabled}
          _disabled={{ color: "#fff" }}
          value={valueProp}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></Input>
        <Button
          w={"40px"}
          h={"22px"}
          bgColor={"#6a00f1"}
          fontSize={12}
          fontWeight={700}
          _hover={{}}
          _active={{}}
          mt={"3px"}
          onClick={() => onMax()}
        >
          Max
        </Button>
      </Flex>
      <Flex w={"100%"} justifyContent={"flex-start"} columnGap={"4px"}>
        <Text fontSize={13} fontWeight={500} color={"#ffffff"} opacity={0.8}>
          {`$${marketPrice}`}
        </Text>
      </Flex>
    </Flex>
  );
}
