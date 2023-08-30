import { Text, Flex } from "@chakra-ui/layout";
import { NetworkSymbol } from "../image/NetworkSymbol";
import useConnectedNetwork from "@/hooks/network";
import Image from "next/image";
import WARNING_ICON from "assets/icons/pool/unsupportedNetworkWarning.svg";
import { useAccount } from "wagmi";
import { capitalizeFirstChar } from "@/utils/trim/capitalizeChar";

export default function Network() {
  const {
    connectedChainId,
    isConnectedToMainNetwork,
    chainName,
    isSupportedChain,
  } = useConnectedNetwork();
  const { isConnected } = useAccount();

  if (isConnected && !isSupportedChain) {
    return (
      <Flex
        bgColor={"#1F2128"}
        w={"48px"}
        h={"48px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={"8px"}
        borderRadius={"8px"}
      >
        <Image
          src={WARNING_ICON}
          alt={"WARNING_ICON"}
          style={{ width: "34px", height: "34px" }}
        />
      </Flex>
    );
  }
  return (
    <Flex
      bgColor={"#1F2128"}
      minW={"48px"}
      h={"48px"}
      alignItems={"center"}
      columnGap={"8px"}
      px={isConnectedToMainNetwork ? "8px" : "12px"}
      borderRadius={"8px"}
    >
      <NetworkSymbol
        network={connectedChainId ?? 1}
        w={24}
        h={24}
        isCircle={true}
      />
      {isConnected && !isConnectedToMainNetwork && (
        <Text>{capitalizeFirstChar(chainName)}</Text>
      )}
    </Flex>
  );
}
