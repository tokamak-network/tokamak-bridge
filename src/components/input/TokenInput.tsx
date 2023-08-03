import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useGetAmountForLiquidity } from "@/hooks/pool/useGetAmountForLiquidity";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import usePriceImpact from "@/hooks/swap/usePriceImpact";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { trimAmount } from "@/utils/trim";
import commafy from "@/utils/trim/commafy";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import JSBI from "jsbi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";

export default function TokenInput(props: {
  inToken: boolean;
  defaultValue?: string | number | null;
  isDisabled?: boolean;
  hasMaxButton?: boolean;
  style?: {};
}) {
  const { inToken, defaultValue, hasMaxButton, isDisabled, style } = props;
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  const { amountOut } = useAmountOut();
  const { mode } = useGetMode();
  const {
    inToken: inTokenFromHook,
    inTokenInfo,
    outTokenInfo,
  } = useInOutTokens();
  const { priceImpact } = usePriceImpact();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { amountForToken0, amountForToken1 } = useGetAmountForLiquidity();

  const tokenData = useTokenBalance(inToken ? inTokenInfo : outTokenInfo);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const value: string = e.target.value;

    //This token is inToken
    if (inToken && selectedInToken) {
      if (value === "") {
        return setSelectedInToken({
          ...selectedInToken,
          amountBN: null,
          parsedAmount: null,
        });
      }
      const parsedAmount = ethers.utils.parseUnits(
        value,
        selectedInToken.decimals
      );
      return setSelectedInToken({
        ...selectedInToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
      });
    }

    //This token is outToken
    if (mode !== "Swap" && !inToken && selectedOutToken) {
      if (value === "" || value === null) {
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: null,
          parsedAmount: null,
        });
      }
      const parsedAmount = ethers.utils.parseUnits(
        value,
        selectedOutToken.decimals
      );

      return setSelectedOutToken({
        ...selectedOutToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
      });
    }

    if (!inToken && selectedOutToken && amountOut) {
      const value: string = amountOut;
      if (value === "" || value === null) {
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: null,
          parsedAmount: null,
        });
      }
      const parsedAmount = ethers.utils.parseUnits(
        value,
        selectedOutToken.decimals
      );
      return setSelectedOutToken({
        ...selectedOutToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
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
  }, [tokenData, inToken, selectedInToken]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    //for pool's price and amount on liquidity
    if (mode === "Pool" && inToken && selectedOutToken && amountForToken1) {
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
    if (mode === "Pool" && !inToken && selectedInToken && amountForToken0) {
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
    if (
      (mode === "Wrap" || mode === "Unwrap") &&
      inTokenFromHook?.parsedAmount
    ) {
      return inTokenFromHook.parsedAmount;
    }
    return mode === "Swap" && inToken === false
      ? trimAmount(amountOut, 11) ?? ""
      : inToken && selectedInToken && selectedInToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedInToken?.parsedAmount)
        : trimAmount(selectedInToken?.parsedAmount, 11)
      : !inToken && selectedOutToken && selectedOutToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedOutToken?.parsedAmount)
        : trimAmount(selectedOutToken?.parsedAmount, 11)
      : "";
  }, [
    inToken,
    amountOut,
    selectedInToken,
    selectedOutToken,
    mode,
    inTokenFromHook,
    isFocused,
  ]);

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

  useEffect(() => {
    if (!inToken && selectedOutToken && amountOut) {
      const value: string = amountOut;
      if (value === "" || value === null) {
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: null,
          parsedAmount: null,
        });
      }
      const parsedAmount = ethers.utils.parseUnits(
        value,
        selectedOutToken.decimals
      );
      return setSelectedOutToken({
        ...selectedOutToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
      });
    }
  }, [amountOut]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"space-between"}
      pb={"16px"}
      w={"100%"}
      rowGap={"6px"}
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
          isDisabled={isDisabled}
          _disabled={{ color: "#fff" }}
          value={valueProp}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        ></Input>
        {hasMaxButton && (
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
        )}
      </Flex>
      <Flex w={"100%"} justifyContent={"flex-start"} columnGap={"4px"}>
        <Text fontSize={13} fontWeight={500} color={"#ffffff"} opacity={0.8}>
          {`$${marketPrice}`}
        </Text>
        {/* {inToken === false && mode === "Swap" && (
          <Text fontSize={13} fontWeight={400} color={"#DD3A44"}>
            ({priceImpact ?? "-"}%)
          </Text>
        )}  */}
      </Flex>
    </Flex>
  );
}
