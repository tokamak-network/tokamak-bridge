import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import WARNING_ICON from "assets/icons/pool/warning.svg";
import NextLink from "next/link";
import useConnectedNetwork from "@/hooks/network";

export default function UnsupportedNetworkCard() {
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  return (
    <NextLink href="/pools/add" passHref>
      <Flex
        flexDir="column"
        border="1px solid #20212B"
        w="200px"
        h="248px"
        paddingTop={"32px"}
        paddingBottom={"24px"}
        borderRadius={"16px"}
        alignItems="center"
        textAlign="center"
        cursor={"pointer"}
        _hover={{
          border: "1px solid #007AFF",
        }}
      >
        <Text fontWeight={600} marginBottom={"61px"} fontSize={"16px"}>
          Connect Wallet
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
          Change your network on
          <br />
          {isConnectedToMainNetwork && `Metamask to Ethereum or Titan`}
          {!isConnectedToMainNetwork && `Metamask to Goerli <br /> or Titan`}
        </Box>
      </Flex>
    </NextLink>
  );
}
