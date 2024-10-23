import useConnectedNetwork, { useChangeNetwork } from "@/hooks/network";
import { Box, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { useAccount } from "wagmi";

export function WrongNetwork(props: { style?: CSSProperties }) {
  const { switchToEthereum } = useChangeNetwork();
  const { connectedToLayer1, isConnectedToMainNetwork } = useConnectedNetwork();
  const { isConnected } = useAccount();

  if (!isConnected || connectedToLayer1) return null;

  return (
    <Box
      px={"16px"}
      py={"12px"}
      justifyContent={"center"}
      alignItems={"flex-start"}
      gap={"4px"}
      bg={"#15161D"}
      borderRadius={"8px"}
      bgColor={"#DD3A44"}
      style={props?.style}
    >
      <Text
        fontWeight={400}
        fontSize={"12px"}
        lineHeight={"18px"}
        color={"#fff"}
        onClick={switchToEthereum}
        cursor={"pointer"}
      >
        Please switch to{" "}
        <span style={{ textDecoration: "underline" }}>
          {isConnectedToMainNetwork ? "Ethereum" : "Sepolia"}
        </span>
      </Text>
    </Box>
  );
}

export function SwitchToTestNetwork(props: { style?: CSSProperties }) {
  const { switchToSepolia } = useChangeNetwork();
  const { connectedToLayer1, isConnectedToMainNetwork, isSupportedChain } =
    useConnectedNetwork();

  if (!isConnectedToMainNetwork && isSupportedChain) return null;

  return (
    <Box
      w={"100%"}
      px={"16px"}
      py={"12px"}
      justifyContent={"center"}
      alignItems={"flex-start"}
      gap={"4px"}
      bg={"#15161D"}
      borderRadius={"8px"}
      bgColor={"#DD3A44"}
      style={props?.style}
    >
      <Text
        fontWeight={400}
        fontSize={"12px"}
        lineHeight={"18px"}
        color={"#fff"}
      >
        Please switch to{" "}
        <span
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={switchToSepolia}
        >
          {"Sepolia"}
        </span>
        <br />
        <span>
          Only use while connected to Sepolia or Titan Sepolia—not on mainnet.
        </span>
      </Text>
    </Box>
  );
}
