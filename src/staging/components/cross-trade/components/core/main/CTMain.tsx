import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
  Center,
} from "@chakra-ui/react";
import { CrossTradeData } from "@/staging/types/crossTrade";
import TokenDetail from "@/staging/components/cross-trade/components/core/main/TokenDetail";
import CTProvider from "@/staging/components/cross-trade/components/core/main/CTMainProvider";
import { Tooltip } from "@/staging/components/common/Tooltip";
import Image from "next/image";
import Polygon from "assets/icons/ct/polygon.svg";
import { useAccount } from "wagmi";
import { useRequestData } from "@/staging/hooks/useCrossTrade";
import GradientSpinner from "@/components/ui/GradientSpinner";
import { CustomTooltipWithQuestion } from "@/components/tooltip/CustomTooltip";
import useConnectedNetwork from "@/hooks/network";

{
  /** 
    If the requester is the same as the current user's address, do not show the request in the list.
    When someone makes a new request, the request is initially disabled.
    After a 15-minute countdown, the request becomes active and the 'Provide' button is enabled.
    by Monica
  */
}
export default function CTMain() {
  const LIMIT = 50;
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const [isDescSortedProvide, setIsDescSortedProvide] = useState<
    boolean | null
  >(null);
  const [isDescSortedReceive, setIsDescSortedReceive] = useState<
    boolean | null
  >(null);
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

  const [displayedItems, setDisplayedItems] = useState<CrossTradeData[]>([]);
  const [itemsToShow, setItemsToShow] = useState<number | undefined>(10);
  const observer = useRef<IntersectionObserver | null>(null);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const { isConnectedToMainNetwork } = useConnectedNetwork();

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

  return (
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
                  containerSyle={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none" minW={"210px"} maxW={"210px"}>
              <Flex
                alignItems="center"
                cursor={"pointer"}
                onClick={() => {
                  setIsDescSortedProvide(null);
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
                    <span>
                      Total amount to receive, including the service
                      <br /> fee. It takes at least 2~5 minutes to receive{" "}
                      <br /> (depending on the L2 sequencer).
                    </span>
                  }
                  style={{
                    width: "268px",
                    height: "70px",
                    tooltipLineHeight: "normal",
                    py: "10px",
                    px: "8px",
                  }}
                  containerSyle={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none" minW={"140px"} maxW={"140px"} p={0}>
              <Flex>
                <Text
                  fontWeight={"500"}
                  fontSize={"13px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                  letterSpacing={0}
                >
                  Profit (%)
                </Text>
              </Flex>
            </Th>
            <Th textTransform="none"></Th>
          </Tr>
        </Thead>
        <Tbody>
          {isConnectedToMainNetwork && (
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
                <Box>Not available on Ethereum and Titan mainnet</Box>
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
                      network={item.inNetwork}
                      isProvide={true}
                      providingUSD={item.providingUSD}
                    />
                  </Td>
                  <Td sx={{ opacity: rowOpacity }}>
                    <TokenDetail
                      token={item.outToken}
                      network={item.outNetwork}
                      isProvide={false}
                      recevingUSD={item.recevingUSD}
                    />
                  </Td>
                  <Td sx={{ opacity: rowOpacity }}>
                    <TokenDetail profit={item.profit} />
                  </Td>
                  <Td>
                    <CTProvider
                      status={status}
                      crossTradeData={item}
                      subgraphData={item.subgraphData}
                      serviceFee={item.serviceFee}
                    />
                  </Td>
                </Tr>
              );
            })}
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
                <Flex h={"17px"} mb={"14px"}>
                  <GradientSpinner />
                </Flex>
                <Flex h={"17px"} mb={"32px"}>
                  <GradientSpinner />
                </Flex>
                <Flex h={"17px"} mb={"14px"}>
                  <GradientSpinner />
                </Flex>
                <Flex h={"17px"} mb={"122px"}>
                  <GradientSpinner />
                </Flex>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
