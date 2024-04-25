import useConnectedNetwork, { useInOutNetwork } from "@/hooks/network";
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
  WrapDetailProp,
} from "@/hooks/transactionDetail/useTransactionDetail";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import usePriceImpact from "@/hooks/swap/usePriceImpact";
import { useGetMode } from "@/hooks/mode/useGetMode";
import useIsLoading from "@/hooks/ui/useIsLoading";
import GradientSpinner from "@/components/ui/GradientSpinner";
import useConfirm from "@/hooks/modal/useConfirmModal";
import useBridgeSupport from "@/hooks/bridge/useBridgeSupport";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import { useApprove } from "@/hooks/token/useApproval";
import { convertNetworkName } from "@/utils/network/convertNetworkName";
import useInputBalanceCheck from "@/hooks/token/useInputCheck";
import { useAccount } from "wagmi";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useIsTon from "@/hooks/token/useIsTon";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

const DivisionLine = () => {
  return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"14px"}></Box>;
};

const DepositDetailRow = (props: DepositDetailProp) => {
  const { gasFee, tooltip, tooltipLabel, title, content } = props;
  const { mobileView } = useMediaView();

  return (
    <Flex flexDir={"column"}>
      <Flex
        justifyContent={"space-between"}
        fontSize={{ base: 11, lg: 14 }}
        h={"16px"}
      >
        <Text fontWeight={300}>{title}</Text>
        <Flex columnGap={"35px"}>
          <Text fontWeight={500}>
            {tooltip ? (
              <CustomTooltip content={content} tooltipLabel={tooltipLabel} />
            ) : (
              content
            )}
          </Text>
          {gasFee && (
            <Text color={mobileView ? "#FFFFFF" : "#A0A3AD"}>
              ${gasFee.l1GasUS}
            </Text>
          )}
        </Flex>
      </Flex>
      {/* {gasFee && pcView && (
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
              <Text color={"#A0A3AD"} w={"45px"} textAlign={"end"}>
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
              <Text color={"#A0A3AD"} w={"45px"} textAlign={"end"}>
                ${gasFee.l2GasUS}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      )}  */}
    </Flex>
  );
};

