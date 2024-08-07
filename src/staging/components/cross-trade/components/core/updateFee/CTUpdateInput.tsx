import React, { useRef, useState } from "react";
import {
  Box,
  Text,
  Flex,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import Image from "next/image";
import { CTInputProps } from "@/staging/components/cross-trade/types";
import CTReCircle from "assets/icons/ct/ctReCircle.svg";
import CTReCirclePurple from "assets/icons/ct/ctReCircle_purple.svg";
import CTUsdcSymbol from "assets/icons/ct/ctUsdcSymbol.svg";
import { CTWarning } from "@/staging/components/cross-trade/components/CTWarning";
import { WarningType } from "@/staging/components/cross-trade/types";
import { TransactionToken } from "@/staging/types/transaction";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { TokenInfo } from "@/types/token/supportedToken";

interface AdditionalDetailProps {
  recommendCheck: boolean;
  recommendValue: string;
  onRecommendRefresh: () => void;
  tokenInfo: TransactionToken;
}

export default function CTUpdateInput(
  props: CTInputProps & AdditionalDetailProps
) {
  const {
    inputValue,
    inputWarningCheck,
    onInputChange,
    onInputFocus,
    recommendCheck,
    recommendValue,
    onRecommendRefresh,
    tokenInfo,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleBoxClick = () => {
    if (inputRef.current) {
      // onfocus 트리거
      inputRef.current.focus();
      setIsFocused(true);
    }
  };
  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <>
      <Box
        px={"16px"}
        py={"8px"}
        bg={"#1F2128"}
        borderRadius={"8px"}
        border={isFocused ? "1px solid #59628D" : "1px solid #313442"}
        onClick={handleBoxClick}
        cursor="pointer"
      >
        <Flex justifyContent="space-between">
          <Text
            lineHeight={"18px"}
            fontWeight={500}
            fontSize={"12px"}
            color={"#A0A3AD"}
          >
            New
          </Text>
          <Box
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              onRecommendRefresh();
              //상위 onclick에 이벤트 버블링 안되게 막음
              event.stopPropagation();
            }}
            cursor="pointer"
          >
            {recommendCheck ? (
              <Image src={CTReCircle} alt={"CTReCircle"} />
            ) : (
              <Image src={CTReCirclePurple} alt={"CTReCirclePurple"} />
            )}
          </Box>
        </Flex>
        <InputGroup mt={"4px"} height={"38px"}>
          <Input
            ref={inputRef}
            type="text"
            pattern="[012]"
            width={"260px"}
            pl={0}
            fontWeight={600}
            fontSize={"24px"}
            height={"38px"}
            lineHeight={"38px"}
            border={"none"}
            onChange={onInputChange}
            onFocus={onInputFocus}
            onBlur={handleBlur}
            value={inputValue}
            placeholder={recommendCheck ? recommendValue : ""}
            _placeholder={{
              color: "#A0A3AD",
            }}
            color={
              inputWarningCheck == WarningType.Critical ? "#DD3A44" : "#FFFFFF"
            }
            _hover={{ border: "none" }}
            _focus={{ boxShadow: "none", border: "none" }}
          />
          <InputRightElement mr={"7px"}>
            <Flex alignItems={"center"}>
              <TokenSymbol
                tokenType={tokenInfo.symbol as TokenInfo["tokenSymbol"]}
                w={20}
                h={20}
              />
              <Text
                ml={"4px"}
                fontSize={"16px"}
                fontWeight={400}
                color={"#FFFFFF"}
                lineHeight={"24px"}
              >
                {tokenInfo.symbol}
              </Text>
            </Flex>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box mt={"8px"}>
        {inputWarningCheck == WarningType.Critical ? (
          <CTWarning
            label={"Service fee is too high. Invalid request."}
            type={inputWarningCheck}
            groupStyle={{
              height: "16px",
            }}
            style={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "15.6px",
              marginLeft: "6px",
            }}
          />
        ) : inputWarningCheck == WarningType.Normal ? (
          <CTWarning
            label={"Service fee is low. May take long time"}
            type={inputWarningCheck}
            groupStyle={{
              height: "16px",
            }}
            style={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "15.6px",
              marginLeft: "6px",
            }}
          />
        ) : null}
      </Box>
    </>
  );
}
