import { Flex, Box, Text } from "@chakra-ui/react";
import Image from "next/image";
import EthNetworkSymbol from "@/assets/icons/newHistory/eth-n-symbol.svg";
import TitanNetworkSymbol from "@/assets/icons/newHistory/titan-n-symbol.svg";
import ThanosNetworkSymbol from "@/assets/icons/newHistory/thanos-n-symbol.svg";
import Arrow from "@/assets/icons/newHistory/small-arrow.svg";
import { Network } from "@/staging/types/transaction";
import capitalizeFirstLetter from "@/staging/utils/capitalizeFirstLetter";

type TokenPairProp = {
  networkI: string | undefined;
  networkO: string | undefined;
  networkW: number;
  networkH: number;
};

const getImageProps = (network: string | undefined) => {
  if (network === Network.Mainnet || network === Network.Sepolia)
    return { src: EthNetworkSymbol, alt: "EthNetworkSymbol" };

  if (network === Network.Thanos || network === Network.ThanosSepolia)
    return { src: ThanosNetworkSymbol, alt: "ThanosNetworkSymbol" };

  return { src: TitanNetworkSymbol, alt: "TitanNetworkSymbol" };
};

export default function CTNetworkTransition(props: TokenPairProp) {
  const { networkI, networkO, networkH, networkW } = props;

  const inNetwork = getImageProps(networkI);
  const outNetwork = getImageProps(networkO);

  if (networkI === undefined || networkO === undefined) {
    return <></>;
  }

  const displayNetworkNameIn =
    networkI === "MAINNET" ? "Ethereum" : capitalizeFirstLetter(networkI);

  const displayNetworkNameOut =
    networkO === "MAINNET" ? "Ethereum" : capitalizeFirstLetter(networkO);

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
