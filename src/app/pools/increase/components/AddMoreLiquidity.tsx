import { Flex, Text } from "@chakra-ui/react";
import Title from "../../add/components/Title";
import TokenCard from "@/components/card/TokenCard";
import add from "assets/icons/addIcon.svg";
import Image from "next/image";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { TokenInfo } from "@/types/token/supportedToken";
import useConnectedNetwork from "@/hooks/network";
import { getWETHAddress } from "@/utils/token/isETH";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import { TokenInputForLiquidity } from "./TokenInputForLiquidity";
import { OutRangeWarning } from "../../add/components/InputContainer";

export default function AddMoreLiquidity() {
  const { info } = usePositionInfo();
  const { deposit0Disabled, deposit1Disabled } = usePoolInfo();

  const { chainName } = useConnectedNetwork();

  if (!info || !chainName) return null;

  const token0 = info.token0;
  const token1 = info.token1;

  const token0Info: TokenInfo = {
    tokenName: token0.name ?? "",
    tokenSymbol: token0.symbol ?? "",
    address: {
      MAINNET: token0.address,
      TITAN: token0.address,
      SEPOLIA: token0.address,
      THANOS_SEPOLIA: token0.address,
      TITAN_SEPOLIA: token0.address,
    },
    isNativeCurrency:
      token0.address === getWETHAddress(chainName)
        ? [
            SupportedChainId.MAINNET,
            SupportedChainId.TITAN,
            SupportedChainId.SEPOLIA,
            SupportedChainId.TITAN_SEPOLIA,
          ]
        : null,
    decimals: token0.decimals,
  };

  const token1Info: TokenInfo = {
    tokenName: token1.name ?? "",
    tokenSymbol: token1.symbol ?? "",
    address: {
      MAINNET: token1.address,
      TITAN: token1.address,
      SEPOLIA: token1.address,
      THANOS_SEPOLIA: token1.address,
      TITAN_SEPOLIA: token1.address,
    },
    isNativeCurrency:
      token1.address === getWETHAddress(chainName)
        ? [
            SupportedChainId.MAINNET,
            SupportedChainId.TITAN,
            SupportedChainId.SEPOLIA,
          ]
        : null,
    decimals: token1.decimals,
  };

  return (
    <Flex flexDir={"column"} justifyContent={"flex-start"}>
      <Title title="Add more liquidity" />
      <Flex
        alignItems={"baseline"}
        justifyContent={"center"}
        pos={"relative"}
        columnGap={"36px"}
      >
        <Flex flexDir={"column"} maxW={"186px"}>
          <TokenCard
            w={186}
            h={"242px"}
            tokenInfo={token1Info}
            hasInput={false}
            inNetwork={true}
            type="small"
          />
          <Flex w={"186px"} mt="16px">
            {deposit1Disabled ? (
              <OutRangeWarning />
            ) : (
              <TokenInputForLiquidity
                inToken={false}
                tokenInfo={token1Info}
                otherTokenInfo={token0Info}
                tickCurrent={info?.tickCurrent}
              />
            )}
          </Flex>
        </Flex>
        <Flex h={"242px"} justifyContent={"center"} pos={"absolute"}>
          <Flex mx="6px" h={"100%"} w="24px">
            <Image src={add} alt="add" />
          </Flex>
        </Flex>
        <Flex flexDir={"column"} maxW={"186px"}>
          <TokenCard
            w={186}
            h={"242px"}
            tokenInfo={token0Info}
            hasInput={false}
            inNetwork={true}
            type="small"
          />
          <Flex w={"186px"} mt="16px">
            {!deposit0Disabled && (
              <TokenInputForLiquidity
                inToken={true}
                tokenInfo={token0Info}
                otherTokenInfo={token1Info}
                tickCurrent={info?.tickCurrent}
              />
            )}
            {deposit0Disabled && <OutRangeWarning />}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
