import { Flex, Box, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import GradientSpinner from "../../ui/gradientSpinner";
import { useState, useEffect, useMemo } from "react";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { trimAmount } from "@/utils/trim";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { lastFocusedInput } from "@/recoil/pool/setPoolPosition";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

export default function MobileTokenBox(props: {
  inToken: boolean;
  visibilityType: boolean;
}) {
  const {
    inToken,
    visibilityType
  } = props;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { mode } = useGetMode();
  const { amountOut } = useAmountOut();
  const [lastFocused, setLastFocused] = useRecoilState(lastFocusedInput);
  const { dependentAmount: _dependentAmount } = useV3MintInfo();
  const dependentAmount = _dependentAmount?.toSignificant(
    // inToken ? inTokenInfo?.decimals : outTokenInfo?.decimals
    18
  );
  const {
    inToken: inTokenFromHook,
    inTokenInfo,
    outTokenInfo,
    initializeTokenPairAmount,
  } = useInOutTokens();

  const [visibilityTypeState, setVisibilityTypeState] = useState<boolean>(visibilityType);

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

  const { tokenPriceWithAmount: token0PriceWithAmount } = useGetMarketPrice({
    tokenName: selectedInToken?.tokenName as string,
    amount: Number(selectedInToken?.parsedAmount?.replaceAll(",", "")),
  });

  const { tokenPriceWithAmount: token1PriceWithAmount } = useGetMarketPrice({
    tokenName: selectedOutToken?.tokenName as string,
    amount: Number(outAmount),
  });

  const valueProp = useMemo(() => {
    if (
      (mode === "Wrap" ||
        mode === "Unwrap" ||
        mode === "ETH-Wrap" ||
        mode === "ETH-Unwrap") &&
      inTokenFromHook?.parsedAmount
    ) {
      return trimAmount(inTokenFromHook.parsedAmount, 8);
    }

    if (mode === "Swap" && inToken === false) {
      return trimAmount(amountOut, 8) ?? "";
    }

    if (mode === "Pool" && dependentAmount) {
      if (lastFocused === "LeftInput" && !inToken) {
        return trimAmount(dependentAmount, 8);
      }
      if (lastFocused === "RightInput" && inToken) {
        return trimAmount(dependentAmount, 8);
      }
    }

    return inToken && selectedInToken && selectedInToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedInToken?.parsedAmount)
        : trimAmount(selectedInToken?.parsedAmount, 8)
      : !inToken && selectedOutToken && selectedOutToken?.parsedAmount !== null
      ? isFocused
        ? String(selectedOutToken?.parsedAmount)
        : trimAmount(selectedOutToken?.parsedAmount, 8)
      : 0;
  }, [
    inToken,
    amountOut,
    selectedInToken,
    selectedOutToken,
    mode,
    inTokenFromHook,
    isFocused,
    dependentAmount,
    lastFocused,
  ]);

  const marketPrice = useMemo(() => {
    if (inToken && token0PriceWithAmount) {
      return token0PriceWithAmount;
    }
    if (!inToken && token1PriceWithAmount) {
      return token1PriceWithAmount;
    }
    return "0.00";
  }, [token0PriceWithAmount, token1PriceWithAmount, inToken]);


  useEffect(() => {
    if (inToken && selectedInToken) {
      setVisibilityTypeState(true);

    } else if (!inToken && selectedOutToken) {
      setVisibilityTypeState(true);

    } else {
      setVisibilityTypeState(false);

    }
  }, [inToken, selectedInToken, selectedOutToken]);

  return(
    <Flex
      visibility={visibilityTypeState? "visible" : "hidden"}
      direction="column"
      mx="5"
      mt="2"
      w="148px"
      h="84px"
    >
      {visibilityTypeState && valueProp ? 
        (
          <>
            <Box
              bg="#1F2128"
              p="2"
              rounded="md"
              w="full"
              mb="1"
            >
              <Text fontSize="md" fontWeight="bold" color="white">{valueProp}</Text>
            </Box>
            <Text fontSize="sm" color="gray.400">${marketPrice}</Text>
          </>
        ) : 
        (
          <>
            <Box
              bg="#1F2128"
              p="5"
              rounded="md"
              w="full"
              mb="1"
            >
              <GradientSpinner/>
            </Box>
            <Box
              bg="#1F2128"
              p="2"
              rounded="md"
              w="full"
              mb="1"
            >
              <GradientSpinner/>
            </Box>
          </>
        )
        }
    </Flex> 
  )
}
