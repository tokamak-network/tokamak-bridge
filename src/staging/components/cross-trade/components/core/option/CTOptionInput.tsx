import {
  Flex,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Box,
} from "@chakra-ui/react";
import { CTWarning } from "@/staging/components/cross-trade/components/CTWarning";
import { CTInputProps } from "@/staging/components/cross-trade/types";
import { WarningType } from "@/staging/components/cross-trade/types";
import { useMemo, useState } from "react";
import { CustomTooltipWithQuestion } from "@/components/tooltip/CustomTooltip";
import commafy from "@/utils/trim/commafy";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

const formatPercentage = (value: number) => {
  const isBiggerThan100 = value > 100;
  if (isBiggerThan100) return `> 100`;
  const isMinus = value < 0;
  if (isMinus) return "> 100";
  return commafy(value);
};

export default function CTOptionInput(props: CTInputProps) {
  const {
    inputValue: _inputValue,
    inputWarningCheck,
    onInputChange,
    inTokenSymbol,
    isAdvancedActive,
    recommnededFee,
  } = props;

  const { inToken } = useInOutTokens();
  const [isFocused, setIsFocused] = useState(false);
  const inputValue = useMemo(() => {
    if (!isAdvancedActive && recommnededFee)
      return `${recommnededFee.slice(0, 12)}...`;
    if (isFocused) return _inputValue;
    if (_inputValue.length > 12) {
      return `${_inputValue.slice(0, 12)}...`;
    }
    return _inputValue;
  }, [_inputValue, isFocused, isAdvancedActive, recommnededFee]);

  const totalAmount = useMemo(() => {
    if (inToken) {
      return inToken.parsedAmount;
    }
  }, [inToken]);

  const receviedRatio = useMemo(() => {
    if (totalAmount && inputValue) {
      const ratio =
        (Number(inputValue.replaceAll("...", "")) / Number(totalAmount)) * 100;
      return formatPercentage(ratio);
    }
    return "-";
  }, [totalAmount, inputValue]);

  return (
    <Box mt={"12px"}>
      <Flex alignItems="center">
        <Text
          fontWeight={400}
          fontSize={"10px"}
          lineHeight={"20px"}
          color={"#A0A3AD"}
        >
          Service fee
        </Text>
        <CustomTooltipWithQuestion
          isGrayIcon={true}
          tooltipLabel={
            <Box fontSize={12}>
              <Text>The service fee incentivizes the liquidity provider</Text>
              <Text>to accept the request. The amount received</Text>
              <Text>on L1 is calculated after deducting this fee. </Text>
            </Box>
          }
          style={{
            width: "304px",
            height: "74px",
            tooltipLineHeight: "18px",
            px: "8px",
            py: "10px",
          }}
        />
        <Box
          w={"42px"}
          h={"15px"}
          bgColor={"#DB00FF"}
          borderRadius={4}
          fontSize={10}
          ml={"6px"}
        >
          <Text textAlign={"center"}>{receviedRatio}%</Text>
        </Box>
      </Flex>
      <Flex w={"189px"}>
        <InputGroup my={"4px"}>
          <Input
            w={"189px"}
            h={"34px"}
            px="12px"
            py="4px"
            bg="#15161D"
            type="text"
            // maxLength={1}
            pattern="[012]"
            inputMode="decimal"
            border={"1px solid #313442"}
            borderRadius={"4px"}
            fontSize={"16px"}
            fontWeight={600}
            lineHeight={"26px"}
            placeholder="Enter amount"
            onFocus={() => {
              setIsFocused(true);
            }}
            disabled={!isAdvancedActive}
            onBlur={() => setIsFocused(false)}
            onChange={onInputChange}
            value={inputValue}
            color={
              inputWarningCheck == WarningType.Critical && isAdvancedActive
                ? "#DD3A44"
                : "#FFFFFF"
            }
            _hover={{}}
            _placeholder={{
              fontSize: "12px",
              fontWeight: "400",
              lineHeight: "26px",
              color: "#A0A3AD",
              transform: "translateY(-1.5px)",
            }}
            _focus={{
              borderColor: "#59628D",
              boxShadow: "0 0 0 0.1px #59628D",
            }}
          />
          {inputValue && !isFocused && (
            <InputRightElement height={"34px"} mr={"8px"}>
              <Text
                fontSize={"12px"}
                fontWeight={400}
                color={"#A0A3AD"}
                lineHeight={"26px"}
              >
                {inTokenSymbol}
              </Text>
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>
      {isAdvancedActive && inputWarningCheck == WarningType.Critical ? (
        <CTWarning
          label={"Service fee is too high. Invalid request."}
          type={inputWarningCheck}
          groupStyle={{
            height: "16px",
          }}
          style={{
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "14.3px",
            marginLeft: "6px",
            whiteSpace: "nowrap",
          }}
        />
      ) : isAdvancedActive && inputWarningCheck == WarningType.Normal ? (
        <CTWarning
          label={"Service fee is low. May not get fulfilled."}
          type={inputWarningCheck}
          groupStyle={{
            height: "16px",
          }}
          style={{
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "14.3px",
            marginLeft: "6px",
            whiteSpace: "nowrap",
          }}
        />
      ) : null}
    </Box>
  );
}
