import { ImageFileType } from "@/types/style/imageFileType";
import { TokenInfo } from "types/token/supportedToken";
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

// Network SYMBOls
import NW_SYMBOL_MAINNET_ETH from "assets/icons/network/mainnet.svg";
import NW_SYMBOL_TITAN from "assets/icons/network/titan.svg";

export default function ImageSymbol(props: {
  ImgFile: ImageFileType;
  w?: number;
  h?: number;
}) {
  return (
    <Flex w={`${props.w ?? 96}px`} h={`${props.h ?? 96}px`}>
      <Image
        src={props.ImgFile}
        alt={"img"}
        style={{ width: "100%", height: "100%" }}
      />
    </Flex>
  );
}

export function TokenSymbol(props: {
  tokenType: TokenInfo["tokenName"];
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

export function NetworkSymbol(props: {
  networkType: string;
  w?: number;
  h?: number;
}) {
  const { networkType } = props;
  switch (networkType) {
    case "Ethereum Mainnet":
      return <ImageSymbol ImgFile={NW_SYMBOL_MAINNET_ETH} {...props} />;
    case "Goerli":
      return <ImageSymbol ImgFile={NW_SYMBOL_MAINNET_ETH} {...props} />;
    case "Titan":
      return <ImageSymbol ImgFile={NW_SYMBOL_TITAN} {...props} />;
    case "Titan_Goerli":
      return <ImageSymbol ImgFile={NW_SYMBOL_TITAN} {...props} />;
    default:
      return <ImageSymbol ImgFile={NW_SYMBOL_MAINNET_ETH} {...props} />;
  }
}
