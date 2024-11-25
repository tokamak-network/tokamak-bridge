import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { trimAmount } from "@/utils/trim";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";
import { lastFocusedInput } from "@/recoil/pool/setPoolPosition";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useConnectedNetwork from "@/hooks/network";
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isETH } from "@/utils/token/isETH";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import GradientSpinner from "@/components/ui/GradientSpinner";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import "@fontsource/poppins/600.css";
import useTokenModal from "@/hooks/modal/useTokenModal";
import {
  IsSearchToken,
  isInputTokenAmount,
} from "@/recoil/card/selectCard/searchToken";
import Warning from "@/app/BridgeSwap/Warning";
import useAmountModal from "@/hooks/modal/useAmountModal";
import commafy from "@/utils/trim/commafy";

export default function TokenInput(props: {
  inToken: boolean;
  defaultValue?: any;
  isDisabled?: boolean;
  hasMaxButton?: boolean;
  style?: {};
  customRef?: RefObject<HTMLInputElement> | null;
  placeholder?: string;
}) {
  const {
    inToken,
    hasMaxButton,
    isDisabled,
    style,
    customRef,
    placeholder,
    defaultValue,
  } = props;
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { layer } = useConnectedNetwork();
  const [isMax, setIsMax] = useState<boolean>(false);
  const [lastFocused, setLastFocused] = useRecoilState(lastFocusedInput);
  const { dependentAmount: _dependentAmount } = useV3MintInfo();
  const dependentAmount = _dependentAmount?.toSignificant(
    // inToken ? inTokenInfo?.decimals : outTokenInfo?.decimals
    18
  );
  const tokenData = useTokenBalance(inToken ? inTokenInfo : outTokenInfo);
  const { mobileView } = useMediaView();
  const { isBalanceOver } = useInputBalanceCheck();
  const [isTokenSearch] = useRecoilState(IsSearchToken);
  const { connectedChainId } = useConnectedNetwork();
  const [isInputAmount, setIsInputAmount] = useRecoilState(isInputTokenAmount);
  const switchable =
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Wrap" ||
    mode === "ETH-Unwrap";

  const { onCloseTokenModal, isInTokenOpen } = useTokenModal();
  const { onOpenInAmount, onOpenOutAmount } = useAmountModal();

  useEffect(() => {
    onMax();
  }, [tokenData, inToken]);

  const onKeyDown = (e: any) => {
    if (e.key === "Enter" && mobileView) {
      if (selectedInToken?.parsedAmount && isInTokenOpen && isInputAmount) {
        onCloseTokenModal();
        onOpenOutAmount();
      }
      // customRef?.current?.blur();
    }
  };

  const { totalGasCost } = useGasFee();
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  const onMax = useCallback(() => {
    if (isDisabled) return null;
    if (tokenData) {
      if (inToken && selectedInToken) {
        if (mode === "Pool") {
          setSelectedInToken({
            ...selectedInToken,
            amountBN: tokenData.data.balanceBN.value,
            parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
          });
          setLastFocused("LeftInput");
          return setTimeout(() => {
            //@ts-ignore
            inputRef?.current?.focus();
            //@ts-ignore
            inputRef?.current?.blur();
          }, 100);
        }
        if (isETH(selectedInToken)) {
          const buffer = Number(totalGasCost) * 2;
          const parsedAmount =
            Number(
              tokenData.data.parsedBalanceWithoutCommafied.replaceAll(",", "")
            ) - buffer;
          const isMinus = parsedAmount <= 0;

          const amountBN = ethers.utils.parseUnits(
            isMinus ? "0" : parsedAmount.toString(),
            18
          );
          // if (switchable && selectedOutToken) {
          //   setSelectedOutToken({
          //     ...selectedOutToken,
          //     amountBN: amountBN.toBigInt(),
          //     parsedAmount: isMinus ? "0" : parsedAmount.toString(),
          //   });
          // }

          return setSelectedInToken({
            ...selectedInToken,
            forcePosition: tokenData.data.forcePosition,
            legacyTitanHash: tokenData.data.legacyTitanHash,
            amountBN: amountBN.toBigInt(),
            parsedAmount: isMinus ? "0" : parsedAmount.toString(),
          });
        }
        return setSelectedInToken({
          ...selectedInToken,
          forcePosition: tokenData.data.forcePosition,
          legacyTitanHash: tokenData.data.legacyTitanHash,
          amountBN: tokenData.data.balanceBN.value,
          parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
        });
      }
      if (inToken === false && selectedOutToken) {
        if (mode === "Pool") {
          setSelectedOutToken({
            ...selectedOutToken,
            amountBN: tokenData.data.balanceBN.value,
            parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
          });
          setLastFocused("RightInput");
          return setTimeout(() => {
            //@ts-ignore
            inputRef?.current?.focus();
            //@ts-ignore
            inputRef?.current?.blur();
          }, 100);
        }
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: tokenData.data.balanceBN.value,
          parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
        });
      }
      return console.error("a input field not found");
    }
  }, [
    tokenData,
    inToken,
    selectedInToken,
    selectedOutToken,
    totalGasCost,
    mode,
    layer,
    isDisabled,
  ]);

  const handleFocus = () => {
    setIsFocused(true);
    setLastFocused(inToken ? "LeftInput" : "RightInput");
  };

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // setIsInputAmount(false);
    //for pool's price and amount on liquidity
    if (mode === "Pool") {
      if (inToken && selectedOutToken) {
        if (!dependentAmount) {
          return setSelectedOutToken({
            ...selectedOutToken,
            amountBN: null,
            parsedAmount: null,
          });
        }
        const parsedAmount = ethers.utils.parseUnits(
          dependentAmount,
          selectedOutToken.decimals
        );

        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: parsedAmount.toBigInt(),
          parsedAmount: dependentAmount,
        });
      }
      if (!inToken && selectedInToken) {
        if (!dependentAmount) {
          return setSelectedInToken({
            ...selectedInToken,
            amountBN: null,
            parsedAmount: null,
          });
        }
        const parsedAmount = ethers.utils.parseUnits(
          dependentAmount,
          selectedInToken.decimals
        );

        return setSelectedInToken({
          ...selectedInToken,
          amountBN: parsedAmount.toBigInt(),
          parsedAmount: dependentAmount,
        });
      }
    }
  }, [mode, inToken, selectedInToken, selectedOutToken, dependentAmount]);

  const valueProp = useMemo(() => {
    if (
      (mode === "Wrap" ||
        mode === "Unwrap" ||
        mode === "ETH-Wrap" ||
        mode === "ETH-Unwrap") &&
      inTokenFromHook?.parsedAmount
    ) {
      return inTokenFromHook.parsedAmount;
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
      : defaultValue || "";
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
    isTokenSearch,
    defaultValue,
  ]);

  const { tokenPriceWithAmount: token0PriceWithAmount } = useGetMarketPrice({
    tokenName: selectedInToken?.tokenName as string,
    amount: Number(selectedInToken?.parsedAmount?.replaceAll(",", "")),
  });

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

  const { tokenPriceWithAmount: token1PriceWithAmount } = useGetMarketPrice({
    tokenName: selectedOutToken?.tokenName as string,
    amount: Number(outAmount),
  });

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
    if (mode === "Pool") return;
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
  }, [amountOut, mode]);

  useEffect(() => {
    if (inToken && selectedInToken && tokenData) {
      return setIsMax(
        tokenData.data.balanceBN.value === selectedInToken.amountBN
      );
    }
    if (!inToken && selectedOutToken && tokenData) {
      return setIsMax(
        tokenData.data.balanceBN.value === selectedOutToken.amountBN
      );
    }
  }, [selectedInToken, selectedOutToken, inToken, tokenData]);

  const [triggerForSpinner] = useState<boolean>(false);
  const { subMode } = useGetMode();
  const isNativeToken = useMemo(() => {
    return inToken ? isETH(selectedInToken) : isETH(selectedOutToken);
  }, [inToken, selectedInToken, selectedOutToken]);

  useEffect(() => {
    setTimeout(() => {
      customRef?.current?.focus();
    }, 300);
  }, [customRef, isInputAmount]);

  useEffect(() => {
    inputRef?.current?.focus();
    if (ref.current && inToken && mobileView) {
      ref.current.style.borderColor = "#313442";
    }
  }, [inputRef, mobileView]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"space-between"}
      pb={"16px"}
      w={"100%"}
      rowGap={"6px"}
      {...style}
    >
      {triggerForSpinner && subMode.add ? (
        <Flex w={"100%"} h={"27px"}>
          <GradientSpinner />
        </Flex>
      ) : (
        <Flex flexDir={"column"}>
          {/* {mobileView && <Warning />} */}
          <Flex
            py={{ base: "7px", lg: 0 }}
            px={{ base: "10px", lg: 0 }}
            bg={{ base: "#0F0F12", lg: "none" }}
            rounded={{ base: "8px", lg: 0 }}
            align={{ base: "center", lg: "start" }}
            border={"1px solid transparent"}
            _hover={{ border: mobileView ? "1px solid #313442" : "" }}
            ref={ref}
            justify={"space-between"}
          >
            {mobileView && !valueProp && !inToken ? (
              <Flex h={"27px"} w={"20px"}>
                <GradientSpinner />
              </Flex>
            ) : (
              <Flex flexDir={"column"}>
                {/* <Warning /> */}
                <Input
                  id={inToken ? "LeftInput" : "RightInput"}
                  w={"100%"}
                  h={"27px"}
                  m={0}
                  p={0}
                  border={{}}
                  _active={{}}
                  _focus={{ boxShadow: "none !important" }}
                  placeholder={inToken ? placeholder || "0" : "0"}
                  _placeholder={{
                    color: mobileView
                      ? "#FFFFFF20 !important"
                      : "#C6C6D1 !important",
                    // fontSize: mobileView ? 20 : 28
                  }}
                  color={
                    mobileView && isBalanceOver
                      ? "#DD3A44"
                      : mobileView && !inToken
                      ? "#A0A3AD !important"
                      : "#FFFFFF"
                  }
                  fontSize={{ base: 22, lg: 28 }}
                  fontWeight={{ base: 500, lg: 600 }}
                  isDisabled={isDisabled}
                  _disabled={{ color: "#A0A3AD" }}
                  value={valueProp}
                  onChange={(e) => {}}
                  ref={customRef ? customRef : inputRef}
                  onKeyDown={onKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ caretColor: mobileView ? "#007AFF" : "#FFFFFF" }}
                ></Input>
              </Flex>
            )}

            {mobileView &&
              (marketPrice === "0.00" && !inToken ? (
                <Flex w={"20px"} h={"27px"} mr={"80px"}>
                  <GradientSpinner />
                </Flex>
              ) : (
                <Text
                  mr={"12px"}
                  fontSize={14}
                  color={"#A0A3AD"}
                >{`$${marketPrice}`}</Text>
              ))}
            {hasMaxButton && !isMax && !isNativeToken && (
              <Button
                w={"40px"}
                h={"22px"}
                bgColor={"#007AFF"}
                fontSize={12}
                fontWeight={700}
                _hover={{}}
                _active={{}}
                color={"#fff"}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onMax();
                }}
              >
                Max
              </Button>
            )}
          </Flex>
        </Flex>
      )}

      <Flex w={"100%"} justifyContent={"flex-start"} columnGap={"4px"}>
        {/* {mobileView && isBalanceOver ? (
          <Flex color={"#DD3A44"} fontSize={12} columnGap={"10px"}>
            <Image src={WARNING_RED_ICON} alt={"WARNING_ICON"} />
            <Text>Insufficient ({inTokenFromHook?.tokenSymbol}) balance </Text>
          </Flex>
        )  */}
        {mobileView ? (
          inToken && (
            // <Flex color={"#DD3A44"} fontSize={12} columnGap={"10px"}>
            //   <Image src={WARNING_RED_ICON} alt={"WARNING_ICON"} />
            //   <Text>
            //     Insufficient ({inTokenFromHook?.tokenSymbol}) balance{" "}
            //   </Text>
            // </Flex>
            <Warning />
          )
        ) : (
          <Text fontSize={12} fontWeight={500} color={"#A0A3AD"} opacity={0.8}>
            {`$${commafy(marketPrice, 2)}`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
