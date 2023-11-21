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
        removeLiquidityPercentage
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
            {commafy(amount0Removed, 4, undefined, "0")} {token0Symbol}
          </Text>
          <Text mx={"6px"}>+</Text>
          <Text>
            {commafy(amount1Removed, 4, undefined, "0")} {token1Symbol}
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
            ${commafy(estimatedGasUsageValue?.toString(), 2)}
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

const ContentTitle = (props: { title: string; amount: string }) => {
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
      <Text>{amount}</Text>
    </Flex>
  );
};

const ContentSub = (props: { title: string; amount: string }) => {
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
  const token0Amount = Number(commafy(info?.token0CollectedFee, 8, true));
  const token1Amount = Number(commafy(info?.token1CollectedFee, 8, true));

  const { totalMarketPrice, hasTokenPrice } = usePricePair({
    token0Name: info?.token0.name,
    token0Amount,
    token1Name: info?.token1.name,
    token1Amount,
  });

  if (isExpanded && info) {
    return (
      <Flex>
        <Box flex={1} flexDir={"column"}>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} rowGap={"16px"}>
            <ContentTitle
              title="Liquidity to be removed"
              amount={`$${totalRemovedMarketPrice}`}
            />
            <ContentSub
              title={token0Symbol ?? "-"}
              amount={commafy(amount0Removed, 4)}
            />
            <ContentSub
              title={token1Symbol ?? "-"}
              amount={commafy(amount1Removed, 4)}
            />
          </Flex>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} rowGap={"16px"}>
            <ContentTitle title="Fees" amount={`$${totalMarketPrice}`} />
            <ContentSub
              title={token0Symbol ?? "-"}
              amount={commafy(info.token0CollectedFee, 4)}
            />
            <ContentSub
              title={token1Symbol ?? "-"}
              amount={commafy(info.token1CollectedFee, 4)}
            />
          </Flex>
        </Box>
      </Flex>
    );
  }
  return null;
};

export default function TxDetails() {
  const [isExpanded, setIsExpended] = useState<boolean>(false);
  const [amountPercentage, setAmountPercentage] = useRecoilState(removeAmount);

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
        <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
        <Content
          isExpanded={isExpanded}
          setIsExpended={setIsExpended}
        ></Content>
      </Flex>
    );
  }
  return null;
}
