import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { Flex, Text, Button, Switch } from "@chakra-ui/react";
import { usePoolModals } from "@/hooks/modal/usePoolModals";
import { useCallback, useMemo } from "react";
import {
  gasUsdFormatter,
  smallNumberFormmater,
} from "@/utils/number/compareNumbers";
import { usePricePair } from "@/hooks/price/usePricePair";
// import TokenNetwork from "@/components/ui/TokenNetwork";
import "css/pool/switch.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import { useAccount, useSwitchNetwork } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { PoolCardDetail } from "../../components/PoolCard";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { ethers } from "ethers";

export const CollectFeeAsWETH = () => {
  const [collectAsWETH, setCollectAsWETH] = useRecoilState(
    ATOM_collectWethOption
  );
  const { info } = usePositionInfo();

  if (!info?.hasETH) return null;

  return (
    <Flex
      w={"100%"}
      justifyContent={"space-between"}
      borderTop={"1px solid #313442"}
      pt={"15px"}
    >
      <Text fontSize={15} pb={"2px"}>
        Collect as WETH
      </Text>
      <Switch
        size={"lg"}
        className="switch_info"
        isChecked={collectAsWETH}
        w={"58px"}
        height={"28px"}
        onChange={() => setCollectAsWETH(!collectAsWETH)}
      />
    </Flex>
  );
};

export default function UnclaimedEarnings(props: {
  info: PoolCardDetail | undefined;
}) {
  const { info } = props;
  const { onOpenClaimEarning } = usePoolModals();
  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);
  const token0Amount = Number(
    ethers.utils.formatUnits(
      info?.token0CollectedFeeBN ?? "0",
      info?.token0.decimals
    )
  );
  const token1Amount = Number(
    ethers.utils.formatUnits(
      info?.token1CollectedFeeBN ?? "0",
      info?.token1.decimals
    )
  );

  const { hasTokenPrice, totalMarketPrice } = usePricePair({
    token0Name: info?.token0.name,
    token0Amount,
    token1Name: info?.token1.name,
    token1Amount,
  });
  const { address } = useAccount();

  const btnIsDisabled = useMemo(() => {
    if (info?.owner !== address) return true;
    if (info?.token0CollectedFee && info?.token1CollectedFee) {
      return (
        Number(info?.token0CollectedFee.replaceAll(",", "")) +
          Number(info?.token1CollectedFee.replaceAll(",", "")) <=
        0
      );
    }
  }, [info?.token0CollectedFee, info?.token1CollectedFee, address]);

  const token0Symbol = useMemo(() => {
    if (collectAsWETH === true && info?.token0.symbol === "ETH") {
      return "WETH";
    }
    return info?.token0.symbol;
  }, [info?.token0.symbol, collectAsWETH]);

  const token1Symbol = useMemo(() => {
    if (collectAsWETH === true && info?.token1.symbol === "ETH") {
      return "WETH";
    }
    return info?.token1.symbol;
  }, [info?.token1.symbol, collectAsWETH]);

  const { connectedChainId, otherLayerChainInfo } = useConnectedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { subMode } = useGetMode();

  const onClickToRoute = useCallback(
    async (remove?: boolean) => {
      if (info?.chainId !== connectedChainId && otherLayerChainInfo) {
        const res = await switchNetworkAsync?.(info?.chainId);
        if (res) {
          return onOpenClaimEarning();
        }
      }
      return onOpenClaimEarning();
    },
    [info?.chainId, connectedChainId, otherLayerChainInfo]
  );

  return (
    <Flex
      bgColor="#1F2128"
      w="100%"
      minH={info?.hasETH && !subMode.remove ? "163px" : "115px"}
      maxH={info?.hasETH && !subMode.remove ? "163px" : "115px"}
      py={"14px"}
      px="20px"
      borderRadius={"12px"}
      // alignItems={"space-between"}
      rowGap={"8px"}
      flexDir={"column"}
      justifyContent={"space-between"}
    >
      <Flex justifyContent={"space-between"} h={"100%"}>
        {hasTokenPrice ? (
          <Flex alignItems={"left"} flexDir={"column"}>
            <Text fontSize={15}>Unclaimed fees</Text>
            <Text fontSize={"24px"} as="b" mt={"6px"}>
              {totalMarketPrice
                ? `${gasUsdFormatter(Number(totalMarketPrice))}`
                : "NA"}
            </Text>
            <Flex
              alignItems={"center"}
              color="#A0A3AD"
              lineHeight={"24px"}
              mt={"auto"}
            >
              <Text fontSize={"12px"}>
                {smallNumberFormmater({
                  amount: token0Amount,
                })}{" "}
                {token0Symbol}
              </Text>
              <Text w={"10px"} mx={"2px"}>
                +
              </Text>
              <Text fontSize={"12px"}>
                {smallNumberFormmater({ amount: token1Amount })} {token1Symbol}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex alignItems={"left"} flexDir={"column"}>
            <Text>Unclaimed fee</Text>
            <Flex
              flexDir={"column"}
              alignItems={"flex-start"}
              color="#fff"
              lineHeight={"24px"}
              mt={"auto"}
            >
              <Text fontSize={"18px"}>
                {smallNumberFormmater({ amount: token0Amount })} {token0Symbol}{" "}
                +
              </Text>
              <Text fontSize={"18px"}>
                {smallNumberFormmater({ amount: token1Amount })}{" "}
                {info?.token1.symbol}
              </Text>
            </Flex>
          </Flex>
        )}
        {!subMode.remove && (
          <Flex alignItems={"flex-end"} pb={"13px"}>
            <Button
              bgColor={"#007AFF"}
              _hover={{ bgColor: "#007AFF" }}
              _active={{}}
              onClick={() => onClickToRoute()}
              isDisabled={btnIsDisabled}
              _disabled={{ bgColor: "#17181D", color: "#8E8E92" }}
              fontSize={14}
              w={"76px"}
              h={"35px"}
            >
              Claim
            </Button>
          </Flex>
        )}
      </Flex>
      {!subMode.remove && <CollectFeeAsWETH />}
    </Flex>
  );
}
