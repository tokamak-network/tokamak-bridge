import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { Flex, Text, Button, Switch } from "@chakra-ui/react";
import { usePoolModals } from "@/hooks/modal/usePoolModals";
import { useCallback, useMemo } from "react";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { usePricePair } from "@/hooks/price/usePricePair";
// import TokenNetwork from "@/components/ui/TokenNetwork";
import "css/pool/switch.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import { useAccount, useSwitchNetwork } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import JSBI from "jsbi";
import { PoolCardDetail } from "../../components/PoolCard";
import { useGetMode } from "@/hooks/mode/useGetMode";

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
      alignItems={"center"}
      borderTop={"1px solid #313442"}
      pt={"12px"}
    >
      <Text fontSize={15}>Collect as WETH</Text>
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
  const token0Amount = Number(info?.token0CollectedFee);
  const token1Amount = Number(info?.token1CollectedFee);

  const totalMarketPrice =
    Number(info?.token0FeeValue) + Number(info?.token1FeeValue);

  const { hasTokenPrice } = usePricePair({
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
        const res = await switchNetworkAsync?.(otherLayerChainInfo.chainId);
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
      // h={wethCollecting ? "121" : "117px"}
      py={"14px"}
      px="20px"
      borderRadius={"12px"}
      // alignItems={"space-between"}
      rowGap={"8px"}
      flexDir={"column"}
    >
      <Flex justifyContent={"space-between"}>
        {hasTokenPrice ? (
          <Flex alignItems={"left"} flexDir={"column"}>
            <Text fontSize={15}>Unclaimed fees</Text>
            <Text fontSize={"24px"} as="b" mt={"6px"}>
              {`$${commafy(totalMarketPrice, 2, undefined, "0.00")}`}
            </Text>
            <Flex alignItems={"center"} color="#A0A3AD">
              <Text fontSize={"12px"}>
                {smallNumberFormmater(token0Amount)} {token0Symbol}
              </Text>
              <Text w={"10px"} mx={"2px"}>
                +
              </Text>
              <Text fontSize={"12px"}>
                {smallNumberFormmater(token1Amount)} {token1Symbol}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex alignItems={"left"} flexDir={"column"}>
            <Text>Unclaimed fee</Text>
            <Flex flexDir={"column"} alignItems={"flex-start"} color="#fff">
              <Text fontSize={"18px"}>
                {smallNumberFormmater(token0Amount)} {token0Symbol} +
              </Text>
              <Text fontSize={"18px"}>
                {smallNumberFormmater(token1Amount)} {info?.token1.symbol}
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
