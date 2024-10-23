import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/ct/warning.svg";
import WARNING_RED_ICON from "assets/icons/ct/warningRed.svg";
import { CSSProperties } from "react";

type WarningTextProps = {
  label: string;
  type: "normal" | "critical";
  style: CSSProperties;
  groupStyle: CSSProperties;
};

export function CTWarning(props: WarningTextProps) {
  const { label, type, style, groupStyle } = props;
  const iconSrc = type === "critical" ? WARNING_RED_ICON : WARNING_ICON;
  const color = type === "critical" ? "#DD3A44" : "#F9C03E";

  return (
    <Flex style={groupStyle}>
      <Image src={iconSrc} alt={"WARNING_ICON"} />
      <Text color={color} style={style}>
        {label}
      </Text>
    </Flex>
  );
}
