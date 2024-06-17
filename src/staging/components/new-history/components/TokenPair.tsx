import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";

import { Network } from "@/staging/types/transaction";

type TokenPairProp = {
  networkI: string | undefined;
  networkO: string | undefined;
  networkW: number;
  networkH: number;
  pairType: "pending" | "completed";
};

const getImageProps = (network: string | undefined) => {
  if (network === Network.Mainnet || network === Network.Sepolia) {
    return { src: EthNetworkSymbol, alt: "EthNetworkSymbol" };
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
