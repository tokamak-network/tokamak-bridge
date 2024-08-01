import { Text, TextProps } from "@chakra-ui/react";
import "@fontsource/quicksand/500.css";

type TokenTitleProps = {
  tokenName: string | String;
  isName: boolean;
  style?: TextProps;
};

export default function TokenTitle(props: TokenTitleProps) {
  const { style } = props;
  return (
    <Text
      w={props.isName ? "110px" : "60px"}
      fontSize={props.isName ? 18 : 14}
      fontWeight={props.isName ? 700 : 400}
      color={"#222222"}
      textAlign={props.isName ? "left" : "right"}
      lineHeight={props?.isName ? "20px" : ""}
      zIndex={100}
      {...props.style}
    >
      {/* {props.tokenName.toUpperCase()} */}
      {props.tokenName}
    </Text>
  );
}
