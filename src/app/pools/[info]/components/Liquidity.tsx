import { Flex, Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import RemoveIcon from "@/assets/icons/pool/removeIconBlue.svg";
import IncreaseIcon from "@/assets/icons/pool/increaseIconBlue.svg";

import Image from "next/image";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { Token } from "@uniswap/sdk-core";
import commafy from "@/utils/trim/commafy";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { usePricePair } from "@/hooks/price/usePricePair";
import { useRouter } from "next/navigation";
import useConnectedNetwork from "@/hooks/network";
import { useCallback } from "react";
import { useSwitchNetwork } from "wagmi";
import { switchNetwork } from "wagmi/dist/actions";

const TokenLiquidityData = (props: {
  token: Token;
  liquidityAmount: number | string;
  liquidityPercent: number | undefined;
}) => {
  const { token, liquidityAmount, liquidityPercent } = props;
  return (
    <Flex justifyContent="space-between" h={"32px"} alignItems={"center"}>
      <Flex justifyContent="start">
        <TokenSymbolWithNetwork
          tokenSymbol={token.symbol as string}
          chainId={token.chainId}
          symbolW={32}
          symbolH={32}
          networkSymbolH={16}
          networkSymbolW={16}
        />
        <Text ml="12px" color="#A0A3AD" fontSize="18px">
          {token.symbol}
        </Text>
      </Flex>
      <Flex justifyContent="end" columnGap={"12px"}>
        <Text color="#A0A3AD" fontSize="18px" fontWeight={500}>
          {liquidityAmount}
        </Text>
        <Text
          bgColor={"#15161D"}
          borderRadius={8}
          px={"8px"}
          py={"4px"}
          fontSize={"14px"}
          fontWeight={600}
          w={"53px"}
        >
          {liquidityPercent} {"%"}
        </Text>
      </Flex>
    </Flex>
  );
};
export default function Liquidity() {
  const { info } = usePositionInfo();

  if (info === undefined) {
    return null;
  }

  const { inverted, ratio } = usePoolInfo();
  const { token0, token0Amount, token1, token1Amount, chainId } = info;

  const { totalMarketPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: Number(commafy(token0Amount, 4).replaceAll(",", "")),
    token1Name: token1.name,
    token1Amount: Number(commafy(token1Amount, 4).replaceAll(",", "")),
  });

  const router = useRouter();
  const { connectedChainId, otherLayerChainInfo } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const onClickToRoute = useCallback(
    async (remove?: boolean) => {
      if (chainId !== connectedChainId && otherLayerChainInfo) {
        const res = await switchNetworkAsync?.(otherLayerChainInfo.chainId);
        if (res) {
          return router.push(
            remove ? `/pools/remove/${info.id}` : `/pools/increase/${info.id}`
          );
        }
      }
      return router.push(
        remove ? `/pools/remove/${info.id}` : `/pools/increase/${info.id}/`
      );
    },
    [chainId, connectedChainId, otherLayerChainInfo]
  );

  return (
    <Box
      bg="#1F2128"
      w="100%"
      py="16px"
      px="20px"
      borderRadius={"12px"}
      alignItems="center"
    >
      <Flex flexDir="column" alignItems={"center"}>
        <Flex>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"17px"}>
            <Text color="#A0A3AD" fontSize={13}>
              Remove
            </Text>
            <Box onClick={() => onClickToRoute(true)} cursor={"pointer"}>
              <Flex
                w={"32px"}
                h={"32px"}
                bg="#15161D"
                border={" 1px solid #007AFF"}
                borderRadius={"8px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image src={RemoveIcon} alt={"RemoveIcon"} />
              </Flex>
            </Box>
          </Flex>
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            mx={"35px"}
            rowGap={"4px"}
            mb={"4px"}
          >
            <Text fontSize={"16px"} h={"24px"}>
              Liquidity
            </Text>
            <Text fontSize={"38px"} height={"57px"}>
              {`$${totalMarketPrice}`}
            </Text>
          </Flex>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"17px"}>
            <Text color="#A0A3AD" fontSize={13}>
              Increase
            </Text>
            <Box onClick={() => onClickToRoute(false)} cursor={"pointer"}>
              <Flex
                w={"32px"}
                h={"32px"}
                bg="#15161D"
                border={" 1px solid #007AFF"}
                borderRadius={"8px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image src={IncreaseIcon} alt={"IncreaseLiquidity"} />
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Box w={"100%"} h={"1px"} bgColor={"#313442"} />
        <Flex
          flexDir={"column"}
          textAlign={"center"}
          justifyItems={"center"}
          w={"100%"}
          pt={"16px"}
          rowGap={"12px"}
        >
          <TokenLiquidityData
            token={inverted ? info.token0 : info.token1}
            liquidityAmount={commafy(
              inverted ? info.token0Amount : info.token1Amount,
              6
            )}
            liquidityPercent={
              inverted ? ratio : ratio ? 100 - ratio : undefined
            }
          />
          <TokenLiquidityData
            token={inverted ? info.token1 : info.token0}
            liquidityAmount={commafy(
              inverted ? info.token1Amount : info.token0Amount,
              6
            )}
            liquidityPercent={inverted && ratio ? 100 - ratio : ratio}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
