import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
import { useGetAmountForLiquidity } from "@/hooks/pool/useGetAmountForLiquidity";
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
import { useCallback, useEffect, useMemo, useState } from "react";
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

  const tokenData = useTokenBalance(tokenInfo);

  // console.log(amountForToken0, amountForToken1);

  useEffect(() => {
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
  }, []);

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

  const onMax = useCallback(() => {
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
    </Flex>
  );
}
