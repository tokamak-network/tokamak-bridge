import { Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import ETH from "assets/tokens/ETH2.svg";
import ETH_Rounded from "assets/tokens/eth_half_rounded.svg";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useConnectedNetwork from "@/hooks/network";

const EthereumContainer = () => {
  const { mobileView, pcView } = useMediaView();
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  return (
    <Flex
      bg="#0F0F12"
      w={{ base: "full", lg: "176px" }}
      h={{ base: "148px", lg: "172px" }}
      border={"1px solid #313442"}
      borderRadius={"12px"}
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image
        src={mobileView ? ETH_Rounded : ETH}
        alt="ETH"
        height={40}
        width={40}
      />
      {/* <TokenSymbol
          tokenType={
            tx ? (tx.inTokenSymbol as string) : (inToken?.tokenSymbol as string)
          }
          w={40}
          h={40}
        /> */}
      <Text fontSize={"16px"} mt="12px" fontWeight={500}>
        {isConnectedToMainNetwork ? "Ethereum" : "Goerli"}
      </Text>
    </Flex>
  );
};

export default EthereumContainer;
