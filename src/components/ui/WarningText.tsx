import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/warning.svg";
import WARNING_RED_ICON from "assets/icons/warningRed.svg";
import { CSSProperties } from "react";

type WarningTextProps = {
  label: string;
  style?: CSSProperties;
};

export function WarningText(props: WarningTextProps) {
  const { label } = props;
  return (
    <Flex color={"#F9C03E"} fontSize={12} columnGap={"10px"}>
      <Image src={WARNING_ICON} alt={"WARNING_ICON"} />
      <Text>{label}</Text>
    </Flex>
  );
}

export function RedWarningText(props: WarningTextProps) {
  const { label } = props;
  return (
    <Flex color={"#DD3A44"} fontSize={12} columnGap={"10px"}>
      <Image src={WARNING_RED_ICON} alt={"WARNING_ICON"} />
      <Text>{label}</Text>
    </Flex>
  );
}
