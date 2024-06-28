import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";

type TokenPairProp = {
  networkI: number | undefined;
  networkW: number;
  networkH: number;
};

const getImageProps = (network: number | undefined) => {
  if (network === 1 || network === 11155111) {
    return { src: EthNetworkSymbol, alt: "EthNetworkSymbol" };
  }
  return { src: TitanNetworkSymbol, alt: "TitanNetworkSymbol" };
};

export default function NetworkSymbol(props: TokenPairProp) {
  const { networkI, networkH, networkW } = props;
  const inNetwork = getImageProps(networkI);

  return (
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
    </Flex>
  );
}
