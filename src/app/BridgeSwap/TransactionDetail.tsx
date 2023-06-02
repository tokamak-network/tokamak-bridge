import { useInOutNetwork } from "@/hooks/network";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import ArrowImg from "assets/icons/arrow.svg";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CustomTooltip from "components/tooltip/CustomTooltip";
import useTransactionDetail from "@/hooks/bridge/useTransactionDetails";
import Swap from "./Swap";

type DepositDetailProp = {
  title: string;
  content: string;
  tooltip?: boolean;
  tooltipLabel?: string;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: string;
    l2Gas: string;
  };
};

type WithdrawDetailProp = {
  title: string;
  content: string;
  tooltip?: boolean;
  tooltipLabel?: string;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: { eth: string; ton: string };
    l2Gas: { eth: string; ton: string };
  };
};

type SwapDetailProp = {
  title:
    | "Expected output"
    | "Minimum received after slippage"
    | "Estimated gas fees";
  content: string;
  gasFee?: string;
  slippage?: string;
};

const DivisionLine = () => {
  return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"14px"}></Box>;
};

const DepositDetailRow = (props: DepositDetailProp) => {
  const { gasFee, tooltip, tooltipLabel, title, content } = props;
  return (
    <Flex flexDir={"column"}>
      <Flex justifyContent={"space-between"} fontSize={14} h={"16px"}>
        <Text fontWeight={300}>{title}</Text>
        <Text fontWeight={500}>
          {tooltip ? (
            <CustomTooltip content={content} tooltipLabel={tooltipLabel} />
          ) : (
            content
          )}
        </Text>
      </Flex>
      {gasFee && (
        <Flex
          w={"448px"}
          h={"54px"}
          bgColor={"#15161D"}
          flexDir={"column"}
          fontSize={14}
          justifyContent={"center"}
          mt={"9px"}
          px={"16px"}
          borderRadius={"8px"}
        >
          <Flex justifyContent={"space-between"}>
            <Text>L1 gas fee</Text>
            <Text>{gasFee.l1Gas}</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>L2 gas fee</Text>
            <Text>{gasFee.l2Gas}</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const WithdrawDetailRow = (props: WithdrawDetailProp) => {
  const { gasFee, tooltip, tooltipLabel, title, content } = props;
  const [isTON, setIsTON] = useState(true);

  if (gasFee) {
    return (
      <Flex flexDir={"column"}>
        <Flex justifyContent={"space-between"} fontSize={14}>
          <Text fontWeight={300}>{title}</Text>
          <Text fontWeight={500}>
            <Flex flexDir={"column"} rowGap={"13px"}>
              <Flex
                w={"96px"}
                h={"24px"}
                borderRadius={"8px"}
                border={"1px solid #007AFF"}
                textAlign={"center"}
                verticalAlign={"center"}
                lineHeight={"22px"}
                fontSize={11}
                fontWeight={600}
              >
                <CustomTooltip
                  content={
                    <Text
                      w={"50%"}
                      bgColor={isTON ? "#007AFF" : ""}
                      borderRadius={"8px"}
                      cursor={"pointer"}
                      onClick={() => setIsTON(true)}
                    >
                      TON
                    </Text>
                  }
                  tooltipLabel="The fee is 2% cheaper than ETH"
                  style={{ width: "185px", bgColor: "#007AFF" }}
                ></CustomTooltip>

                <Text
                  w={"50%"}
                  bgColor={!isTON ? "#007AFF" : ""}
                  borderRadius={"8px"}
                  cursor={"pointer"}
                  onClick={() => setIsTON(false)}
                >
                  ETH
                </Text>
              </Flex>
              <Flex justifyContent={"flex-end"}>
                <Text fontSize={14} fontWeight={500}>
                  {content}
                </Text>
              </Flex>
            </Flex>
          </Text>
        </Flex>
        <Flex
          w={"448px"}
          h={"54px"}
          bgColor={"#15161D"}
          flexDir={"column"}
          fontSize={14}
          justifyContent={"center"}
          mt={"9px"}
          px={"16px"}
          borderRadius={"8px"}
        >
          <Flex justifyContent={"space-between"}>
            <Text>L1 gas fee</Text>
            <Text>{gasFee.l1Gas.ton}</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>L2 gas fee</Text>
            <Text>{gasFee.l2Gas.ton}</Text>
          </Flex>
        </Flex>
      </Flex>
    );
  }
  return (
    <Flex flexDir={"column"}>
      <Flex justifyContent={"space-between"} fontSize={14} h={"16px"}>
        <Text fontWeight={300}>{title}</Text>
        <Text fontWeight={500}>
          {tooltip ? (
            <CustomTooltip content={content} tooltipLabel={tooltipLabel} />
          ) : (
            content
          )}
        </Text>
      </Flex>
    </Flex>
  );
};

const SwapDetailRow = (props: SwapDetailProp) => {
  const { title, content, gasFee, slippage } = props;
  return (
    <Flex flexDir={"column"}>
      <Flex justifyContent={"space-between"} fontSize={14} h={"16px"}>
        <Flex columnGap={"4px"}>
          <Text fontWeight={300}>{title}</Text>
          {slippage && (
            <Text fontWeight={300} color={"#A0A3AD"}>
              {`(${slippage})`}
            </Text>
          )}
        </Flex>
        <Flex>
          <Text fontWeight={500}>{content}</Text>
          {gasFee && (
            <Text ml={"27px"} fontWeight={500} color={"#A0A3AD"}>
              {gasFee}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const Content = (props: { isExpanded: boolean }) => {
  const { isExpanded } = props;
  const { mode } = useRecoilValue(actionMode);

  const depositPropsData: DepositDetailProp[] = [
    {
      title: "Amount to Deposit",
      content: "~0.0022 ETH",
      tooltip: true,
      tooltipLabel: "0.00221110000002 ETH",
    },
    {
      title: "Estimated gas fees",
      content: "~0.0022 ETH",
      gasFee: {
        l1Gas: "0.0022 ETH",
        l2Gas: "0.0022 ETH",
      },
      tooltip: true,
      tooltipLabel: "0.00221110000002 ETH",
    },
    {
      title: "Time to Deposit",
      content: "~20 minutes",
    },
  ];

  const withdrawPropsData: WithdrawDetailProp[] = [
    {
      title: "Amount to Withdraw",
      content: "~0.0022 ETH",
      tooltip: true,
      tooltipLabel: "0.00221110000002 ETH",
    },
    {
      title: "Estimated gas fees",
      content: "~0.0022 ETH",
      gasFee: {
        l1Gas: { eth: "0.0022 ETH", ton: "0.0022 TON" },
        l2Gas: { eth: "0.0022 ETH", ton: "0.0022 TON" },
      },
    },
    {
      title: "Time to Withdraw",
      content: "approximately 7 days",
    },
  ];

  const swapPropsData: SwapDetailProp[] = [
    { title: "Expected output", content: "178.29 USDC" },
    {
      title: "Minimum received after slippage",
      content: "178.29 USDC",
      slippage: "0.1%",
    },
    { title: "Estimated gas fees", content: "0.0001 ETH", gasFee: "$3.18" },
  ];

  const detailRow = useMemo(() => {
    switch (mode) {
      case "Deposit":
        return depositPropsData.map((data) => (
          <DepositDetailRow {...data}></DepositDetailRow>
        ));
      case "Withdraw":
        return withdrawPropsData.map((data) => (
          <WithdrawDetailRow {...data}></WithdrawDetailRow>
        ));
      case "Swap":
        return swapPropsData.map((data) => <SwapDetailRow {...data} />);
      default:
        return <>{`component not founded :(`}</>;
    }
  }, [mode]);

  if (isExpanded) {
    return (
      <Flex>
        <Box flex={1} flexDir={"column"}>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} rowGap={"10px"}>
            {detailRow}
          </Flex>
          {mode === "Withdraw" && (
            <Flex flexDir={"column"}>
              <DivisionLine />
              <Flex mt={"2px"} columnGap={"12px"} alignItems={"center"}>
                <Checkbox w={"16px"} h={"16px"} mb={"15px"}></Checkbox>
                <Text lineHeight={"20px"} fontSize={14} fontWeight={500}>
                  I understand it will take approximately 7 days until my funds
                  are claimable on Ethereum Mainnet.{" "}
                </Text>
              </Flex>
            </Flex>
          )}
        </Box>
      </Flex>
    );
  }
  return null;
};

const Title = (props: {
  isExpanded: boolean;
  setIsExpended: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isExpanded, setIsExpended } = props;
  const { mode } = useRecoilValue(actionMode);
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { l1GasCost, l2GasCost } = useTransactionDetail();
  const arrowControl = useAnimation();

  useEffect(() => {
    if (isExpanded) {
      arrowControl.start({ rotate: 180 });
    } else {
      arrowControl.start({ rotate: 360 });
    }
  }, [isExpanded]);

  if (mode === "Deposit" || mode === "Withdraw") {
    return (
      <Flex
        w={"100%"}
        justifyContent={"space-between"}
        cursor={"pointer"}
        onClick={() => setIsExpended(!isExpanded)}
        fontSize={14}
      >
        <Flex alignItems={"center"} columnGap={"7.5px"}>
          <Text>{inNetwork?.chainName}</Text>
          <Box w={"10px"} h={"9px"}>
            <Image src={ArrowImg} alt={"arrow"} />
          </Box>
          <Text>{outNetwork?.chainName}</Text>
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
            $3.18
          </Text>
          <motion.div animate={arrowControl}>
            <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
          </motion.div>
        </Flex>
      </Flex>
    );
  }

  if (mode === "Swap") {
    return (
      <Flex
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        cursor={"pointer"}
        onClick={() => setIsExpended(!isExpanded)}
        fontSize={14}
      >
        <Flex>
          <Text>1 USDC</Text>
          <Text mx={"9px"}>=</Text>
          <Text>0.0006 ETH</Text>
          <Text color={"#A0A3AD"} ml={"4px"}>
            ($1.000)
          </Text>
        </Flex>
        <motion.div animate={arrowControl}>
          <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
        </motion.div>
      </Flex>
    );
  }
  return null;
};

export default function TransactionDetail() {
  const [isExpanded, setIsExpended] = useState<boolean>(false);

  // const {} = useTransactionDetail();

  return (
    <Flex
      w={"100%"}
      // h={isExpanded ? "310px" : "48px"}
      minH={"48px"}
      bg={"#1f2128"}
      borderRadius={"8px"}
      px={"20px"}
      flexDir={"column"}
      pt={isExpanded ? "20px" : "14px"}
      pb={isExpanded ? "20px" : ""}
    >
      <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
      <Content isExpanded={isExpanded}></Content>
    </Flex>
  );
}
