import { Flex, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import ThanosNetworkSymbol from "@/assets/icons/newHistory/thanos-n-symbol.svg";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";
import capitalizeFirstLetter from "@/staging/utils/capitalizeFirstLetter";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";

type TokenPairProp = {
  networkI: number | undefined;
  networkO: number | undefined;
  networkW: number;
  networkH: number;
};

const getImageProps = (network: number) => {
  if (
    network === SupportedChainId.MAINNET ||
    network === SupportedChainId.SEPOLIA
  ) {
    return { src: EthNetworkSymbol, alt: "EthNetworkSymbol" };
  }
  if (
    network === SupportedChainId.THANOS ||
    network === SupportedChainId.THANOS_SEPOLIA
  ) {
    return { src: ThanosNetworkSymbol, alt: "ThanosNetworkSymbol" };
  }
  return { src: TitanNetworkSymbol, alt: "TitanNetworkSymbol" };
};

export default function CTNetworkTransition(props: TokenPairProp) {
  const { networkI, networkO, networkH, networkW } = props;

  if (networkI === undefined || networkO === undefined) {
    return <></>;
  }

  const inNetwork = getImageProps(networkI);
  const outNetwork = getImageProps(networkO);

  const chainNameIn = getKeyByValue(SupportedChainId, networkI) || "";
  const chainNameOut = getKeyByValue(SupportedChainId, networkO) || "";

  const displayNetworkNameIn =
    chainNameIn === "MAINNET" ? "Ethereum" : capitalizeFirstLetter(chainNameIn);

  const displayNetworkNameOut =
    chainNameOut === "MAINNET"
      ? "Ethereum"
      : capitalizeFirstLetter(chainNameOut);

  return (
    <Flex alignItems='center'>
      <Flex>
        <Flex
          w={networkW}
          maxW={`${networkW}px`}
          h={`${networkH}px`}
          maxH={`${networkH}px`}
        >
          <Image
            src={inNetwork.src}
            alt={inNetwork.alt}
            width={networkW}
            height={networkH}
          />
        </Flex>
        <Text
          ml='4px'
          fontWeight={"400"}
          fontSize={"12px"}
          lineHeight={"14px"}
          color={"#FFFFFF"}
        >
          {displayNetworkNameIn}
        </Text>
      </Flex>
      <Box mx={"8px"}>
        <Image src={Arrow} alt={"Arrow"} />
      </Box>
      <Flex>
        <Flex
          w={networkW}
          maxW={`${networkW}px`}
          h={`${networkH}px`}
          maxH={`${networkH}px`}
        >
          <Image
            src={outNetwork.src}
            alt={outNetwork.alt}
            width={networkW}
            height={networkH}
          />
        </Flex>
        <Text
          ml='4px'
          fontWeight={"400"}
          fontSize={"12px"}
          lineHeight={"14px"}
          color={"#FFFFFF"}
        >
          {displayNetworkNameOut}
        </Text>
      </Flex>
    </Flex>
  );
}
