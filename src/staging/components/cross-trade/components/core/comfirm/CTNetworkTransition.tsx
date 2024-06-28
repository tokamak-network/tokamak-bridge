import { Flex, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";
import capitalizeFirstLetter from "@/staging/utils/capitalizeFirstLetter";
import fetchNetworkImage from "@/staging/utils/fetchNetworkImage";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";

type TokenPairProp = {
  networkI: number | undefined;
  networkO: number | undefined;
  networkW: number;
  networkH: number;
};

export default function CTNetworkTransition(props: TokenPairProp) {
  const { networkI, networkO, networkH, networkW } = props;

  if (networkI === undefined || networkO === undefined) {
    return <></>;
  }

  const inNetwork = fetchNetworkImage(networkI);
  const outNetwork = fetchNetworkImage(networkO);

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
