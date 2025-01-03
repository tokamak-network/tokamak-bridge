import { Text, Box } from "@chakra-ui/react";
import { CSSProperties } from "react";
import formatNumber from "@/staging/utils/formatNumbers";

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
    <Text style={props.style}>
      {operator && <span style={{ fontWeight: 400 }}>{operator}</span>}
      <span>
        {/** Add a space */ " "}
        {number}
        {/** Add a space */ " "}
      </span>
      {tokenSymbol}
    </Text>
  );
}
