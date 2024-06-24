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
  Button,
} from "@chakra-ui/react";
import { Token, Profit, CrossTradeData } from "@/staging/types/crossTrade";
import TokenDetail from "@/staging/components/cross-trade/components/core/main/TokenDetail";
import { Tooltip } from "@/staging/components/common/Tooltip";
import Image from "next/image";
import GasStationSymbol from "assets/icons/confirm/gas-station.svg";

export default function CTMain() {
  const LIMIT = 10;
  const [data, setData] = useState<CrossTradeData[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/crossTrade?limit=${LIMIT}&offset=${offset}`
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
              <Flex>
                <Text
                  fontWeight={"500"}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#FFFFFF"}
                >
                  Provide
                </Text>
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
              <Flex>
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
          {data.map((item, index) => (
            <Tr
              key={index}
              sx={{
                "& td": { pl: "20px", py: "16px", pr: "auto" },
                borderBottom: "1px solid #23242B",
              }}
            >
              <Td>
                <TokenDetail
                  amount={item.inToken.amount}
                  symbol={item.inToken.symbol}
                  detail={item.inToken.amountUSD}
                  network={item.inNetwork}
                />
              </Td>
              <Td>
                <TokenDetail
                  amount={item.outToken.amount}
                  symbol={item.outToken.symbol}
                  detail={item.outToken.amountUSD}
                  network={item.outNetwork}
                />
              </Td>
              <Td>
                <TokenDetail
                  amount={item.profit.amount}
                  symbol={item.inToken.symbol}
                  detail={item.profit.percent}
                />
                {/* <Box ml='10px'>
                  <Flex alignItems={"center"}>
                    <Text
                      fontWeight={500}
                      fontSize={"14px"}
                      lineHeight={"21px"}
                      color={"#FFFFFF"}
                    >
                      {item.profit.percent}
                    </Text>
                    <Text
                      ml={"4px"}
                      fontWeight={400}
                      fontSize={"14px"}
                      lineHeight={"21px"}
                      color={"#A0A3AD"}
                    >
                      %
                    </Text>
                  </Flex>
                  <Flex alignItems={"center"}>
                    <Text
                      fontWeight={400}
                      fontSize={"9px"}
                      lineHeight={"13.5px"}
                      color={"#A0A3AD"}
                    >
                      (
                    </Text>
                    <Text
                      fontWeight={400}
                      fontSize={"11px"}
                      lineHeight={"16.5px"}
                      color={"#A0A3AD"}
                    >
                      {item.profit.amount} {item.profit.symbol}
                    </Text>
                    <Text
                      fontWeight={400}
                      fontSize={"9px"}
                      lineHeight={"13.5px"}
                      color={"#A0A3AD"}
                    >
                      )
                    </Text>
                  </Flex>
                </Box> */}
              </Td>
              <Td>
                <Button
                  w={"64px"}
                  h={"28px"}
                  px={"10px"}
                  py={"5px"}
                  justifyContent={"center"}
                  gap={"8px"}
                  flexShrink={0}
                  borderRadius={"6px"}
                  bg={"#007AFF"}
                  _active={{}}
                  _hover={{}}
                  _focus={{}}
                >
                  <Text
                    fontWeight={600}
                    fontSize={"11px"}
                    lineHeight={"16.5px"}
                  >
                    Provide
                  </Text>
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
