import { Flex, Box, Text } from "@chakra-ui/react";
import Title from "../../add/components/Title";
import TokenCard from "@/components/card/TokenCard";
import add from "assets/icons/addIcon.svg";
import Image from "next/image";
import TokenInput from "@/components/input/TokenInput";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { TokenInfo } from "@/types/token/supportedToken";
import useConnectedNetwork from "@/hooks/network";
import { getWETHAddress } from "@/utils/token/isETH";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { TokenInputForLiquidity } from "./TokenInputForLiquidity";

export default function AddMoreLiquidity() {
  const { info } = usePositionInfo();
  const { inverted } = usePoolInfo();

  const { chainName } = useConnectedNetwork();

  if (!info || !chainName) return null;

  const token0 = info.token0;
  const token1 = info.token1;

  const token0Info: TokenInfo = {
    tokenName: token0.name ?? "",
    tokenSymbol: token0.symbol ?? "",
    address: {
      MAINNET: token0.address,
      GOERLI: token0.address,
      TITAN: token0.address,
      DARIUS: token0.address,
    },
    isNativeCurrency:
      token0.address === getWETHAddress(chainName)
        ? [
            SupportedChainId.MAINNET,
            SupportedChainId.GOERLI,
            SupportedChainId.TITAN,
            SupportedChainId.DARIUS,
          ]
        : null,
    decimals: token0.decimals,
  };

  const token1Info: TokenInfo = {
    tokenName: token1.name ?? "",
    tokenSymbol: token1.symbol ?? "",
    address: {
      MAINNET: token1.address,
      GOERLI: token1.address,
      TITAN: token1.address,
      DARIUS: token1.address,
    },
    isNativeCurrency:
      token1.address === getWETHAddress(chainName)
        ? [
            SupportedChainId.MAINNET,
            SupportedChainId.GOERLI,
            SupportedChainId.TITAN,
            SupportedChainId.DARIUS,
          ]
        : null,
    decimals: token1.decimals,
  };

  return (
    <Flex flexDir={"column"} justifyContent={"flex-start"}>
      <Title title="Add more liquidity" />
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Flex flexDir={"column"}>
          <TokenCard
            w={186}
            h={"242px"}
            tokenInfo={inverted ? token1Info : token0Info}
            hasInput={false}
            inNetwork={true}
          />
          <Flex w={"186px"} mt="16px">
            <TokenInputForLiquidity inToken={true} tokenInfo={token0Info} />
          </Flex>
          <Text color="#fff" opacity={0.8} fontSize={"13px"}>
            $0.00
          </Text>
        </Flex>

        <Flex
          mx="6px"
          h={"24px"}
          w="24px"
          justifyContent={"center"}
          mt={"-61px"}
        >
          <Image src={add} alt="add" />
        </Flex>
        <Flex flexDir={"column"}>
          <TokenCard
            w={186}
            h={"242px"}
            tokenInfo={inverted ? token0Info : token1Info}
            hasInput={false}
            inNetwork={true}
          />
          <Flex w={"186px"} mt="16px">
            <TokenInputForLiquidity inToken={false} tokenInfo={token1Info} />
          </Flex>
          <Text color="#fff" opacity={0.8} fontSize={"13px"}>
            $0.00
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
