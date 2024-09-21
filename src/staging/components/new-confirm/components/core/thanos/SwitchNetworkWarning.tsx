import {
  NetworkDisplayName,
  SupportedChainId,
} from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useSwitchNetwork } from "wagmi";

interface SwitchNetworkWarningComponentProps {
  chainId: SupportedChainId;
}

const SwitchNetworkWarningComponent: React.FC<
  SwitchNetworkWarningComponentProps
> = ({ chainId }) => {
  const chainName = getKeyByValue(SupportedChainId, chainId) || "";
  const displayName = NetworkDisplayName[chainName];
  const { switchNetwork } = useSwitchNetwork();
  return (
    <Flex
      py={"12px"}
      px={"16px"}
      borderRadius={"8px"}
      bgColor={"#DD3A44"}
      minHeight={"42px"}
      alignItems={"center"}
    >
      <Text fontSize={"12px"} fontWeight={400} lineHeight={"normal"}>
        {`Please switch to `}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={() => {
            return switchNetwork ? switchNetwork(chainId) : null;
          }}
        >
          {displayName}
        </span>
      </Text>
    </Flex>
  );
};

export default SwitchNetworkWarningComponent;
