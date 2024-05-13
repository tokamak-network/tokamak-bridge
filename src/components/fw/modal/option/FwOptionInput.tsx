import {
  Box,
  Text,
  Flex,
  Circle,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { FwWarning } from "@/componenets/fw/components/FwWarning";
import { FwOptionCrossDetailProps } from "@/components/fw/types";

export default function FwOptionInput(props: FwOptionCrossDetailProps) {
  const { inputValue, inputWarningCheck, onInputChange } = props;
  return (
    <>
      <InputGroup my={"4px"}>
        <Input
          w={"189px"}
          h={"34px"}
          px='12px'
          py='4px'
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
          _hover={{}}
          _placeholder={{
            fontSize: "12px",
            fontWeight: "400",
            lineHeight: "26px",
            color: "#A0A3AD",
          }}
          _focus={{
            borderColor: "#59628D",
            boxShadow: "0 0 0 0.1px #59628D",
          }}
        />
        {inputValue && (
          <InputRightElement height={"34px"}>
            <Text
              pr={"12px"}
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
      {inputWarningCheck == "critical" ? (
        <FwWarning
          label={"text will be changed"}
          type={inputWarningCheck}
          style={{
            fontWeight: 400,
            fontSize: "11px",
            lineHeight: "14.3px",
            marginLeft: "6px",
          }}
        />
      ) : inputWarningCheck == "normal" ? (
        <FwWarning
          label={"text will be changed"}
          type={inputWarningCheck}
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
