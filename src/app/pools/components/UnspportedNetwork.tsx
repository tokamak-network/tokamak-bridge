import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/pool/unsupportedNetworkWarning.svg";
import useConnectWallet from "@/hooks/account/useConnectWallet";

export default function UnspportedNetwork() {
  const { connectToWallet } = useConnectWallet();

  return (
    <Flex
      flexDir="column"
      border="1px solid #20212B"
      w="200px"
      h="248px"
      paddingTop={"32px"}
      paddingBottom={"24px"}
      borderRadius={"16px"}
      justifyContent={"center"}
      alignItems="center"
      textAlign="center"
      cursor={"pointer"}
      onClick={() => connectToWallet()}
    >
      <Text fontWeight={600} marginBottom={"61px"} fontSize={"16px"}>
        Unspported Network
      </Text>
      <Image src={WARNING_ICON} alt={"WARNING_ICON"} />
      <Box
        width="100%"
        fontStyle="normal"
        fontWeight={400}
        fontSize="12px"
        lineHeight="18px"
        color="#A0A3AD"
        marginTop={"40px"} // ! sizes does not match for 54px
      >
        Change your network
        <br />
        on Metamask
      </Box>
    </Flex>
  );
}
