import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/fw/warning.svg";
import WARNING_RED_ICON from "assets/icons/fw/warningRed.svg";
import { CSSProperties } from "react";

type WarningTextProps = {
  label: string;
  type: "normal" | "critical";
  style: CSSProperties;
};

export function FwWarning(props: WarningTextProps) {
  const { label, type, style } = props;
  const iconSrc = type === "critical" ? WARNING_RED_ICON : WARNING_ICON;
  const color = type === "critical" ? "#DD3A44" : "#F9C03E";

  return (
    <Flex>
      <Image src={iconSrc} alt={"WARNING_ICON"} />
      <Text color={color} style={style}>
        {label}
      </Text>
    </Flex>
  );
}
