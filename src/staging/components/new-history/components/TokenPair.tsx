import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";
import fetchNetworkImage from "@/staging/utils/fetchNetworkImage";

type TokenPairProp = {
  networkI: number;
  networkO: number;
  networkW: number;
  networkH: number;
  pairType: "pending" | "completed";
};

export default function TokenPair(props: TokenPairProp) {
  const { pairType, networkI, networkO, networkH, networkW } = props;
  const inNetwork = fetchNetworkImage(networkI);
  const outNetwork = fetchNetworkImage(networkO);

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
