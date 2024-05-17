import { Flex, Text, Box } from "@chakra-ui/layout";
import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RangeText } from "./ui";
import TokenSymbolPair from "./TokenSymbolPair";
import commafy from "@/utils/trim/commafy";
import {
  gasUsdFormatter,
  smallNumberFormmater,
} from "@/utils/number/compareNumbers";
import { priceFormmater } from "@/utils/trim/priceFormatter";
import { useSwitchNetwork } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { useRouter } from "next/navigation";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import QUESTION_ICON from "assets/icons/questionGray.svg";
import Image from "next/image";
import { trimAmount } from "@/utils/trim";
import { useProvier } from "@/hooks/provider/useProvider";
import { useUniswapContracts } from "@/hooks/uniswap/useUniswapContracts";
import NONFUNGIBLE_POSITION_MANAGER_ABI from "@/abis/NONFUNGIBLE_POSITION_MANAGER_ABI.json";
import { BigNumber, Contract, ethers } from "ethers";
import { calculateFeeToCollect } from "@/utils/pool/calculateFeeToCollect";
import { UniswapContractByChainId } from "@/constant/contracts/uniswap";
import { providerByChainId } from "@/config/getProvider";
import { isLayer2Chain } from "@/types/network/supportedNetwork";
import { usePricePair } from "@/hooks/price/usePricePair";

export type PoolCardDetail = {
  id: number;
  token0: Token;
  token1: Token;
  token0Amount: number;
  token0CollectedFee: string;
  token0MarketPrice?: number;
  token1Amount: number;
  token1CollectedFee: string;
  token1MarketPrice?: number;
  fee: FeeAmount;
  inRange: boolean;
  liquidity: string;
  sqrtPriceX96: string;
  tickLower: number;
  tickCurrent: number;
  tickUpper: number;
  rawPositionInfo: any;
  hasETH: boolean;
  isClosed: boolean;
  token0Value?: number;
  token1Value?: number;
  token0FeeValue?: number;
  token1FeeValue?: number;
  feeValue?: number;
  chainId: number;
  owner: string;
  rawData: any;
  token0CollectedFeeBN: BigNumber;
  token1CollectedFeeBN: BigNumber;
};

