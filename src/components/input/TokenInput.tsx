import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useInOutNetwork } from "@/hooks/network";
import usePriceImpact from "@/hooks/swap/usePriceImpact";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { trimAmount } from "@/utils/trim";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
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
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { amountOut } = useAmountOut();
  const { mode } = useGetMode();
  const {
    inToken: inTokenFromHook,
    inTokenInfo,
    outTokenInfo,
  } = useInOutTokens();
  const { priceImpact } = usePriceImpact();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const tokenAddress = useMemo(() => {
    if (inToken && selectedInToken && inNetwork) {
      return selectedInToken.address[inNetwork.chainName];
    }
    if (inToken === false && selectedOutToken && outNetwork) {
      return selectedOutToken.address[outNetwork.chainName];
    }
    return null;
  }, [inNetwork, outNetwork, selectedInToken, selectedOutToken, inToken]);

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
      // if (inToken === false && selectedOutToken) {
      //   return setSelectedOutToken({
      //     ...selectedOutToken,
      //     amountBN: tokenData.data.balanceBN.value,
      //     parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
      //   });
      // }
      return console.error("a input field not founded");
    }
  }, [tokenData, inToken, selectedInToken]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const valueProp = useMemo(() => {
    if (
      (mode === "Wrap" || mode === "Unwrap") &&
      inTokenFromHook?.parsedAmount
    ) {
      return inTokenFromHook.parsedAmount;
    }
    return inToken === false
      ? trimAmount(amountOut, 11) ?? ""
      : selectedInToken && selectedInToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedInToken?.parsedAmount)
        : trimAmount(selectedInToken?.parsedAmount, 11)
      : "";
  }, [inToken, amountOut, selectedInToken, mode, inTokenFromHook, isFocused]);

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
        {/* <Text fontSize={13} fontWeight={500} color={"#ffffff"} opacity={0.8}>
          $0.00
        </Text> */}
        {/* {inToken === false && mode === "Swap" && (
          <Text fontSize={13} fontWeight={400} color={"#DD3A44"}>
            ({priceImpact ?? "-"}%)
          </Text>
        )} */}
      </Flex>
    </Flex>
  );
}
