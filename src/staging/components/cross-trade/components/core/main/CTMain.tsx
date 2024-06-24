import React, { useEffect, useState, useCallback } from "react";
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
import { Tooltip } from "@/staging/components/common/Tooltip";
import Image from "next/image";
import GasStationSymbol from "assets/icons/confirm/gas-station.svg";
import Polygon from "assets/icons/ct/polygon.svg";
import { useAccount } from "wagmi";
import {
  STATUS,
  getStatus,
} from "@/staging/components/cross-trade/utils/getStatus";

{
  /** 
    If the requester is the same as the current user's address, do not show the request in the list.
    When someone makes a new request, the request is initially disabled.
    After a 15-minute countdown, the request becomes active and the 'Provide' button is enabled.
    by Monica
  */
}
export default function CTMain() {
  const LIMIT = 10;
  const [data, setData] = useState<CrossTradeData[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/crossTrade?limit=${LIMIT}&offset=${offset}&address=${address}`
      );
      const newData: CrossTradeData[] = await response.json();
      setData((prevData) => [...prevData, ...newData]);
      setOffset((prevOffset) => prevOffset + LIMIT);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  }, [offset]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading
    ) {
      fetchData();
    }
  }, [loading, fetchData]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Box
      w='100%'
      h='100%'
      borderRadius={"16px"}
      border={"1px solid #313442"}
      overflow='hidden'
    >
      <Table variant={"unstyled"} w='100%' h='100%'>
        <Thead>
          <Tr
            sx={{
              "& th": { pl: "20px", py: "10px", pr: "auto" },
              borderBottom: "1px solid #23242B",
            }}
          >
            <Th textTransform='none'>
              <Flex alignItems='center'>
                <Flex justifyContent={"center"} alignItems={"center"}>
                  <Image src={Polygon} alt={"Polygon"} />
                </Flex>
                <Text
                  ml='4px'
                  fontWeight={"500"}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#FFFFFF"}
                >
                  Provide
                </Text>
                <Tooltip
                  tooltipLabel={"text will be changed"}
                  style={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform='none'>
              <Flex alignItems='center'>
                <Text
                  fontWeight={"500"}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  Receive
                </Text>
                <Tooltip
                  tooltipLabel={"text will be changed"}
                  style={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform='none'>
              <Flex justifyContent={"center"}>
                <Text
                  fontWeight={"500"}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  Profit (%)
                </Text>
              </Flex>
            </Th>
            <Th textTransform='none'>
              <Flex>
                <Flex
                  w={"16px"}
                  h={"16px"}
                  mr={"4px"}
                  px={"0.88px"}
                  py={"1px"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
                </Flex>
                <Text
                  fontWeight={"500"}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  $8.43
                </Text>
              </Flex>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => {
            const status = getStatus(item);
            const rowOpacity = status === STATUS.COUNTDOWN ? 0.3 : 1;

            return (
              <Tr
                key={index}
                sx={{
                  "& td": { pl: "20px", py: "16px", pr: "auto" },
                  borderBottom: "1px solid #23242B",
                }}
              >
                <Td sx={{ opacity: rowOpacity }}>
                  <TokenDetail token={item.inToken} network={item.inNetwork} />
                </Td>
                <Td sx={{ opacity: rowOpacity }}>
                  <TokenDetail
                    token={item.outToken}
                    network={item.outNetwork}
                  />
                </Td>
                <Td sx={{ opacity: rowOpacity }}>
                  <TokenDetail profit={item.profit} />
                </Td>
                <Td>
                  <CTProvider
                    status={status}
                    blockTimestamps={item.blockTimestamps}
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
