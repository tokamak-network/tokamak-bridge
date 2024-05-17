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
import { FwInputProps } from "@/components/fw/types";
import FwReCircle from "assets/icons/fw/fwReCircle.svg";
import FwReCirclePurple from "assets/icons/fw/fwReCircle_purple.svg";
import FwUsdcSymbol from "assets/icons/fw/fwUsdcSymbol.svg";
import { FwWarning } from "@/components/fw/components/FwWarning";
import { WarningType } from "@/components/fw/types";

interface AdditionalDetailProps {
  recommendCheck: boolean;
  recommendValue: string;
  onRecommendRefresh: () => void;
}

export default function FwUpdateInput(
  props: FwInputProps & AdditionalDetailProps
) {
  const {
    inputValue,
    inputWarningCheck,
    onInputChange,
    onInputFocus,
    recommendCheck,
    recommendValue,
    onRecommendRefresh,
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
        cursor='pointer'
      >
        <Flex justifyContent='space-between'>
          <Text
            lineHeight={"normal"}
            fontWeight={500}
            fontSize={"12px"}
            color={"#A0A3AD"}
          >
            New fee
          </Text>
          <Box
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              onRecommendRefresh();
              //상위 onclick에 이벤트 버블링 안되게 막음
              event.stopPropagation();
            }}
            cursor='pointer'
          >
            {recommendCheck ? (
              <Image src={FwReCircle} alt={"FwReCircle"} />
            ) : (
              <Image src={FwReCirclePurple} alt={"FwReCirclePurple"} />
            )}
          </Box>
        </Flex>
        <InputGroup mt={"4px"}>
          <Input
            ref={inputRef}
            type='text'
            maxLength={1}
            pattern='[012]'
            width={"260px"}
            pl={0}
            fontWeight={600}
            fontSize={"24px"}
            lineHeight={"38px"}
            border={"none"}
            onChange={onInputChange}
            onFocus={onInputFocus}
            onBlur={handleBlur}
            value={inputValue}
            placeholder={recommendCheck ? recommendValue : ""}
            color={
              inputWarningCheck == WarningType.Critical ? "#DD3A44" : "#FFFFFF"
            }
            _hover={{ border: "none" }}
            _focus={{ boxShadow: "none", border: "none" }}
          />
          <InputRightElement mr={"24px"}>
            <Flex>
              <Image src={FwUsdcSymbol} alt={"FwUsdcSymbol"} />
              <Text
                ml={"4px"}
                fontSize={"16px"}
                fontWeight={400}
                color={"#FFFFFF"}
                lineHeight={"24px"}
              >
                USDC
              </Text>
            </Flex>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box mt={"8px"}>
        {inputWarningCheck == WarningType.Critical ? (
          <FwWarning
            label={"text will be changed"}
            type={inputWarningCheck}
            style={{
              fontWeight: 400,
              fontSize: "12px",
              lineHeight: "15.6px",
              marginLeft: "6px",
            }}
          />
        ) : inputWarningCheck == WarningType.Normal ? (
          <FwWarning
            label={"text will be changed"}
            type={inputWarningCheck}
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
