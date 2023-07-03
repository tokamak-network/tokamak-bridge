import { ImageFileType } from "@/types/style/imageFileType";
import { TokenInfo } from "types/token/supportedToken";
import { Box, Flex } from "@chakra-ui/layout";
import Image from "next/image";
import SYMBOL_ETH from "assets/tokens/eth.svg";
import SYMBOL_WETH from "assets/tokens/weth.svg";
import SYMBOL_TON from "assets/tokens/ton.svg";
import SYMBOL_TOS from "assets/tokens/tos.svg";
import SYMBOL_WTON from "assets/tokens/wton.svg";
import SYMBOL_DOC from "assets/tokens/doc.svg";
import SYMBOL_AURA from "assets/tokens/aura.svg";
import SYMBOL_LYDA from "assets/tokens/lyda.svg";
import SYMBOL_USDC from "assets/tokens/usdc.svg";
import SYMBOL_USDT from "assets/tokens/usdt.svg";
import SYMBOL_NOSYMBOL from "assets/tokens/noSymbol.svg";

export default function ImageSymbol(props: {
  ImgFile: ImageFileType;
  w?: number;
  h?: number;
}) {
  return (
    <Flex
      w={`${props.w ?? 96}px`}
      maxW={`${props.w ?? 96}px`}
      h={`${props.h ?? 96}px `}
      maxH={`${props.h ?? 96}px `}
    >
      <Image
        src={props.ImgFile}
        alt={"img"}
        style={{ width: `100%`, height: `100%` }}
      />
    </Flex>
  );
}

export function TokenSymbol(props: {
  tokenType: TokenInfo["tokenSymbol"];
  w?: number;
  h?: number;
}) {
  const { tokenType } = props;

  switch (tokenType) {
    case "ETH":
      return <ImageSymbol ImgFile={SYMBOL_ETH} {...props} />;
    case "WETH":
      return <ImageSymbol ImgFile={SYMBOL_WETH} {...props} />;
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
    case "USDT":
      return <ImageSymbol ImgFile={SYMBOL_USDT} {...props} />;
    default:
      return <ImageSymbol ImgFile={SYMBOL_NOSYMBOL} {...props} />;
  }
}
