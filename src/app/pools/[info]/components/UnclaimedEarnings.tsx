import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { Flex, Text, Button, Switch } from "@chakra-ui/react";
import { usePoolModals } from "@/hooks/modal/usePoolModals";
import { useMemo } from "react";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { usePricePair } from "@/hooks/price/usePricePair";
// import TokenNetwork from "@/components/ui/TokenNetwork";
import "css/pool/switch.css";
import { useRecoilState, useRecoilValue } from "recoil";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";

const CollectFeeAsWETH = () => {
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
      <Text>Collect as WETH</Text>
      <Switch
        size={"lg"}
        className="switch_info"
        isChecked={collectAsWETH}
        onChange={() => setCollectAsWETH(!collectAsWETH)}
      />
    </Flex>
  );
};

export default function UnclaimedEarnings() {
  const { info } = usePositionInfo();
  const { onOpenClaimEarning } = usePoolModals();
  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);
  const token0Amount = Number(commafy(info?.token0CollectedFee, 8, true));
  const token1Amount = Number(commafy(info?.token1CollectedFee, 8, true));

  const { totalMarketPrice, hasTokenPrice } = usePricePair({
    token0Name: info?.token0.name,
    token0Amount,
    token1Name: info?.token1.name,
    token1Amount,
  });

  const btnIsDisabled = useMemo(() => {
    if (info?.token0CollectedFee && info?.token1CollectedFee) {
      return (
        Number(info?.token0CollectedFee.replaceAll(",", "")) +
          Number(info?.token1CollectedFee.replaceAll(",", "")) <=
        0
      );
    }
  }, [info?.token0CollectedFee, info?.token1CollectedFee]);

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

  return (
    <Flex
      bgColor="#1F2128"
      w="100%"
      // h={wethCollecting ? "121" : "117px"}
      py={"14px"}
      px="20px"
      borderRadius={"12px"}
      // alignItems={"space-between"}
      rowGap={"14px"}
      flexDir={"column"}
    >
      <Flex justifyContent={"space-between"}>
        {hasTokenPrice ? (
          <Flex alignItems={"left"} flexDir={"column"}>
            <Text>Unclaimed fees</Text>
            <Text fontSize={"24px"} as="b" mt={"6px"}>
              {`$${totalMarketPrice}`}
            </Text>
            <Flex alignItems={"center"} color="#A0A3AD">
              <Text fontSize={"12px"}>
                {smallNumberFormmater(commafy(token0Amount, 8) ?? "-")}{" "}
                {token0Symbol}
              </Text>
              <Text w={"10px"} mx={"2px"}>
                +
              </Text>
              <Text fontSize={"12px"}>
                {smallNumberFormmater(commafy(token1Amount, 8) ?? "-")}{" "}
                {token1Symbol}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex alignItems={"left"} flexDir={"column"}>
            <Text>Unclaimed fee</Text>
            <Flex flexDir={"column"} alignItems={"flex-start"} color="#fff">
              <Text fontSize={"18px"}>
                {smallNumberFormmater(commafy(token0Amount, 8) ?? "-")}{" "}
                {token0Symbol} +
              </Text>
              <Text fontSize={"18px"}>
                {smallNumberFormmater(commafy(token1Amount, 8) ?? "-")}{" "}
                {info?.token1.symbol}
              </Text>
            </Flex>
          </Flex>
        )}
        <Flex alignItems={"flex-end"} pb={"13px"}>
          <Button
            bgColor={"#007AFF"}
            _hover={{ bgColor: "#007AFF" }}
            _active={{}}
            onClick={onOpenClaimEarning}
            isDisabled={btnIsDisabled}
            _disabled={{ bgColor: "#17181D", color: "#8E8E92" }}
          >
            Claim
          </Button>
        </Flex>
      </Flex>
      <CollectFeeAsWETH />
    </Flex>
  );
}
