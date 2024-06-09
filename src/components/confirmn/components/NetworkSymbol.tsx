import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import { Network } from "@/componenets/historyn/types";

type TokenPairProp = {
  networkI: string | undefined;
  networkW: number;
  networkH: number;
};

const getImageProps = (network: string | undefined) => {
  if (network === Network.Mainnet || network === Network.Sepolia) {
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
