import useConnectedNetwork, { useChangeNetwork } from "@/hooks/network";
import { Box, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

export function WrongNetwork(props: { style?: CSSProperties }) {
  const { switchToEthereum } = useChangeNetwork();
  const { connectedToLayer1, isConnectedToMainNetwork } = useConnectedNetwork();

  if (connectedToLayer1) return null;

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
