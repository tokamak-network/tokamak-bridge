import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useV3MintInfo } from "@/hooks/pool/useV3MintInfo";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { useSwapTokens } from "@/hooks/swap/useSwapTokens";
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
import GradientSpinner from "../ui/gradientSpinner";
import { usePriceTickConversion } from "@/hooks/pool/usePoolData";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import "@fontsource/poppins/600.css";
import WARNING_RED_ICON from "assets/icons/warningRed.svg";
import useTokenModal from "@/hooks/modal/useTokenModal";

export default function TokenInput(props: {
  inToken: boolean;
  defaultValue?: string | number | null;
  isDisabled?: boolean;
  hasMaxButton?: boolean;
  style?: {};
  customRef?: RefObject<HTMLInputElement>;
  placeholder?: string;
}) {
  const { inToken, hasMaxButton, isDisabled, style, customRef, placeholder } =
    props;
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const { amountOut } = useSwapTokens();
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
  const [lastFocused, setLastFocused] = useRecoilState(lastFocusedInput);

  const { dependentAmount: _dependentAmount } = useV3MintInfo();
  const dependentAmount = _dependentAmount?.toSignificant(
    // inToken ? inTokenInfo?.decimals : outTokenInfo?.decimals
    18
  );
  const tokenData = useTokenBalance(inToken ? inTokenInfo : outTokenInfo);
  const { mobileView } = useMediaView();
  const { isBalanceOver } = useInputBalanceCheck();
  const { onCloseTokenModal } = useTokenModal();

  const switchable =
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Wrap" ||
    mode === "ETH-Unwrap";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const value: string = e.target.value;

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

    //On Pools page
    //This token is outToken
    if (mode === "Pool" && !inToken && selectedOutToken) {
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

  const { totalGasCost } = useGasFee();
  const inputRef = useRef(null);

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
          const parsedAmount =
            Number(
              tokenData.data.parsedBalanceWithoutCommafied.replaceAll(",", "")
            ) -
            //deduct ETH for gasFee to swap on ETH pair
            Number(
              mode === "Swap"
                ? totalGasCost
                : // ? layer === "L1"
                  //   ? 0.01
                  //   : 0.001 + Number(totalGasCost)
                  totalGasCost ?? 0.001
            ) -
            (mode === "Withdraw" ? 0.00025 : 0);

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
            amountBN: amountBN.toBigInt(),
            parsedAmount: isMinus ? "0" : parsedAmount.toString(),
          });
        }
        return setSelectedInToken({
          ...selectedInToken,
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
    // onCloseTokenModal();
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
      : "";
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

  const { tokenPriceWithAmount: token0PriceWithAmount } = useGetMarketPrice({
    tokenName: selectedInToken?.tokenName as string,
    amount: Number(selectedInToken?.parsedAmount?.replaceAll(",", "")),
  });

  const { tokenPriceWithAmount: token1PriceWithAmount } = useGetMarketPrice({
    tokenName: selectedOutToken?.tokenName as string,
    amount: Number(selectedOutToken?.parsedAmount?.replaceAll(",", "")),
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
    customRef?.current?.focus();
  }, [customRef]);

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
        <Flex
          py={{ base: "7px", lg: 0 }}
          px={{ base: "10px", lg: 0 }}
          bg={{ base: "#0F0F12", lg: "none" }}
          rounded={{ base: "8px", lg: 0 }}
        >
          <Input
            id={inToken ? "LeftInput" : "RightInput"}
            w={"100%"}
            h={"27px"}
            m={0}
            p={0}
            border={{}}
            _active={{}}
            _focus={{ boxShadow: "none !important" }}
            placeholder={placeholder || "0"}
            _placeholder={{
              color: mobileView ? "#FFFFFF20 !important" : "#C6C6D1 !important",
            }}
            color={"#ffffff"}
            fontSize={{ base: 22, lg: 28 }}
            fontWeight={600}
            isDisabled={isDisabled}
            _disabled={{ color: "#fff" }}
            value={valueProp}
            ref={customRef ? customRef : inputRef}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          ></Input>
          {hasMaxButton && !isMax && (
            <Button
              w={"40px"}
              h={"22px"}
              bgColor={"#6a00f1"}
              fontSize={12}
              fontWeight={700}
              _hover={{}}
              _active={{}}
              color={"#fff"}
              mt={"3px"}
              onClick={() => onMax()}
            >
              Max
            </Button>
          )}
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
          <></>
        ) : (
          <Text fontSize={12} fontWeight={500} color={"#ffffff"} opacity={0.8}>
            {`$${marketPrice}`}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
