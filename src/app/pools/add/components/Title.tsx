import { Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

export default function Title(props: { title: string; style?: CSSProperties }) {
  return (
    <Text
      w={"100%"}
      h={"23px"}
      textAlign={"left"}
      fontSize={15}
      fontWeight={500}
      mb={"8px"}
      lineHeight={"22px"}
      style={props?.style}
    >
      {props.title}
    </Text>
  );
}
