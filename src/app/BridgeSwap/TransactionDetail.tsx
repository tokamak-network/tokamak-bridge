import { useInOutNetwork } from "@/hooks/network";
import { actionMode, confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import { Box, Checkbox, Flex, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import ArrowImg from "assets/icons/arrow.svg";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CustomTooltip from "components/tooltip/CustomTooltip";
import {
  DepositDetailProp,
  SwapDetailProp,
  WithdrawDetailNewProp,
  WithdrawDetailProp,
  useTransactionDetail,
} from "@/hooks/transactionDetail/useTransactionDetail";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import usePriceImpact from "@/hooks/swap/usePriceImpact";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useIsLoading from "@/hooks/ui/useIsLoading";
import GradientSpinner from "@/components/ui/gradientSpinner";
import useConfirm from "@/hooks/modal/useConfirmModal";
import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";

const DivisionLine = () => {
  return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"14px"}></Box>;
};

const DepositDetailRow = (props: DepositDetailProp) => {
  const { gasFee, tooltip, tooltipLabel, title, content } = props;
  return (
    <Flex flexDir={"column"}>
      <Flex justifyContent={"space-between"} fontSize={14} h={"16px"}>
        <Text fontWeight={300}>{title}</Text>
        <Flex columnGap={"35px"}>
          <Text fontWeight={500}>
            {tooltip ? (
              <CustomTooltip content={content} tooltipLabel={tooltipLabel} />
            ) : (
              content
            )}
          </Text>
          {gasFee && <Text color={"#A0A3AD"}>${gasFee.l1GasUS}</Text>}
        </Flex>
      </Flex>
      {gasFee && (
        <Flex
          w={"100%"}
          h={"54px"}
          bgColor={"#15161D"}
          flexDir={"column"}
          fontSize={14}
          justifyContent={"center"}
          mt={"9px"}
          px={"16px"}
          borderRadius={"8px"}
        >
          <Flex justifyContent={"space-between"} textAlign={"end"}>
            <Text>L1 gas fee</Text>
            <Flex columnGap={"13px"}>
              <Text w={"90px"} textAlign={"end"}>
                {gasFee.l1Gas}
              </Text>
              <Text color={"#A0A3AD"} w={"40px"} textAlign={"end"}>
                ${gasFee.l1GasUS}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>L2 gas fee</Text>
            <Flex columnGap={"13px"}>
              <Text w={"90px "} textAlign={"end"}>
                {gasFee.l2Gas}
              </Text>
              <Text color={"#A0A3AD"} w={"40px"} textAlign={"end"}>
                ${gasFee.l2GasUS}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const WithdrawDetailRowNew = (props: WithdrawDetailNewProp) => {
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
          w={"100%"}
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
          w={"100%"}
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
  const [isLoading] = useIsLoading();
  const { isOpen } = useConfirm();
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
          {isLoading ? (
            <GradientSpinner />
          ) : (
            <Text fontWeight={500}>{content}</Text>
          )}
          {gasFee && (
            <Text
              ml={"27px"}
              fontWeight={500}
              color={isOpen ? "#fff" : "#A0A3AD"}
            >
              {gasFee}
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const Content = (props: { isExpanded: boolean; isOnConfirm?: boolean }) => {
  const { isExpanded, isOnConfirm } = props;
  const { mode } = useRecoilValue(actionMode);
  const [isConfirm, setIsConfirm] = useRecoilState(confirmWithdrawStatus);

  const {
    depositPropsData,
    withdrawPropsData,
    swapPropsData,
    withdrawNewPropsData,
  } = useTransactionDetail();
  const { isOpen } = useConfirm();

  const detailRow = useMemo(() => {
    switch (mode) {
      case "Deposit":
        return depositPropsData?.map((data) => (
          <DepositDetailRow key={data.title} {...data}></DepositDetailRow>
        ));

      // case "Withdraw":
      //   return withdrawPropsData?.map((data) => (
      //     <WithdrawDetailRow key={data.title} {...data}></WithdrawDetailRow>
      //   ));

      case "Withdraw":
        return withdrawNewPropsData?.map((data) => (
          <WithdrawDetailRowNew
            key={data.title}
            {...data}
          ></WithdrawDetailRowNew>
        ));

      case "Swap":
        return swapPropsData?.map((data) => (
          <SwapDetailRow key={data.title} {...data} />
        ));
      case "Wrap":
        return swapPropsData?.map((data) => (
          <SwapDetailRow key={data.title} {...data} />
        ));
      case "Unwrap":
        return swapPropsData?.map((data) => (
          <SwapDetailRow key={data.title} {...data} />
        ));
      default:
        return <>{`component not founded :(`}</>;
    }
  }, [
    mode,
    depositPropsData,
    withdrawPropsData,
    swapPropsData,
    withdrawNewPropsData,
  ]);

  if (isExpanded) {
    return (
      <Flex>
        <Box flex={1} flexDir={"column"}>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} rowGap={"10px"}>
            {detailRow}
          </Flex>
          {mode === "Withdraw" && isOnConfirm && isOpen && (
            <Flex flexDir={"column"}>
              <DivisionLine />
              <Flex mt={"2px"} columnGap={"12px"} alignItems={"center"}>
                <Checkbox
                  w={"16px"}
                  h={"16px"}
                  mt={"5px"}
                  mb={"auto"}
                  isChecked={isConfirm}
                  borderLeft={0}
                  borderWidth={"1px"}
                  borderColor={isConfirm ? "#fff" : "#A0A3AD"}
                  colorScheme={"#fff"}
                  onChange={(e) => {
                    const checkValue = e.target.checked;
                    setIsConfirm(checkValue);
                  }}
                ></Checkbox>
                <Text
                  lineHeight={"20px"}
                  fontSize={14}
                  fontWeight={500}
                  color={isConfirm ? "#fff" : "#A0A3AD"}
                >
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
  const { mode, swapSection } = useGetMode();
  const { inNetwork, outNetwork } = useInOutNetwork();
  const { inToken, outToken } = useInOutTokens();
  const arrowControl = useAnimation();
  const { outPrice } = usePriceImpact();
  const [isLoading] = useIsLoading();
  const { isOpen } = useConfirm();
  const { gasCostUS } = useGasFee();

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
        cursor={isOpen ? "" : "pointer"}
        onClick={() => isOpen === false && setIsExpended(!isExpanded)}
        fontSize={14}
      >
        <Flex alignItems={"center"} columnGap={"7.5px"}>
          {/* {isLoading && <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />} */}
          <Text>{inNetwork?.chainName}</Text>
          <Box w={"10px"} h={"9px"}>
            <Image src={ArrowImg} alt={"arrow"} />
          </Box>
          <Text>{outNetwork?.chainName}</Text>
        </Flex>
        {isOpen === false && (
          <Flex alignItems={"center"}>
            {isOpen === isExpanded && <Image src={GasImg} alt={"gasStation"} />}
            {isOpen === isExpanded && (
              <Text
                fontSize={14}
                fontWeight={400}
                color={"#A0A3AD"}
                ml={"6px"}
                mr={"13px"}
              >
                ${gasCostUS}
              </Text>
            )}
            <motion.div animate={arrowControl}>
              <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
            </motion.div>
          </Flex>
        )}
      </Flex>
    );
  }

  if (swapSection) {
    return (
      <Flex
        w={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
        cursor={isOpen ? "" : "pointer"}
        onClick={() => isOpen === false && setIsExpended(!isExpanded)}
        fontSize={14}
      >
        {isLoading ? (
          <GradientSpinner />
        ) : (
          <Flex>
            <Text>
              {1} {inToken?.tokenSymbol}
            </Text>
            <Text mx={"9px"}>=</Text>
            <Text>
              {outPrice} {outToken?.tokenSymbol}
            </Text>
            {isOpen === false && (
              <Text color={"#A0A3AD"} ml={"4px"}>
                ($1.000)
              </Text>
            )}
          </Flex>
        )}
        {isOpen === false && (
          <Flex>
            {isExpanded === false && <Image src={GasImg} alt={"gasStation"} />}
            {isOpen === isExpanded && (
              <Text
                fontSize={14}
                fontWeight={400}
                color={"#A0A3AD"}
                ml={"6px"}
                mr={"13px"}
              >
                ${gasCostUS}
              </Text>
            )}
            <motion.div animate={arrowControl}>
              <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
            </motion.div>
          </Flex>
        )}
      </Flex>
    );
  }
  return null;
};

export default function TransactionDetail(props: { isOnConfirm?: boolean }) {
  const { isOnConfirm } = props;
  const { isOpen } = useConfirm();
  const [isExpanded, setIsExpended] = useState<boolean>(isOpen);
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();

  const { mode, isReady } = useGetMode();

  if (
    !isReady ||
    mode === "Wrap" ||
    mode === "Unwrap" ||
    isNotSupportForSwap ||
    isNotSupportForBridge
  ) {
    return null;
  }

  return (
    <Flex
      w={"100%"}
      // h={isExpanded ? "310px" : "48px"}
      minH={"48px"}
      bg={"#1f2128"}
      borderRadius={"8px"}
      px={isOpen ? 0 : "20px"}
      flexDir={"column"}
      pt={isOpen ? 0 : isExpanded ? "20px" : "14px"}
      pb={isOpen ? 0 : isExpanded ? "20px" : ""}
    >
      <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
      <Content isExpanded={isExpanded} isOnConfirm={isOnConfirm}></Content>
    </Flex>
  );
}