const WithdrawDetailRowNew = (props: WithdrawDetailNewProp) => {
  const { gasFee, tooltip, tooltipLabel, title, content } = props;
  const { mobileView } = useMediaView();
  const { isBalanceOver } = useInputBalanceCheck();

  return (
    <Flex flexDir={"column"}>
      <Flex
        justifyContent={"space-between"}
        fontSize={{ base: 11, lg: 14 }}
        h={"16px"}
        color={isBalanceOver ? "#A0A3AD" : ""}
      >
        <Text fontWeight={300}>{title}</Text>
        <Flex columnGap={"35px"}>
          <Text fontWeight={500}>
            {tooltip ? (
              <CustomTooltip content={content} tooltipLabel={tooltipLabel} />
            ) : (
              content
            )}
          </Text>
          {gasFee && <Text color={"#A0A3AD"}>${gasFee.l2GasUS}</Text>}
        </Flex>

        {/* <Text fontWeight={500}>
          {tooltip ? (
            <CustomTooltip content={content} tooltipLabel={tooltipLabel} />
          ) : (
            content
          )}
        </Text> */}
      </Flex>

      {/* {gasFee && (

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
      )} */}
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
                  style={{
                    width: "185px",
                    bgColor: "#007AFF",
                  }}
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
  const { mobileView } = useMediaView();
  const { layer } = useConnectedNetwork();
  const { isBalanceOver } = useInputBalanceCheck();

  return (
    <Flex flexDir={"column"}>
      <Flex
        justifyContent={"space-between"}
        fontSize={{ base: 11, lg: 14 }}
        h={"16px"}
      >
        <Flex columnGap={"4px"}>
          <Text
            fontWeight={mobileView && isOpen ? 500 : 300}
            color={mobileView && !isOpen ? "#A0A3AD" : "inherit"}
          >
            {title}
          </Text>
          {slippage && (
            <Text
              fontWeight={mobileView && isOpen ? 500 : 300}
              color={"#A0A3AD"}
            >
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

const WrapDetailRow = (props: WrapDetailProp) => {
  const { title, gasFee, gasFeeUS } = props;
  const [isLoading] = useIsLoading();
  const { layer } = useConnectedNetwork();
  const { isBalanceOver } = useInputBalanceCheck();

  return (
    <Flex flexDir={"column"} color={isBalanceOver ? "#a0a3ad" : ""}>
      <Flex
        height={"14px"}
        justifyContent={"space-between"}
        fontSize={{ base: 11, lg: 14 }}
      >
        <Flex columnGap={"4px"}>
          <Text fontWeight={300}>{title}</Text>
        </Flex>
        <Flex>
          {isLoading ? <GradientSpinner /> : <Text fontWeight={500}>{}</Text>}
          {gasFee && (
            <Text mr={"27px"} fontWeight={500}>
              {gasFee}
            </Text>
          )}
          {gasFee && <Text color={"#A0A3AD"}>{gasFeeUS}</Text>}
        </Flex>
      </Flex>
    </Flex>
  );
};
const Content = (props: {
  isExpanded: boolean;
  isOnConfirm?: boolean;
  isMobile?: boolean;
}) => {
  const { isExpanded, isOnConfirm, isMobile } = props;
  const { mode } = useRecoilValue(actionMode);
  const [isConfirm, setIsConfirm] = useRecoilState(confirmWithdrawStatus);
  const { mobileView } = useMediaView();

  type SwapDetailMobileProp = {
    // title?:
    //   | "Expected output"
    //   | "Minimum received"
    //   | "Minimum received after slippage"
    //   | "Price impact"
    //   | "Estimated gas fees"
    //   | "Estimated L2 execution fee (sans L1 fee)";
    title?: string;
    content?: string | undefined;
    gasFee?: string;
    slippage?: string;
  };
  const {
    depositPropsData,
    withdrawPropsData,
    swapPropsData,
    withdrawNewPropsData,
    WrapUnwrapPropsData,
  } = useTransactionDetail();

  const { isOpen } = useConfirm();

  let updatedSwapPropsData: SwapDetailMobileProp[] = [];
  if (swapPropsData && swapPropsData[1]) {
    const updatedElement = {
      ...swapPropsData[1],
      title: "Min receive",
    };
    updatedSwapPropsData = [updatedElement];
  }

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
        if (mobileView && updatedSwapPropsData && !isOnConfirm) {
          return updatedSwapPropsData.map((data) => (
            <SwapDetailRow key={data.title} {...data} />
          ));
        }
        return swapPropsData?.map((data) => (
          <SwapDetailRow key={data.title} {...data} />
        ));

      case "Wrap":
        return WrapUnwrapPropsData?.map((data) => (
          <WrapDetailRow key={data.title} {...data} />
        ));
      case "Unwrap":
        return WrapUnwrapPropsData?.map((data) => (
          <WrapDetailRow key={data.title} {...data} />
        ));
      case "ETH-Wrap":
        return WrapUnwrapPropsData?.map((data) => (
          <WrapDetailRow key={data.title} {...data} />
        ));
      case "ETH-Unwrap":
        return WrapUnwrapPropsData?.map((data) => (
          <WrapDetailRow key={data.title} {...data} />
        ));
      default:
        return <>{`component not found :(`}</>;
    }
  }, [
    mode,
    depositPropsData,
    withdrawPropsData,
    swapPropsData,
    withdrawNewPropsData,
    WrapUnwrapPropsData,
  ]);

  if (isExpanded) {
    return (
      <Flex>
        <Box flex={1} flexDir={"column"}>
          {!isMobile && <DivisionLine />}
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
                  fontSize={{ base: 13, lg: 14 }}
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
  const { inToken, outToken, tokensPairHasAmount } = useInOutTokens();
  const arrowControl = useAnimation();
  const { outPrice } = usePriceImpact();
  const [isLoading] = useIsLoading();
  const { isOpen } = useConfirm();
  const { gasCostUS } = useGasFee();
  const { isBalanceOver } = useInputBalanceCheck();
  const { mobileView } = useMediaView();

  useEffect(() => {
    if (isExpanded) {
      arrowControl.start({ rotate: 180 });
    } else {
      arrowControl.start({ rotate: 360 });
    }
  }, [isExpanded]);

  const isWrapUnwrap =
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Wrap" ||
    mode === "ETH-Unwrap";

  const { tokenPriceWithAmount: token1PriceWithAmount } = useGetMarketPrice({
    tokenName: outToken?.tokenName as string,
    amount: Number(isWrapUnwrap ? 1 : outPrice),
  });

  const formatPrice = (price: number | undefined) => {
    if (price === undefined) {
      return 0;
    }

    const priceStr = price.toString();
    return priceStr.length > 10 ? `${priceStr.slice(0, 10)}...` : priceStr;
  };

  if (mode === "Deposit" || mode === "Withdraw") {
    return (
      <Flex
        w={"100%"}
        justifyContent={"space-between"}
        cursor={isOpen || mobileView ? "" : "pointer"}
        onClick={() => !isOpen && !mobileView && setIsExpended(!isExpanded)}
        fontSize={{ base: 12, lg: 14 }}
      >
        <Flex alignItems={"center"} columnGap={"7.5px"}>
          {/* {isLoading && <Spinner w={"24px"} h={"24px"} color={"#007AFF"} />} */}
          <Text>{convertNetworkName(inNetwork?.chainName)}</Text>
          <Box w={"10px"} h={"9px"}>
            <Image src={ArrowImg} alt={"arrow"} />
          </Box>
          <Text>{convertNetworkName(outNetwork?.chainName)}</Text>
        </Flex>
        {(mobileView || !isOpen) && (
          <Flex alignItems={"center"}>
            {(isOpen === isExpanded || mobileView) && (
              <>
                <Image src={GasImg} alt={"gasStation"} />
                <Text
                  fontSize={{ base: 12, lg: 14 }}
                  fontWeight={400}
                  color={"#A0A3AD"}
                  ml={"6px"}
                  mr={"13px"}
                >
                  {gasCostUS ? `${gasCostUS}` : `NA`}
                </Text>
              </>
            )}
            {!mobileView && (
              <motion.div animate={arrowControl}>
                {<Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />}
              </motion.div>
            )}
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
        cursor={isOpen || mobileView ? "" : "pointer"}
        onClick={() => !isOpen && !mobileView && setIsExpended(!isExpanded)}
        fontSize={{ base: 12, lg: 14 }}
      >
        {isLoading ? (
          <Box w={"100%"} h={"20px"} mb={"5px"}>
            <GradientSpinner />
          </Box>
        ) : (
          <Flex>
            <Text>
              {1} {inToken?.tokenSymbol}
            </Text>
            <Text mx={mobileView ? "4px" : "9px"}>=</Text>
            <Text>
              {isWrapUnwrap ? 1 : formatPrice(outPrice)} {outToken?.tokenSymbol}
              {mobileView && (
                <Text as="span" color="#A0A3AD">
                  (${token1PriceWithAmount})
                </Text>
              )}
            </Text>
            {/* {isOpen === false && (
              <Text color={"#A0A3AD"} ml={"4px"}>
                ($1.000)
              </Text>
            )} */}
          </Flex>
        )}
        {isLoading
          ? null
          : isOpen === false && (
              <Flex>
                {(!isExpanded || mobileView) && (
                  <>
                    <Image src={GasImg} alt={"gasStation"} />
                    <Text
                      fontSize={{ base: 11, lg: 14 }}
                      fontWeight={400}
                      color={"#A0A3AD"}
                      ml={"6px"}
                      sx={{ mr: mobileView ? 0 : "13px" }}
                    >
                      {gasCostUS ? `${gasCostUS}` : `NA`}
                    </Text>
                  </>
                )}
                {!mobileView && (
                  <motion.div animate={arrowControl}>
                    <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
                  </motion.div>
                )}
              </Flex>
            )}
      </Flex>
    );
  }
  return null;
};

export default function TransactionDetail(props: {
  isOnConfirm?: boolean;
  isMobile?: boolean;
}) {
  const { isOnConfirm, isMobile } = props;
  const { isOpen } = useConfirm();

  // 해당 코드를 통해 모바일에서는 무조건 detail을 확장합니다.
  const { mobileView } = useMediaView();
  useEffect(() => {
    setIsExpended(isOpen || mobileView);
  }, [mobileView]);

  const [isExpanded, setIsExpended] = useState<boolean>(isOpen || mobileView);
  const { isNotSupportForBridge, isNotSupportForSwap } = useBridgeSupport();
  const { isApproved } = useApprove();

  const { mode, isReady } = useGetMode();
  const { outToken } = useInOutTokens();
  const { isInputZero } = useInputBalanceCheck();
  const { isConnected } = useAccount();
  const { isTONatPair } = useIsTon();

  const isWrapUnwrap =
    mode === "Wrap" ||
    mode === "Unwrap" ||
    mode === "ETH-Wrap" ||
    mode === "ETH-Unwrap";

  if (
    !isReady ||
    isNotSupportForSwap ||
    isNotSupportForBridge ||
    (mode === "Swap" && outToken === null) ||
    isInputZero ||
    !isConnected ||
    (mode === "Swap" && isTONatPair)
  ) {
    return null;
  }

  return (
    <Flex
      w={"100%"}
      // h={isExpanded ? "310px" : "48px"}
      minH={{ base: "40px", lg: "48px" }}
      bg={"#1f2128"}
      borderRadius={"8px"}
      px={!isMobile ? { base: "16px", lg: "20px" } : ""}
      flexDir={"column"}
      pt={
        !isMobile
          ? {
              base: isExpanded ? "11px" : "11px",
              lg: isExpanded ? "20px" : "14px",
            }
          : ""
      }
      pb={{
        base: isExpanded ? "12px" : "",
        lg: isExpanded ? "20px" : "",
      }}
    >
      {!isMobile && (
        <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
      )}
      {(!mobileView ||
        isOnConfirm ||
        (mode !== "Deposit" &&
          mode !== "Withdraw" &&
          !(isWrapUnwrap && mobileView))) && (
        <Content
          isExpanded={isExpanded}
          isOnConfirm={isOnConfirm}
          isMobile={isMobile}
        ></Content>
      )}
    </Flex>
  );
}
