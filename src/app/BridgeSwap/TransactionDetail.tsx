import { useInOutNetwork } from "@/hooks/network";
import { actionMode, confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import { Box, Checkbox, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import ArrowImg from "assets/icons/arrow.svg";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CustomTooltip from "components/tooltip/CustomTooltip";
import Swap from "./Swap";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import {
  DepositDetailProp,
  SwapDetailProp,
  WithdrawDetailProp,
  useTransactionDetail,
} from "@/hooks/transactionDetail/useTransactionDetail";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

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
            <Text>{isTON ? gasFee.l1Gas.ton : gasFee.l1Gas.eth}</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>L2 gas fee</Text>
            <Text>{isTON ? gasFee.l2Gas.ton : gasFee.l2Gas.eth}</Text>
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
  const [isConfirm, setIsConfirm] = useRecoilState(confirmWithdrawStatus);

  const { depositPropsData, withdrawPropsData, swapPropsData } =
    useTransactionDetail();

  const detailRow = useMemo(() => {
    switch (mode) {
      case "Deposit":
        return depositPropsData?.map((data) => (
          <DepositDetailRow key={data.title} {...data}></DepositDetailRow>
        ));
      case "Withdraw":
        return withdrawPropsData?.map((data) => (
          <WithdrawDetailRow key={data.title} {...data}></WithdrawDetailRow>
        ));
      case "Swap":
        return swapPropsData?.map((data) => (
          <SwapDetailRow key={data.title} {...data} />
        ));
      default:
        return <>{`component not founded :(`}</>;
    }
  }, [mode, depositPropsData, withdrawPropsData, swapPropsData]);

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
                <Checkbox
                  w={"16px"}
                  h={"16px"}
                  mb={"15px"}
                  isChecked={isConfirm}
                  onChange={(e) => {
                    const checkValue = e.target.checked;
                    setIsConfirm(checkValue);
                  }}
                ></Checkbox>
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
  const { inToken, outToken } = useInOutTokens();
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
          <Text>
            {inToken?.parsedAmount} {inToken?.tokenName}
          </Text>
          <Text mx={"9px"}>=</Text>
          <Text>
            {outToken?.parsedAmount} {outToken?.tokenName}
          </Text>
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
