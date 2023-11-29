import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import PLUS_ICON from "assets/icons/plus.svg";
import NextLink from "next/link";
import ConnecteWalletCard from "./ConnectWalletCard";
import { useAccount } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import UnspportedNetwork from "./UnspportedNetwork";
import { ATOM_positions } from "@/recoil/pool/positions";
import { useRecoilValue } from "recoil";

export default function AddLiquidity() {
  const { isConnected } = useAccount();
  const positions = useRecoilValue(ATOM_positions);
  const { isSupportedChain } = useConnectedNetwork();

  if (!isConnected) return <ConnecteWalletCard />;
  if (!isSupportedChain) return <UnspportedNetwork />;
  return (
    <NextLink href="/pools/add" passHref>
      <Flex
        flexDir="column"
        borderWidth={1}
        borderColor={positions?.length === 0 ? "#007AFF" : "#20212B"}
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
      >
        <Text fontWeight={600} marginBottom={"61px"} fontSize={"16px"}>
          Add Liquidity
        </Text>
        <Image src={PLUS_ICON} alt={"AddLiquidityIcon"} />
        <Box
          width="100%"
          fontStyle="normal"
          fontWeight={400}
          fontSize="12px"
          lineHeight="18px"
          color="#A0A3AD"
          marginTop={"40px"} // ! sizes does not match for 54px
        >
          Earn fees when users swap
          <br />
          with your provided tokens
        </Box>
      </Flex>
    </NextLink>
  );
}
