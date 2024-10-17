import {
  Flex,
  Text,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { CTWarning } from "@/staging/components/cross-trade/components/CTWarning";
import { CTInputProps } from "@/staging/components/cross-trade/types";
import { WarningType } from "@/staging/components/cross-trade/types";
import { useMemo, useState } from "react";

export default function CTOptionInput(props: CTInputProps) {
  const {
    inputValue: _inputValue,
    inputWarningCheck,
    onInputChange,
    inTokenSymbol,
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const inputValue = useMemo(() => {
    if (isFocused) return _inputValue;
    if (_inputValue.length > 12) {
      return `${_inputValue.slice(0, 12)}...`;
    }
    return _inputValue;
  }, [_inputValue, isFocused]);

  return (
    <>
      <Flex w={"189px"}>
        <InputGroup my={"4px"}>
          <Input
            w={"189px"}
            h={"34px"}
            px='12px'
            py='4px'
            bg='#15161D'
            type='text'
            // maxLength={1}
            pattern='[012]'
            inputMode='decimal'
            border={"1px solid #313442"}
            borderRadius={"4px"}
            fontSize={"16px"}
            fontWeight={600}
            lineHeight={"26px"}
            placeholder='Enter amount'
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            onChange={onInputChange}
            value={inputValue}
            color={
              inputWarningCheck == WarningType.Critical ? "#DD3A44" : "#FFFFFF"
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
      {inputWarningCheck == WarningType.Critical ? (
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
      ) : inputWarningCheck == WarningType.Normal ? (
        <CTWarning
          label={"Service fee is low. May take long time."}
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
    </>
  );
}
