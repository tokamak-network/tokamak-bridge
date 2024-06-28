import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import fetchNetworkImage from "@/staging/utils/fetchNetworkImage";

type TokenPairProp = {
  networkI: number;
  networkW: number;
  networkH: number;
};

export default function NetworkSymbol(props: TokenPairProp) {
  const { networkI, networkH, networkW } = props;
  const inNetwork = fetchNetworkImage(networkI);

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
