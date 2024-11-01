import { Text, Box, Flex } from "@chakra-ui/react";
import { CSSProperties } from "react";
import formatNumber from "@/staging/utils/formatNumbers";
import { convertNumber } from "@/utils/trim/convertNumber";
import CustomTooltip from "@/components/tooltip/CustomTooltip";

// FormatNumber.tsx
interface StyledNumberProps {
  style: CSSProperties;
  value: string | null | undefined;
  tokenSymbol?: string | String | undefined;
}
export function FormatNumber(props: StyledNumberProps) {
  const { value, tokenSymbol } = props;
  const formattedValue = formatNumber(value) ?? "";

  const operator =
    formattedValue.startsWith("<") || formattedValue.startsWith(">")
      ? formattedValue[0]
      : "";
  const number = operator ? formattedValue.substring(1).trim() : formattedValue;

  return (
    <Flex gap={"4px"}>
      <CustomTooltip
        content={
          <Text style={props.style}>
            {operator && <span style={{ fontWeight: 400 }}>{operator}</span>}
            <span>
              {/** Add a space */ " "}
              {number}
            </span>
          </Text>
        }
        tooltipLabel={value}
        style={{
          top: "10px",
        }}
      ></CustomTooltip>
      {tokenSymbol && <Text style={props.style}>{`${tokenSymbol}`}</Text>}
    </Flex>
  );
}
