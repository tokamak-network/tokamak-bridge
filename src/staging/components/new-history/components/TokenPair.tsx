import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import ThanosNetworkSymbol from "@/assets/icons/newHistory/thanos-n-symbol.svg";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";
import { SupportedChainId } from "@/types/network/supportedNetwork";

type TokenPairProp = {
  networkI: number;
  networkO: number;
  networkW: number;
  networkH: number;
  pairType: "pending" | "completed";
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

export default function TokenPair(props: TokenPairProp) {
  const { pairType, networkI, networkO, networkH, networkW } = props;
  const inNetwork = getImageProps(networkI);
  const outNetwork = getImageProps(networkO);

  return (
    <Box>
      <Flex alignItems='center'>
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
        <Box mx={pairType === "pending" ? "6px" : "4px"}>
          <Image src={Arrow} alt={"Arrow"} />
        </Box>
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
      </Flex>
    </Box>
  );
}
