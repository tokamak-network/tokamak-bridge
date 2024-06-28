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

export default function CTOptionInput(props: CTInputProps) {
  const { inputValue, inputWarningCheck, onInputChange } = props;
  return (
    <>
      <Flex w={"189px"}>
        <InputGroup my={"4px"}>
          <Input
            autoFocus
            w={"189px"}
            h={"34px"}
            px='12px'
            py='4px'
            bg='#15161D'
            type='text'
            maxLength={1}
            pattern='[012]'
            inputMode='decimal'
            border={"1px solid #313442"}
            borderRadius={"4px"}
            fontSize={"16px"}
            fontWeight={600}
            lineHeight={"26px"}
            placeholder='Enter amount'
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
          {inputValue && (
            <InputRightElement height={"34px"} mr={"8px"}>
              <Text
                fontSize={"12px"}
                fontWeight={400}
                color={"#A0A3AD"}
                lineHeight={"26px"}
              >
                USDC
              </Text>
            </InputRightElement>
          )}
        </InputGroup>
      </Flex>
      {inputWarningCheck == WarningType.Critical ? (
        <CTWarning
          label={"text will be changed"}
          type={inputWarningCheck}
          groupStyle={{
            height: "14px",
          }}
          style={{
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "14.3px",
            marginLeft: "6px",
          }}
        />
      ) : inputWarningCheck == WarningType.Normal ? (
        <CTWarning
          label={"text will be changed"}
          type={inputWarningCheck}
          groupStyle={{
            height: "14px",
          }}
          style={{
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "14.3px",
            marginLeft: "6px",
          }}
        />
      ) : null}
    </>
  );
}
