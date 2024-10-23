import { ImageFileType } from "@/types/style/imageFileType";
import { TokenInfo } from "types/token/supportedToken";
import { Box, Flex, Text } from "@chakra-ui/layout";
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
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { IsSearchToken } from "@/recoil/card/selectCard/searchToken";

export default function ImageSymbol(props: {
  ImgFile: ImageFileType;
  w?: number;
  h?: number;
  tokenType?: any;
}) {
  const [isTokenSearch, setTokenSearch] = useRecoilState(IsSearchToken);

  return (
    <motion.div
      initial={{
        width: `${props.w ?? 86}px`,
        maxWidth: `${props.w ?? 86}px`,
        height: `${props.h ?? 86}px`,
        maxHeight: `${props.h ?? 86}px`,
      }}
      animate={{
        width: `${props.w ?? 86}px`,
        maxWidth: `${props.w ?? 86}px`,
        height: `${props.h ?? 86}px`,
        maxHeight: `${props.h ?? 86}px`,
      }}
      transition={{ duration: 0.5 }}
    >
      <Flex style={{ width: `100%`, height: `100%` }}>
        {props.ImgFile !== SYMBOL_NOSYMBOL ? (
          <Image
            src={props.ImgFile}
            alt={"img"}
            style={{ width: `100%`, height: `100%` }}
          />
        ) : (
          <Box
            width={`100%`}
            height={`100%`}
            borderRadius={"300px"}
            border={"3px solid #9E9E9E"}
            background={"#FFF"}
            justifyContent={"center"}
            padding={"0px 24px"}
            display={"flex"}
            alignItems={"center"}
            flexShrink={0}
          >
            <Text
              fontSize={"22px"}
              lineHeight={"normal"}
              color={"#9E9E9E"}
              fontWeight={500}
            >
              {props.tokenType}
            </Text>
          </Box>
        )}
      </Flex>
    </motion.div>
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
