import useConnectedNetwork, { useChangeNetwork } from "@/hooks/network";
import { Box, Text } from "@chakra-ui/react";

export function WrongNetwork() {
  const { switchToEthereum } = useChangeNetwork();
  const { connectedToLayer1, isConnectedToMainNetwork } = useConnectedNetwork();

  if (connectedToLayer1) return null;

  return (
    <Box
      my={"16px"}
      px={"16px"}
      py={"12px"}
      justifyContent={"center"}
      alignItems={"flex-start"}
      gap={"4px"}
      bg={"#15161D"}
      borderRadius={"8px"}
      border={"1px solid #DD3A44"}
    >
      <Text
        fontWeight={400}
        fontSize={"12px"}
        lineHeight={"18px"}
        color={"#DD3A44"}
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
