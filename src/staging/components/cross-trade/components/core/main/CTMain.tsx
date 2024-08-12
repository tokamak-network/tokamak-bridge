import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  const [isSortedDescending, setIsSortedDescending] = useState<boolean | null>(
    null
  );
  const { requestList, isLoading } = useRequestData();
  const [data, setData] = useState<CrossTradeData[]>([]);

  useEffect(() => {
    if (requestList) {
      setData(requestList);
    }
  }, [requestList]);

  useEffect(() => {
    if (isSortedDescending === null) return;
    if (isSortedDescending) {
      return setData((prevData) => [
        ...prevData.sort((a, b) => b.providingUSD - a.providingUSD),
      ]);
    }
    if (!isSortedDescending) {
      return setData((prevData) => [
        ...prevData.sort((a, b) => a.providingUSD - b.providingUSD),
      ]);
    }
  }, [isSortedDescending]);

  return (
    <Box
      w="100%"
      h="100%"
      borderRadius={"16px"}
      border={"1px solid #313442"}
      overflow="hidden"
    >
      <Table variant={"unstyled"} w="100%" h="100%">
        <Thead>
          <Tr
            sx={{
              "& th": { pl: "20px", py: "10px", pr: "auto" },
              borderBottom: "1px solid #23242B",
              letterSpacing: 0,
            }}
          >
            <Th textTransform="none">
              <Flex
                alignItems="center"
                cursor={"pointer"}
                onClick={() =>
                  setIsSortedDescending(
                    isSortedDescending !== null ? !isSortedDescending : true
                  )
                }
              >
                {isSortedDescending !== null && (
                  <Flex
                    justifyContent={"center"}
                    alignItems={"center"}
                    style={{
                      transform: isSortedDescending
                        ? "rotate(360deg)"
                        : "rotate(180deg)",
                    }}
                  >
                    <Image src={Polygon} alt={"Polygon"} />
                  </Flex>
                )}
                <Text
                  ml="4px"
                  fontWeight={"500"}
                  fontSize={"13px"}
                  lineHeight={"18px"}
                  color={"#FFFFFF"}
                  letterSpacing={0}
                >
                  Provide
                </Text>
                <Tooltip
                  tooltipLabel={"Total amount to pay."}
                  style={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none">
              <Flex alignItems="center">
                <Text
                  fontWeight={"500"}
                  fontSize={"13px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                  letterSpacing={0}
                >
                  Receive
                </Text>
                <Tooltip
                  tooltipLabel={
                    "Total amount to receive, including the service fee. It takes at least 2~5 minutes to receive (depending on the L2 sequencer)."
                  }
                  style={{ marginLeft: "2px" }}
                />
              </Flex>
            </Th>
            <Th textTransform="none">
              <Flex ml={"9px"}>
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
          {data?.map((item, index) => {
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
                    crossTradeData={item}
                    subgraphData={item.subgraphData}
                    serviceFee={item.serviceFee}
                  />
                </Td>
              </Tr>
            );
          })}
          {!isLoading && data.length === 0 && (
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
        </Tbody>
      </Table>
    </Box>
  );
}
