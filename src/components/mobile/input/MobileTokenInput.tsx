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
import GradientSpinner from "../../ui/GradientSpinner";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import "@fontsource/poppins/600.css";
import useTokenModal from "@/hooks/modal/useTokenModal";
import {
  IsSearchToken,
  isInputTokenAmount,
} from "@/recoil/card/selectCard/searchToken";
import Warning from "@/app/BridgeSwap/Warning";

import useAmountModal from "@/hooks/modal/useAmountModal";
import { mobileTokenModalStatus } from "@/recoil/mobile/atom";

export default function MobileTokenInput(props: {
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
    initializeTokenPairAmount,
  } = useInOutTokens();
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const { layer } = useConnectedNetwork();
  const [isMax, setIsMax] = useState<boolean>(false);
  const [isCursorBol, setIsCursorBol] = useState<boolean>(false);
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
  const { onOpenInAmount, onOpenOutAmount, onCloseAmountModal } =
    useAmountModal();
  const [, setMobileTokenModal] = useRecoilState(mobileTokenModalStatus);
  const [preventBlur, setPreventBlur] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsMax(false);
    if (isDisabled) return;
    const value: string = e.target.value === "." ? "0." : e.target.value;

    //for wrap/unwrap switch
    if (inToken && switchable) {
      if (selectedInToken && selectedOutToken) {
        if (value === "") {
          setSelectedOutToken({
            ...selectedOutToken,
            amountBN: null,
            parsedAmount: null,
          });

          return setSelectedInToken({
            ...selectedInToken,
            amountBN: null,
            parsedAmount: null,
          });
        }
        const parsedAmountOut = ethers.utils.parseUnits(
          value,
          selectedOutToken?.decimals
        );
        const parsedAmountIn = ethers.utils.parseUnits(
          value,
          selectedInToken?.decimals
        );
        setSelectedInToken({
          ...selectedInToken,
          amountBN: parsedAmountIn.toBigInt(),
          parsedAmount: value,
        });
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: parsedAmountOut.toBigInt(),
          parsedAmount: value,
        });
      }
    }

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

  const { totalGasCost } = useGasFee();
  const inputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLInputElement>(null);

  const onMax = useCallback(() => {
    if (isDisabled) return null;
    setIsMax(true);

    if (tokenData) {
      if (inToken && selectedInToken) {
        // Value must be set when wrapping and using Max
        if (switchable && selectedOutToken) {
          setSelectedOutToken({
            ...selectedOutToken,
            amountBN: tokenData.data.balanceBN.value,
            parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
          });
        }

        setIsCursorBol(true);
        return setSelectedInToken({
          ...selectedInToken,
          amountBN: tokenData.data.balanceBN.value,
          parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
        });
      }
      if (inToken === false && selectedOutToken) {
        // Value must be set when wrapping and using Max
        if (switchable && selectedInToken) {
          setSelectedInToken({
            ...selectedInToken,
            amountBN: tokenData.data.balanceBN.value,
            parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
          });
        }

        setIsCursorBol(true);
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: tokenData.data.balanceBN.value,
          parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
        });
      }
      return console.error("a input field not found");
    }
  }, [
    customRef,
    inputRef,
    tokenData,
    inToken,
    selectedInToken,
    selectedOutToken,
    totalGasCost,
    mode,
    layer,
    isDisabled,
  ]);

  // Logic related to the Max value
  useEffect(() => {
    const maxValue = tokenData?.data.balanceBN.value
      ? ethers.BigNumber.from(tokenData.data.balanceBN.value)
      : ethers.constants.Zero;

    const inputValue = selectedInToken?.amountBN
      ? ethers.BigNumber.from(selectedInToken.amountBN.toString())
      : ethers.constants.Zero;

    setIsMax(maxValue.eq(inputValue));

    if (isCursorBol) {
      const inputElement = customRef ? customRef.current : inputRef.current;
      if (inputElement) {
        const originalType = inputElement.type;
        inputElement.type = "text";
        inputElement.focus();
        inputElement.setSelectionRange(0, 0);
        inputElement.type = originalType;
      }
      setIsCursorBol(false);
    }
  }, [selectedInToken?.amountBN, tokenData?.data.balanceBN.value, isMax]);

  const handleFocus = () => {
    setIsFocused(true);
    setLastFocused(inToken ? "LeftInput" : "RightInput");
  };

  const handleCommonLogic = () => {
    setMobileTokenModal(true);
    if (selectedInToken && !(selectedInToken?.parsedAmount && isInTokenOpen)) {
      setSelectedInToken({
        ...selectedInToken,
        amountBN: null,
        parsedAmount: "0",
      });
    }
    onCloseTokenModal();
    onCloseAmountModal();
  };

  const handleBlur = (e: any) => {
    if (preventBlur) {
      setPreventBlur(false);
      return;
    }
    handleCommonLogic();
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setPreventBlur(true);
      handleCommonLogic();
    }
  };

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

  const { currentPrice } = usePriceTickConversion();
  const [triggerForSpinner, setTriggerForSpinner] = useState<boolean>(false);
  const { subMode } = useGetMode();

  useEffect(() => {
    if (currentPrice) {
      setTriggerForSpinner(true);
      initializeTokenPairAmount();
      setTimeout(() => {
        setTriggerForSpinner(false);
      }, 1000);
    }
  }, [currentPrice]);

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
      pb={"4px"}
      w={"100%"}
      rowGap={"6px"}
      {...style}
    >
      {triggerForSpinner && subMode.add ? (
        <Flex w={"100%"} h={"27px"}>
          <GradientSpinner />
        </Flex>
      ) : (
        <Flex
          flexDir={"column"}
          border="1px solid"
          borderColor="#59628d"
          borderRadius="8px"
        >
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
              <Flex align={"center"} justify={"space-between"} w={"100%"}>
                {/* <Warning /> */}
                <Input
                  autoFocus
                  autoComplete="off"
                  type="number"
                  pattern="[0-9]*"
                  flexGrow={1}
                  inputMode="decimal"
                  id={inToken ? "LeftInput" : "RightInput"}
                  w={"100%"}
                  h={"24px"}
                  m={0}
                  p={0}
                  border={{}}
                  _active={{}}
                  _focus={{ boxShadow: "none !important" }}
                  placeholder={inToken ? placeholder || "0" : "0"}
                  _placeholder={{
                    color: "A0A3AD !important",
                    // fontSize: mobileView ? 20 : 28
                    fontWeight: "400 !important",
                    fontSize: "16px !important",
                  }}
                  color={
                    mobileView && isBalanceOver
                      ? "#DD3A44"
                      : mobileView && !inToken
                      ? "#A0A3AD !important"
                      : "#FFFFFF"
                  }
                  fontSize={"16px"}
                  fontWeight={600}
                  isDisabled={isDisabled}
                  _disabled={{ color: "#A0A3AD" }}
                  value={valueProp}
                  ref={customRef ? customRef : inputRef}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{ caretColor: "#FFFFFF" }}
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
                  ml={"5px"}
                  fontSize={14}
                  color={"#A0A3AD"}
                >{`$${marketPrice}`}</Text>
              ))}
            {hasMaxButton && !isMax && (
              <Button
                w={"40px"}
                h={"22px"}
                ml={"5px"}
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
    </Flex>
  );
}
