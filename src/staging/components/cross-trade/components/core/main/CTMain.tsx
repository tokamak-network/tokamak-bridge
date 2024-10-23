import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Flex,
  Text,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { CrossTradeData } from "@/staging/types/crossTrade";
import TokenDetail from "@/staging/components/cross-trade/components/core/main/TokenDetail";
import CTProvider from "@/staging/components/cross-trade/components/core/main/CTMainProvider";
import Image from "next/image";
import Polygon from "assets/icons/ct/polygon.svg";
import { useRequestData } from "@/staging/hooks/useCrossTrade";
import GradientSpinner from "@/components/ui/GradientSpinner";
import { CustomTooltipWithQuestion } from "@/components/tooltip/CustomTooltip";
import useConnectedNetwork from "@/hooks/network";
import useMediaView from "@/hooks/mediaView/useMediaView";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import capitalizeFirstLetter from "@/staging/utils/capitalizeFirstLetter";
import { convertNumber } from "@/utils/trim/convertNumber";
import { formatProfit } from "@/staging/utils/formatProfit";
import formatNumber from "@/staging/utils/formatNumbers";
import { useProvideCTGas } from "../../../hooks/useCTGas";

{
  /** 
    If the requester is the same as the current user's address, do not show the request in the list.
    When someone makes a new request, the request is initially disabled.
    After a 15-minute countdown, the request becomes active and the 'Provide' button is enabled.
    by Monica
  */
}
export default function CTMain() {
  /** mobileview start */
  const { mobileView } = useMediaView();

  /** mobileview end */

  const [isDescSortedProvide, setIsDescSortedProvide] = useState<
    boolean | null
  >(null);
  const [isDescSortedReceive, setIsDescSortedReceive] = useState<
    boolean | null
  >(null);
  const [isDescSortedProfit, setIsDescSortedProfit] = useState<boolean | null>(
    null
  );
  const { requestList, isLoading } = useRequestData();
  const [data, setData] = useState<CrossTradeData[] | null>(null);

  useEffect(() => {
    if (requestList) {
      setData(requestList);
    }
  }, [requestList]);

  useEffect(() => {
    if (isDescSortedProvide === null) return;
    if (isDescSortedProvide) {
      return setData(
        (prevData) =>
          prevData && [
            ...prevData.sort((a, b) => b.providingUSD - a.providingUSD),
          ]
      );
    }
    if (!isDescSortedProvide) {
      return setData(
        (prevData) =>
          prevData && [
            ...prevData.sort((a, b) => a.providingUSD - b.providingUSD),
          ]
      );
    }
  }, [isDescSortedProvide]);

  useEffect(() => {
    if (isDescSortedReceive === null) return;
    if (isDescSortedReceive) {
      return setData(
        (prevData) =>
          prevData && [
            ...prevData.sort((a, b) => b.recevingUSD - a.recevingUSD),
          ]
      );
    }
    if (!isDescSortedReceive) {
      return setData(
        (prevData) =>
          prevData && [
            ...prevData.sort((a, b) => a.recevingUSD - b.recevingUSD),
          ]
      );
    }
  }, [isDescSortedReceive]);

  useEffect(() => {
    if (isDescSortedProfit === null) return;
    if (isDescSortedProfit) {
      return setData(
        (prevData) =>
          prevData && [
            ...prevData.sort(
              (a, b) => Number(b.profit.percent) - Number(a.profit.percent)
            ),
          ]
      );
    }
    if (!isDescSortedProfit) {
      return setData(
        (prevData) =>
          prevData && [
            ...prevData.sort(
              (a, b) => Number(a.profit.percent) - Number(b.profit.percent)
            ),
          ]
      );
    }
  }, [isDescSortedProfit]);

  const [displayedItems, setDisplayedItems] = useState<CrossTradeData[]>([]);
  const [itemsToShow, setItemsToShow] = useState<number | undefined>(10);
  const observer = useRef<IntersectionObserver | null>(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const { isConnectedToMainNetwork, isConnectedToTestNetwork } =
    useConnectedNetwork();

  //will be refactored to controll fetch data with it to save traffics
  useEffect(() => {
    // Initialize displayed items
    if (data && itemsToShow) setDisplayedItems(data.slice(0, itemsToShow));
  }, [data, itemsToShow]);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadMoreItems = useCallback(() => {
    const rowHeight = 70.5;
    const additionalItems = Math.floor(viewportHeight / rowHeight);
    setItemsToShow((prev) => prev && prev + additionalItems);
  }, [viewportHeight]);

  const lastItemRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  return mobileView ? (
    <Flex direction="column" width="100%" height="100%" padding="0">
      {displayedItems.length === 0 && (
        <Flex
          justifyContent="center"
          alignItems="center"
          height="100%"
          flexDirection="column"
          mt={"16px"}
        >
          <Text
            fontSize="14px"
            color="#E3F3FF"
            fontWeight="400"
            lineHeight={"21px"}
          >
            No active requests
          </Text>
        </Flex>
      )}

      {displayedItems?.map((item, index) => {
        if (item.isProvided) return null;
        const status = item.isProvided;

        const formattedAmount = convertNumber(
          item.outToken.amount,
          item.outToken.decimals
        );

        const chainNameIn =
          getKeyByValue(SupportedChainId, item.inNetwork) || "";
        const chainNameOut =
          getKeyByValue(SupportedChainId, item.outNetwork) || "";

        const displayNetworkNameIn =
          chainNameIn === "MAINNET"
            ? "Ethereum"
            : chainNameIn === "TITAN_SEPOLIA"
            ? "Titan Sepolia"
            : capitalizeFirstLetter(chainNameIn);

        const displayNetworkNameOut =
          chainNameOut === "MAINNET"
            ? "Ethereum"
            : chainNameOut === "TITAN_SEPOLIA"
            ? "Titan Sepolia"
            : capitalizeFirstLetter(chainNameOut);
        const isNegativeProfit = item.profit?.percent
          ? Number(item.profit?.percent) < 0
          : false;

        return (
          <Box
            w="100%"
            h="100%"
            py={"12px"}
            borderBottom={"1px solid #313442"}
            ref={index === displayedItems.length - 1 ? lastItemRef : null}
          >
            <Flex justifyContent="space-between" alignItems={"center"}>
              <Flex alignItems={"center"}>
                <Box>
                  <TokenSymbolWithNetwork
                    tokenSymbol={item.outToken.symbol}
                    chainId={item.inNetwork}
                    networkSymbolW={22}
                    networkSymbolH={22}
                    symbolW={40}
                    symbolH={40}
                    right={0}
                    bottom={0}
                  />
                </Box>
                <Flex direction={"column"} ml="12px">
                  <Text
                    fontSize="13px"
                    fontWeight={400}
                    lineHeight="19.5px"
                    color="#A0A3AD"
                  >
                    Receive on {displayNetworkNameIn}
                  </Text>
                  <Flex alignItems={"center"} columnGap={"6px"}>
                    <Text
                      fontSize="16px"
                      fontWeight={600}
                      lineHeight="24px"
                      color="#FFFFFF"
                      mr="3px"
                    >
                      {formatNumber(formattedAmount)} {item.outToken.symbol}
                    </Text>
                    <Text
                      fontSize="16px"
                      fontWeight={400}
                      lineHeight="24px"
                      color={isNegativeProfit ? "#DD3A44" : "#03D187"}
                    >
                      {!isNegativeProfit && "+"}
                      {formatProfit(item.profit?.percent)}%
                    </Text>
                  </Flex>
                  <Text
                    fontSize="13px"
                    fontWeight={500}
                    lineHeight="19.5px"
                    color="#DB00FF"
                  >
                    Provide on {displayNetworkNameOut}
                  </Text>
                </Flex>
              </Flex>
              <Box>
                <CTProvider
                  status={status}
                  crossTradeData={item}
                  subgraphData={item.subgraphData}
                  serviceFee={item.serviceFee}
                  isNetaveProfit={item.isNetaveProfit}
                />
              </Box>
            </Flex>
          </Box>
        );
      })}
    </Flex>
  ) : (
    <Box
      w="100%"
      h="100%"
      borderRadius={"16px"}
      border={"1px solid #313442"}
      overflow="hidden"
      pos={"sticky"}
      top={500}
    >
      <Table variant={"unstyled"} w="100%" h="100%">
        <Thead pos={"sticky"} top={0} zIndex={10000}>
          <Tr
            sx={{
              "& th": { pl: "20px", py: "10px", pr: "auto" },
              borderBottom: "1px solid #23242B",
              letterSpacing: 0,
            }}
          >
            <Th textTransform="none" minW={"210px"} maxW={"210px"}>
              <Flex
                alignItems="center"
                cursor={"pointer"}
                onClick={() => {
                  setIsDescSortedReceive(null);
                  setIsDescSortedProfit(null);
                  setIsDescSortedProvide(
                    isDescSortedProvide !== null ? !isDescSortedProvide : true
                  );
                }}
              >
                {isDescSortedProvide !== null && (
                  <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    style={{
                      transform: isDescSortedProvide
                        ? "rotate(360deg)"
                        : "rotate(180deg)",
                    }}
                    mr="4px"
                  >
                    <Image src={Polygon} alt={"Polygon"} />
                  </Flex>
                )}
                <Text
                  fontWeight={"500"}
                  fontSize={"13px"}
                  lineHeight={"18px"}
                  letterSpacing={0}
                  color={isDescSortedProvide !== null ? "#fff" : "#A0A3AD"}
                >
                  Provide
                </Text>
                <CustomTooltipWithQuestion
                  isGrayIcon={true}
                  tooltipLabel={"Total amount to pay."}
                  containerSyle={{ marginLeft: "2px", fontSize: "12px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none" minW={"210px"} maxW={"210px"}>
              <Flex
                alignItems="center"
                cursor={"pointer"}
                onClick={() => {
                  setIsDescSortedProvide(null);
                  setIsDescSortedProfit(null);
                  setIsDescSortedReceive(
                    isDescSortedReceive !== null ? !isDescSortedReceive : true
                  );
                }}
              >
                {isDescSortedReceive !== null && (
                  <Flex
                    ml="4px"
                    justifyContent={"center"}
                    alignItems={"center"}
                    style={{
                      transform: isDescSortedReceive
                        ? "rotate(360deg)"
                        : "rotate(180deg)",
                    }}
                    mr="4px"
                  >
                    <Image src={Polygon} alt={"Polygon"} />
                  </Flex>
                )}
                <Text
                  fontWeight={"500"}
                  fontSize={"13px"}
                  lineHeight={"18px"}
                  letterSpacing={0}
                  color={isDescSortedReceive !== null ? "#fff" : "#A0A3AD"}
                >
                  Receive
                </Text>
                <CustomTooltipWithQuestion
                  isGrayIcon={true}
                  tooltipLabel={
                    <span style={{ fontSize: 12 }}>
                      Total amount to receive, including the service
                      <br /> fee. It takes at least 15 minutes to receive <br />{" "}
                      (depending on the L2 sequencer).
                    </span>
                  }
                  style={{
                    width: "289px",
                    height: "74px",
                    tooltipLineHeight: "normal",
                    py: "10px",
                    px: "8px",
                  }}
                  containerSyle={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none" minW={"140px"} maxW={"140px"} p={0}>
              <Flex
                cursor={"pointer"}
                onClick={() => {
                  setIsDescSortedProvide(null);
                  setIsDescSortedReceive(null);
                  setIsDescSortedProfit(
                    isDescSortedProfit !== null ? !isDescSortedProfit : true
                  );
                }}
              >
                {isDescSortedProfit !== null && (
                  <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    style={{
                      transform: isDescSortedProfit
                        ? "rotate(360deg)"
                        : "rotate(180deg)",
                    }}
                    mr="4px"
                  >
                    <Image src={Polygon} alt={"Polygon"} />
                  </Flex>
                )}
                <Text
                  fontWeight={"500"}
                  fontSize={"13px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                  letterSpacing={0}
                >
                  Net Profit
                </Text>
                <CustomTooltipWithQuestion
                  isGrayIcon={true}
                  tooltipLabel={
                    <span style={{ fontSize: 12 }}>
                      <span style={{ fontWeight: 600 }}>
                        Net Profit = Receive - Provide - txn fee
                      </span>
                      <br />
                      Net profit for provider is heavily depends on the
                      <br />
                      transaction fee, which is a highly volatile value.
                      <br />
                      Please double-check it before providing.
                    </span>
                  }
                  style={{
                    width: "300px",
                    height: "92px",
                    tooltipLineHeight: "normal",
                    py: "10px",
                    px: "8px",
                  }}
                  containerSyle={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading && (
            <Tr
              key={0}
              sx={{
                "& td": { pl: "20px", py: "16px", pr: "auto" },
                borderBottom: "1px solid #23242B",
              }}
              textAlign={"center"}
            >
              <Td
                colSpan={4}
                style={{
                  height: "288px",
                  color: "#E3F3FF",
                }}
              >
                <GradientSpinner h={"14px"} mb={"12px"} />
                <GradientSpinner h={"14px"} mb={"32px"} />
                <GradientSpinner h={"14px"} mb={"12px"} />
                <GradientSpinner h={"14px"} />
                <Flex h={"17px"} mb={"14px"}>
                  <GradientSpinner />
                </Flex>
                <Flex h={"17px"} mb={"32px"}>
                  <GradientSpinner />
                </Flex>
                <Flex h={"17px"} mb={"14px"}>
                  <GradientSpinner />
                </Flex>
              </Td>
            </Tr>
          )}
          {!isLoading && data?.length === 0 && (
            <Tr
              key={0}
              sx={{
                "& td": { pl: "20px", py: "16px", pr: "auto" },
                borderBottom: "1px solid #23242B",
              }}
              textAlign={"center"}
            >
              <Td
                colSpan={4}
                style={{
                  textAlign: "center",
                  height: "144px",
                  lineHeight: "144px",
                  color: "#E3F3FF",
                }}
              >
                <Box>No active requests</Box>
              </Td>
            </Tr>
          )}
          {!isLoading &&
            displayedItems?.map((item, index) => {
              //Decided not to show the request is already done with providing liquidity because countdown does not needed.
              if (item.isProvided) return null;
              // const status = getStatus(item);
              const status = item.isProvided;
              // const rowOpacity = status === STATUS.COUNTDOWN ? 0.3 : 1;
              const rowOpacity = status ? 0.3 : 1;
              return (
                <Tr
                  key={index}
                  sx={{
                    "& td": { pl: "20px", py: "16px", pr: "auto" },
                    borderBottom: "1px solid #23242B",
                  }}
                  ref={lastItemRef}
                >
                  <Td sx={{ opacity: rowOpacity }}>
                    <TokenDetail
                      token={item.inToken}
                      network={item.outNetwork}
                      isProvide={true}
                      providingUSD={item.providingUSD}
                    />
                  </Td>
                  <Td sx={{ opacity: rowOpacity }}>
                    <TokenDetail
                      token={item.outToken}
                      network={item.inNetwork}
                      isProvide={false}
                      recevingUSD={item.recevingUSD}
                    />
                  </Td>
                  <Td sx={{ opacity: rowOpacity }}>
                    <TokenDetail
                      profit={item.profit}
                      providingUSD={item.providingUSD}
                      provideCTTxnCost={item.provideCTTxnCost}
                    />
                  </Td>
                  <Td>
                    <CTProvider
                      status={status}
                      crossTradeData={item}
                      subgraphData={item.subgraphData}
                      serviceFee={item.serviceFee}
                      isNetaveProfit={item.isNetaveProfit}
                    />
                  </Td>
                </Tr>
              );
            })}
        </Tbody>
      </Table>
    </Box>
  );
}
