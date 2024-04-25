import { Flex, Box, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import GradientSpinner from "../../ui/GradientSpinner";
import { useState, useEffect, useMemo } from "react";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { trimAmount } from "@/utils/trim";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { lastFocusedInput } from "@/recoil/pool/setPoolPosition";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useIsMoibleLoading } from "@/hooks/ui/useMobileLoading";
import useAmountModal from "@/hooks/modal/useAmountModal";
import useTokenModal from "@/hooks/modal/useTokenModal";
import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";

import { tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { MAINNET_CONTRACTS } from "@/constant/contracts";
import useIsTon from "@/hooks/token/useIsTon";
import { useAccount } from "wagmi";

export default function MobileTokenBox(props: {
  inToken: boolean;
  visibilityType: boolean;
}) {
  const { inToken, visibilityType } = props;

  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { onOpenInAmount, onOpenOutAmount } = useAmountModal();
  const { onCloseTokenModal, setSelectedToken, simpleCloseTokenModal } =
    useTokenModal();

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

  const [visibilityTypeState, setVisibilityTypeState] =
    useState<boolean>(visibilityType);
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);

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

  const { isTONatPair } = useIsTon();
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { isConnected } = useAccount();

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

    // ton이 하나라도 있을 때, 0으로 만들기
    // ton -> wton wton->ton은 위에서 다 걸림
    if (mode === "Swap" && isTONatPair) {
      if (
        inToken &&
        selectedInToken?.tokenAddress === MAINNET_CONTRACTS.TON_ADDRESS
      ) {
        return trimAmount("0", 8) ?? 0;
      } else if (!inToken) {
        return trimAmount("0", 8) ?? 0;
      }
    }

    if (mode === "Swap" && inToken === false) {
      if (isNotSupportForSwap || isNotSupportForSwap || !isConnected) {
        return "0";
      }

      if (!inToken && !selectedInToken?.amountBN) {
        return trimAmount("0", 8) ?? 0;
      }
      return trimAmount(amountOut, 8) ?? "";
    }

    if (inToken && selectedInToken?.parsedAmount !== null) {
      return isFocused
        ? String(selectedInToken?.parsedAmount)
        : trimAmount(selectedInToken?.parsedAmount, 8);
    }

    if (!inToken && selectedOutToken?.parsedAmount !== null) {
      return isFocused
        ? String(selectedOutToken?.parsedAmount)
        : trimAmount(selectedOutToken?.parsedAmount, 8);
    }

    return "0";
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
    isNotSupportForBridge,
    isNotSupportForSwap,
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

  const handleClick = () => {
    simpleCloseTokenModal();
    setTokenModal({ ...tokenModal, isOpen: "INPUT" });
    onOpenInAmount();
  };

  return (
    <Flex
      visibility={visibilityTypeState ? "visible" : "hidden"}
      direction="column"
      ml={inToken ? "" : "5"}
      mr={inToken ? "5" : ""}
      mt="2"
      w="148px"
      h="84px"
      cursor={inToken ? "pointer" : "default"} // 조건에 따른 cursor 스타일 설정
      onClick={inToken ? handleClick : undefined} // 조건에 따라 onClick 핸들러 설정
    >
      {visibilityTypeState && valueProp ? (
        <>
          <Box bg="#1F2128" p="2" rounded="md" w="full" mb="1">
            <Text fontSize="md" fontWeight="bold" color="white">
              {valueProp}
            </Text>
          </Box>
          <Text fontSize="sm" color="gray.400">
            ${marketPrice}
          </Text>
        </>
      ) : (
        <>
          <Box
            p="5"
            rounded="md"
            w="full"
            bgSize="200% 100%"
            mb="1"
            bgGradient="linear(to-r, #2b2f42 8%, #2b2f42 38%, #1c1d25 54%)"
            borderRadius={"8px"}
            animation={`${useIsMoibleLoading} 10s linear infinite`}
          />
          <Box
            bg="#1F2128"
            p="2"
            rounded="md"
            w="full"
            bgSize="200% 100%"
            mb="1"
            bgGradient="linear(to-r, #2b2f42 8%, #2b2f42 38%, #1c1d25 54%)"
            borderRadius={"8px"}
            animation={`${useIsMoibleLoading} 10s linear infinite`}
          />
        </>
      )}
    </Flex>
  );
}
