import { Flex, Box, Text } from "@chakra-ui/react";
import RemoveInactiveIcon from "@/assets/icons/pool/removeInactiveIcon.svg";
import RemoveIcon from "@/assets/icons/pool/removeIconBlue.svg";
import IncreaseIcon from "@/assets/icons/pool/increaseIconBlue.svg";
import Image from "next/image";
import { Token } from "@uniswap/sdk-core";
import commafy from "@/utils/trim/commafy";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { usePricePair } from "@/hooks/price/usePricePair";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useEffect, useState } from "react";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { splitNumber } from "@/utils/trim/splitNumber";
import { useAccount, useSwitchNetwork } from "wagmi";
import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
import { PoolCardDetail } from "../../components/PoolCard";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";

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
          tokenSymbol={
            token.symbol === "WETH" ? "ETH" : (token.symbol as string)
          }
          chainId={token.chainId}
          symbolW={32}
          symbolH={32}
          networkSymbolH={16}
          networkSymbolW={16}
        />
        <Text ml="12px" color="#A0A3AD" fontSize="18px">
          {token.symbol === "WETH" ? "ETH" : token.symbol}
        </Text>
      </Flex>
      <Flex justifyContent="end" columnGap={"12px"}>
        <Text color="#A0A3AD" fontSize="18px" fontWeight={500}>
          {liquidityAmount}
        </Text>
        {liquidityPercent !== undefined && (
          <Text
            bgColor={"#15161D"}
            borderRadius={8}
            px={"8px"}
            py={"4px"}
            fontSize={"14px"}
            fontWeight={600}
            w={"53px"}
            textAlign={"right"}
          >
            {liquidityPercent} {"%"}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
export default function Liquidity(props: { info: PoolCardDetail | undefined }) {
  const { info } = props;
  const { address } = useAccount();

  // const { totalMarketPrice } = usePricePair({
  //   token0Name: info?.token0.name,
  //   token0Amount: Number(commafy(info?.token0Amount, 4).replaceAll(",", "")),
  //   token1Name: info?.token1.name,
  //   token1Amount: Number(commafy(info?.token1Amount, 4).replaceAll(",", "")),
  // });
  const totalMarketPrice = commafy(
    Number(info?.token0Value) + Number(info?.token1Value),
    2
  );

  const router = useRouter();
  const { connectedChainId, otherLayerChainInfo } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();

  const noMarketPrices =
    (info?.token0MarketPrice === undefined &&
      info?.token1MarketPrice === undefined) ||
    Number(info.token0MarketPrice) + Number(info.token1MarketPrice) === 0;

  const onClickToRoute = useCallback(
    async (remove?: boolean) => {
      if (info) {
        if (info.chainId !== connectedChainId) {
          const res = await switchNetworkAsync?.(info.chainId);
          if (res && res.id === info.chainId) {
            return router.push(
              remove
                ? `/pools/remove/${info.id}?chainId=${info.chainId}`
                : `/pools/increase/${info.id}?chainId=${info.chainId}`
            );
          }
        }
        return router.push(
          remove
            ? `/pools/remove/${info.id}?chainId=${info.chainId}`
            : `/pools/increase/${info.id}?chainId=${info.chainId}`
        );
      }
    },
    [
      info?.id,
      info?.chainId,
      connectedChainId,
      otherLayerChainInfo,
      switchNetworkAsync,
    ]
  );

  const actionDisabled = info?.owner !== address;

  const { ratio, inverted } = usePoolInfo();
  // const [token0Ratio, setToken0Ratio] = useState<number | undefined>(undefined);
  // const [token1Ratio, setToken1Ratio] = useState<number | undefined>(undefined);

  const token0Ratio = useMemo(() => {
    if (info?.isClosed) return undefined;
    return ratio;
  }, [ratio, info?.isClosed]);
  const token1Ratio = useMemo(() => {
    if (info?.isClosed) return undefined;
    return ratio !== undefined ? 100 - ratio : undefined;
  }, [ratio, info?.isClosed]);

  if (info === undefined) {
    return null;
  }

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
        <Flex
          w={"100%"}
          justifyContent={actionDisabled ? "center" : "space-between"}
          px={"10px"}
        >
          {!actionDisabled && (
            <Flex
              flexDir={"column"}
              alignItems={"center"}
              rowGap={"20px"}
              pt={"2px"}
            >
              <Text color="#A0A3AD" fontSize={13}>
                Remove
              </Text>
              <Box
                onClick={() => (info?.isClosed ? null : onClickToRoute(true))}
                cursor={info?.isClosed ? "" : "pointer"}
              >
                <Flex
                  w={"32px"}
                  h={"32px"}
                  bg="#15161D"
                  border={info?.isClosed ? "" : " 1px solid #007AFF"}
                  borderRadius={"8px"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Image
                    src={info?.isClosed ? RemoveInactiveIcon : RemoveIcon}
                    alt={"RemoveIcon"}
                  />
                </Flex>
              </Box>
            </Flex>
          )}
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            rowGap={"4px"}
            mb={"4px"}
          >
            <Text fontSize={"16px"} h={"24px"}>
              Liquidity
            </Text>
            <Text
              fontSize={"38px"}
              height={"57px"}
              color={noMarketPrices ? "#A0A3AD" : ""}
            >
              {noMarketPrices ? "-" : `$${splitNumber(totalMarketPrice)}`}
            </Text>
          </Flex>
          {!actionDisabled && (
            <Flex
              flexDir={"column"}
              alignItems={"center"}
              rowGap={"20px"}
              pt={"2px"}
            >
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
          )}
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
            token={info.token1}
            liquidityAmount={smallNumberFormmater(
              info.token1Amount.toString(),
              6,
              undefined,
              undefined,
              0.000001
            )}
            liquidityPercent={token1Ratio}
          />
          <TokenLiquidityData
            token={info.token0}
            liquidityAmount={smallNumberFormmater(
              info.token0Amount.toString(),
              6,
              undefined,
              undefined,
              0.000001
            )}
            liquidityPercent={token0Ratio}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
