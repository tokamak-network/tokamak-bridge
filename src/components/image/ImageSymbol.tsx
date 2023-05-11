import { ImageFileType } from "@/types/style/imageFileType";
import { SupportedToken } from "@/types/token/supportedToken";
import { Box, Flex } from "@chakra-ui/layout";
import Image from "next/image";
import SYMBOL_ETH from "assets/tokens/eth.svg";

export default function ImageSymbol(props: {
  ImgFile: ImageFileType;
  w?: number;
  h?: number;
}) {
  return (
    <Flex w={`${props.w}px`} h={`${props.h}px`}>
      <Image src={props.ImgFile} alt={"img"} />
    </Flex>
  );
}

export function SupportedImageSymbol(props: {
  tokenType: SupportedToken;
  w?: number;
  h?: number;
}) {
  const { tokenType } = props;
  switch (tokenType) {
    case "ETH":
      return <ImageSymbol ImgFile={SYMBOL_ETH} {...props} />;
    default:
      return <Box w={"100%"} h={"100%"} bgColor={"#ffffff"}></Box>;
  }
}
