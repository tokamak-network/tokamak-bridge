import { Flex, Text, Box } from "@chakra-ui/react";
import Image from "next/image";
import ArrowImg from "assets/icons/arrow.svg";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { useRemoveLiquidity } from "@/hooks/pool/useLiquidity";
import commafy from "@/utils/trim/commafy";
import { usePricePair } from "@/hooks/price/usePricePair";
import { usePoolContract } from "@/hooks/pool/usePoolContract";
import { estimatedGasFee } from "@/recoil/global/transaction";
import { useConvertWETH } from "@/hooks/pool/useConvertWETH";
import {
  gasUsdFormatter,
  smallNumberFormmater,
} from "@/utils/number/compareNumbers";

const Title = (props: {
  isExpanded: boolean;
  setIsExpended: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isExpanded, setIsExpended } = props;

  const arrowControl = useAnimation();

  const { info } = usePositionInfo();
  const { amount0Removed, amount1Removed } = useRemoveLiquidity();

  useEffect(() => {
    if (isExpanded) {
      arrowControl.start({ rotate: 180 });
    } else {
      arrowControl.start({ rotate: 360 });
    }
  }, [isExpanded]);

  const { estimateGasToRemove } = usePoolContract();
  const [estimatedGasUsageValue, setEstimatedGasUsage] =
    useRecoilState(estimatedGasFee);
  const removeLiquidityPercentage = useRecoilValue(removeAmount);

  useEffect(() => {
    const fetchData = async () => {
      if (removeLiquidityPercentage === 0 || info === undefined) return;
      const gasData = await estimateGasToRemove(
        info?.id,
        removeLiquidityPercentage,
      );
      setEstimatedGasUsage(gasData);
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [removeLiquidityPercentage, info]);

  const { token0Symbol, token1Symbol } = useConvertWETH();

  return (
    <Flex
      w={"100%"}
      justifyContent={"space-between"}
      cursor={isExpanded ? "" : "pointer"}
      onClick={() => setIsExpended(!isExpanded)}
      fontSize={14}
      zIndex={10000}
    >
      <Flex
        w={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        cursor={"pointer"}
      >
        <Flex maxH={"16px"} alignItems={"center"}>
          <Text>
            {smallNumberFormmater({
              amount: amount0Removed?.toString(),
              decimals: 6,
              minimumValue: 0.000001,
            })}{" "}
            {token0Symbol}
          </Text>
          <Text mx={"6px"}>+</Text>
          <Text>
            {smallNumberFormmater({
              amount: amount1Removed?.toString(),
              decimals: 6,
              minimumValue: 0.000001,
            })}{" "}
            {token1Symbol}
          </Text>
        </Flex>
        <Flex alignItems={"center"}>
          <Image src={GasImg} alt={"gasStation"} />
          <Text
            fontSize={14}
            fontWeight={400}
            color={"#A0A3AD"}
            ml={"6px"}
            mr={"13px"}
          >
            {estimatedGasUsageValue
              ? `$${commafy(estimatedGasUsageValue?.toString(), 2)}`
              : "NA"}
          </Text>
          <motion.div animate={arrowControl}>
            <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
          </motion.div>
        </Flex>
      </Flex>
    </Flex>
  );
};

const DivisionLine = () => {
  return (
    <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} mt={"14px"} mb="16px"></Box>
  );
};

const ContentTitle = (props: {
  title: string;
  amount: string | number | undefined;
}) => {
  const { title, amount } = props;

  return (
    <Flex
      justifyContent={"space-between"}
      w="100%"
      color="#fff"
      fontSize={"14px"}
      h={"14px"}
    >
      <Text>{title}</Text>
      <Text color={amount ? "#fff" : "#A0A3AD"}>{amount ?? "NA"}</Text>
    </Flex>
  );
};

const ContentSub = (props: { title: string; amount: string | number }) => {
  const { title, amount } = props;

  return (
    <Flex
      justifyContent={"space-between"}
      w="100%"
      color="#fff"
      fontSize={"14px"}
      h={"14px"}
    >
      <Text color="#A0A3AD" fontWeight={300}>
        {title}
      </Text>
      <Text>{amount}</Text>
    </Flex>
  );
};

const Content = (props: {
  isExpanded: boolean;
  setIsExpended: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isExpanded, setIsExpended } = props;
  const { info } = usePositionInfo();
  const { amount0Removed, amount1Removed, totalRemovedMarketPrice } =
    useRemoveLiquidity();
  const { token0Symbol, token1Symbol } = useConvertWETH();
  const token0Amount = info?.token0CollectedFee;
  const token1Amount = info?.token1CollectedFee;

  const { totalMarketPrice } = usePricePair({
    token0Name: info?.token0.name,
    token0Amount,
    token1Name: info?.token1.name,
    token1Amount,
  });

  if (isExpanded && info) {
    return (
      <Flex>
        <Box flex={1} flexDir={"column"}>
          {/* <DivisionLine></DivisionLine> */}
          <Flex flexDir={"column"} rowGap={"16px"}>
            <ContentTitle
              title="Liquidity to be removed"
              amount={gasUsdFormatter(
                Number(totalRemovedMarketPrice?.replaceAll(",", "")),
              )}
            />
            <ContentSub
              title={token0Symbol ?? "-"}
              amount={smallNumberFormmater({
                amount: amount0Removed,
                decimals: 6,
                minimumValue: 0.000001,
              })}
            />
            <ContentSub
              title={token1Symbol ?? "-"}
              amount={smallNumberFormmater({
                amount: amount1Removed,
                decimals: 6,
                minimumValue: 0.000001,
              })}
            />
          </Flex>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} rowGap={"16px"}>
            <ContentTitle
              title="Earned fees"
              amount={gasUsdFormatter(
                Number(totalMarketPrice?.replaceAll(",", "")),
              )}
            />
            <ContentSub
              title={token0Symbol ?? "-"}
              amount={smallNumberFormmater({
                amount: info.token0CollectedFee,
                minimumValue: 0.000001,
              })}
            />
            <ContentSub
              title={token1Symbol ?? "-"}
              amount={smallNumberFormmater({
                amount: info.token1CollectedFee,
                minimumValue: 0.000001,
              })}
            />
          </Flex>
        </Box>
      </Flex>
    );
  }
  return null;
};

export default function TxDetails() {
  const [isExpanded, setIsExpended] = useState<boolean>(true);
  const amountPercentage = useRecoilValue(removeAmount);

  if (amountPercentage) {
    return (
      <Flex
        w={"100%"}
        // h={isExpanded ? "310px" : "48px"}
        minH={"48px"}
        bg={"#1f2128"}
        borderRadius={"8px"}
        flexDir={"column"}
        px={"20px"}
        pt={isExpanded ? "20px" : "16px"}
        pb={isExpanded ? "20px" : ""}
        zIndex={0}
      >
        {/* <Title isExpanded={isExpanded} setIsExpended={setIsExpended} /> */}
        <Content isExpanded={true} setIsExpended={setIsExpended}></Content>
      </Flex>
    );
  }

  return null;
}