export default function PoolCard(props: PoolCardDetail) {
  const {
    id,
    token0,
    token1,
    fee,
    inRange,
    token0Amount,
    token1Amount,
    token0CollectedFee,
    token1CollectedFee,
    token0Value,
    token1Value,
    token0MarketPrice,
    token1MarketPrice,
    isClosed,
    token0FeeValue,
    token1FeeValue,
    chainId,
    rawData,
  } = props;

  console.log(
    "token0MarketPrice,token1MarketPrice",
    token0MarketPrice,
    token1MarketPrice
  );

  const feePercent = useMemo(() => {
    switch (fee) {
      case 100:
        return "0.01%";
      case 500:
        return "0.05%";
      case 3000:
        return "0.3%";
      case 10000:
        return "1%";
      default:
        return null;
    }
  }, [fee]);

  const { connectedChainId } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const router = useRouter();

  const onClickToRoute = useCallback(async () => {
    if (chainId === connectedChainId) {
      return router.push(`/pools/${id}?chainId=${chainId}`);
    }
    const res = await switchNetworkAsync?.(chainId);
    if (res && res.id === chainId) {
      return router.push(`/pools/${id}?chainId=${chainId}`);
    }
  }, [id, chainId, connectedChainId, switchNetworkAsync]);

  const {
    hasTokenPrice,
    totalMarketPrice: totalFeeValue,
    token0Price: token0FeeMarketValue,
    token1Price: token1FeeMarketValue,
  } = usePricePair({
    token0Name: token0.name,
    token0Amount: token0CollectedFee,
    token1Name: token1.name,
    token1Amount: token1CollectedFee,
  });

  const token0FeeValueForTooltip = `($${commafy(
    token0FeeMarketValue,
    2,
    undefined,
    "0.00"
  )})`;

  const token1FeeValueForTooltip = `($${commafy(
    token1FeeMarketValue,
    2,
    undefined,
    "0.00"
  )})`;

  const feeValue = useMemo(() => {
    if (!hasTokenPrice) return undefined;
    try {
      return commafy(totalFeeValue, 2, undefined, "");
    } catch (e) {
      console.log("feevalue error");
      console.log(e);
    }
  }, [totalFeeValue]);

  const hasFee = useMemo(() => {
    return Number(token0CollectedFee) + Number(token1CollectedFee) > 0;
  }, [token0CollectedFee, token1CollectedFee]);

  return (
    <Box onClick={() => onClickToRoute()}>
      <Flex
        flexDir="column"
        borderWidth={"3px"}
        borderColor={isLayer2Chain(chainId) ? "#05274C" : "#383736"}
        bgColor={!props.id ? "#15161D" : ""}
        w="200px"
        h="248px"
        paddingTop={"12px"}
        paddingBottom={"16px"}
        paddingLeft={"16px"}
        paddingRight={"12px"}
        borderRadius={"16px"}
        _hover={{
          border: "3px solid #007AFF",
        }}
        cursor={"pointer"}
      >
        <Flex justifyContent={"flex-end"}>
          <RangeText inRange={inRange} isClosed={isClosed} />
        </Flex>
        <Flex alignItems="left" justifyContent="flex-start" flexDir={"column"}>
          <Text fontWeight="semibold" fontSize="18px" h={"27px"}>
            {token1.symbol}{" "}
            <span style={{ fontSize: 13, fontWeight: 400 }}>/</span>{" "}
            {token0.symbol}
          </Text>
          <Text fontSize={"12px"} h={"18px"}>
            {feePercent}
          </Text>
        </Flex>
        <TokenSymbolPair
          token0={token1}
          token1={token0}
          style={{ marginTop: "12px" }}
        />
        <Flex direction="column" fontSize={"12px"} mt={"auto"} pr={"4px"}>
          <Flex justifyContent="space-between" h={"20px"}>
            <Text>{token0.symbol}</Text>
            <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
              {token0Amount < 0.001
                ? smallNumberFormmater({
                    amount: token0Amount,
                    decimals: 12,
                    minimumValue: 0.0000000000001,
                    displayMinimumValue: "0.000000000000...",
                  })
                : commafy(token0Amount, 4)}{" "}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" h={"20px"}>
            <Text>{token1.symbol}</Text>
            <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
              {token1Amount < 0.001
                ? smallNumberFormmater({
                    amount: token1Amount,
                    decimals: 12,
                    minimumValue: 0.0000000000001,
                    displayMinimumValue: "0.000000000000...",
                  })
                : commafy(token1Amount, 4)}{" "}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems={"center"} h={"20px"}>
            <Text>Fees</Text>
            <Flex columnGap={"5px"}>
              {hasTokenPrice && hasFee ? (
                <Text maxW={"120px"} textAlign={"right"} overflow={"hidden"}>
                  {gasUsdFormatter(Number(feeValue), "< $0.01")}
                </Text>
              ) : hasFee ? (
                <Text color={"#fff"}>Claimable</Text>
              ) : (
                <Text color={"#A0A3AD"}>No fees</Text>
              )}
              <Flex w={"14px"} h={"18px"} alignItems={"center"}>
                <CustomTooltip
                  content={<Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />}
                  tooltipLabel={
                    <Flex
                      w={hasTokenPrice ? "300px" : "260px"}
                      px={"10px"}
                      pos={"absolute"}
                      zIndex={500}
                      h={"28px"}
                      bg={"#383A49"}
                      textAlign={"center"}
                      right={"-125px"}
                      borderRadius={"4px"}
                      justifyContent={"center"}
                    >
                      <Text w={"100%"} pos={"relative"}>
                        FEES :{" "}
                        {`${trimAmount(token0CollectedFee, 7)} ${
                          token0.symbol
                        } ${token0FeeValueForTooltip}`}{" "}
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            color: "##A0A3AD",
                          }}
                        >
                          +
                        </span>{" "}
                        {`${trimAmount(token1CollectedFee, 7)} ${
                          token1.symbol
                        } ${token1FeeValueForTooltip}`}{" "}
                      </Text>
                    </Flex>
                  }
                  style={{ width: "10px" }}
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
