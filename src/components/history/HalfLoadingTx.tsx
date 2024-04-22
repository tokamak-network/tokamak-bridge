import { Flex, Text } from "@chakra-ui/layout";
import { Button, keyframes } from "@chakra-ui/react";
import TokenPairTx from "./TokenPairTx";
import { ethers } from "ethers";
import { useToken } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import GradientSpinner from "@/components/ui/GradientSpinner";
import { Hash } from "viem";
import { supportedTokens } from "types/token/supportedToken";

const gradientAnimation = keyframes`
  0% { background-position: -200% 0%; }
  100% { background-position: 200% 0%; }
`;

export default function HalfLoadingTx(props: { tx: any }) {
  const { tx } = props;
  const { layer } = useConnectedNetwork();
  const zeroAddress = "0x0000000000000000000000000000000000000000";

  const ethToken = {
    decimals: supportedTokens[0].decimals,
    symbol: supportedTokens[0].tokenSymbol,
  };
  const { data } = useToken({
    address: layer === "L1" ? (tx._l1Token as Hash) : (tx._l2Token as Hash),
    enabled: tx._l1Token === zeroAddress ? false : true,
  });

  const token = layer === "L1" && tx._l1Token === zeroAddress ? ethToken : data;

  return (
    <Flex
      h={{ base: "73px", lg: "160px" }}
      w={{ baes: "100%", lg: "336px" }}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
      p="12px"
      flexDir={"column"}
      rowGap={"8px"}
    >
      <Flex flexDir={"column"} rowGap={"8px"} cursor={"pointer"}>
        <Flex justifyContent={"space-between"} w="100%">
          <Text fontSize={"14px"} fontWeight={600}>
            {tx.event === "withdraw" ? "Withdraw" : "Deposit"}
          </Text>
          <Button
            w={tx?.currentStatus > 5 ? "72px" : "57px"}
            h="24px"
            // bg="#007AFF"
            fontSize={"12px"}
            isDisabled={true}
            _hover={{}}
            _focus={{}}
            _active={{}}
            zIndex={1000}
            bgGradient="linear(to-r, #2b2f42 8%, #2b2f42 38%, #1c1d25 54%)"
            bgSize="200% 100%"
            animation={`${gradientAnimation} 10s linear infinite`}
          ></Button>
        </Flex>
        <TokenPairTx
          inAmount={ethers.utils.formatUnits(
            tx._amount.toString(),
            data?.decimals
          )}
          action="withdraw"
          outAmount={ethers.utils.formatUnits(
            tx._amount.toString(),
            data?.decimals
          )}
          inTokenSymbol={(token?.symbol as string) || "ETH"}
          outTokenSymbol={(token?.symbol as string) || "ETH"}
        />
      </Flex>
      <Flex w="100%" height={"18px"}>
        <GradientSpinner />
      </Flex>
      <Flex w="100%" height={"18px"}>
        <GradientSpinner />
      </Flex>
    </Flex>
  );
}
