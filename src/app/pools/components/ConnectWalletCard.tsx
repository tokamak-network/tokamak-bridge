import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WALLET_ICON from "assets/icons/pool/wallet.svg";
import useConnectWallet from "@/hooks/account/useConnectWallet";

export default function ConnecteWalletCard() {
  const { connectToWallet } = useConnectWallet();

  return (
    <Flex
      flexDir="column"
      border="1px solid #007AFF"
      w="200px"
      h="248px"
      paddingTop={"32px"}
      paddingBottom={"24px"}
      borderRadius={"16px"}
      justifyContent={"center"}
      alignItems="center"
      textAlign="center"
      cursor={"pointer"}
      _hover={{
        border: "1px solid #007AFF",
      }}
      onClick={() => connectToWallet()}
    >
      <Text fontWeight={600} marginBottom={"61px"} fontSize={"16px"}>
        Connect Wallet
      </Text>
      <Image src={WALLET_ICON} alt={"WALLET_ICON"} />
      <Box
        width="100%"
        fontStyle="normal"
        fontWeight={400}
        fontSize="12px"
        lineHeight="18px"
        color="#A0A3AD"
        marginTop={"40px"} // ! sizes does not match for 54px
      >
        Your active V3 liquidity
        <br />
        positions will appear here.
      </Box>
    </Flex>
  );
}
