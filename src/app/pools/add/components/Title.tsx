import { Text } from "@chakra-ui/react";

export default function Title(props: { title: string; style?: {} }) {
  return (
    <Text
      w={"100%"}
      h={"100%"}
      textAlign={"left"}
      fontSize={15}
      fontWeight={500}
      mb={"8px"}
      lineHeight={"22px"}
      {...props.style}
    >
      {props.title}
    </Text>
  );
}
