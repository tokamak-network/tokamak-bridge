import { ImageFileType } from "@/types/style/imageFileType";
import { SupportedToken } from "@/types/token/supportedToken";
import { Box, Flex } from "@chakra-ui/layout";
import Image from "next/image";
import SYMBOL_ETH from "assets/tokens/eth.svg";
import SYMBOL_TON from "assets/tokens/ton.svg";
import SYMBOL_TOS from "assets/tokens/tos.svg";
import SYMBOL_WTON from "assets/tokens/wton.svg";
import SYMBOL_DOC from "assets/tokens/doc.svg";
import SYMBOL_AURA from "assets/tokens/aura.svg";
import SYMBOL_LYDA from "assets/tokens/lyda.svg";
import SYMBOL_USDC from "assets/tokens/usdc.svg";
import SYMBOL_NOSYMBOL from "assets/tokens/noSymbol.svg";

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

export function TokenSymbol(props: {
  tokenType: SupportedToken | String;
  w?: number;
  h?: number;
}) {
  const { tokenType } = props;
  switch (tokenType) {
    case "ETH":
      return <ImageSymbol ImgFile={SYMBOL_ETH} {...props} />;
    case "TON":
      return <ImageSymbol ImgFile={SYMBOL_TON} {...props} />;
    case "WTON":
      return <ImageSymbol ImgFile={SYMBOL_WTON} {...props} />;
    case "TOS":
      return <ImageSymbol ImgFile={SYMBOL_TOS} {...props} />;
    case "DOC":
      return <ImageSymbol ImgFile={SYMBOL_DOC} {...props} />;
    case "AURA":
      return <ImageSymbol ImgFile={SYMBOL_AURA} {...props} />;
    case "LYDA":
      return <ImageSymbol ImgFile={SYMBOL_LYDA} {...props} />;
    case "USDC":
      return <ImageSymbol ImgFile={SYMBOL_USDC} {...props} />;

    default:
      return <ImageSymbol ImgFile={SYMBOL_NOSYMBOL} {...props} />;
  }
}
