import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";
import fetchNetworkImage from "@/staging/utils/fetchNetworkImage";
import { useMemo } from "react";

type TokenPairProp = {
  networkI: number;
  networkO: number | null;
  networkW: number;
  networkH: number;
  pairType: "pending" | "completed";
};

export default function TokenPair(props: TokenPairProp) {
  const { pairType, networkI, networkO, networkH, networkW } = props;
  const inNetwork = fetchNetworkImage(networkI);
  const outNetwork = networkO ? fetchNetworkImage(networkO) : null;

  return (
    <Box>
      <Flex alignItems="center">
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
        {outNetwork && (
          <Box mx={pairType === "pending" ? "6px" : "4px"}>
            <Image src={Arrow} alt={"Arrow"} />
          </Box>
        )}
        {outNetwork && (
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
        )}
      </Flex>
    </Box>
  );
}
