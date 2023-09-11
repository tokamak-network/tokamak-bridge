import { Flex, Text, Link } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Calendar from "assets/icons/Google_Calendar_icon.svg";
import { useRecoilState } from "recoil";
import { atcb_action } from "add-to-calendar-button";
import { format, fromUnixTime } from "date-fns";
import useConnectedNetwork from "@/hooks/network";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import { FullWithTx } from "@/types/activity/history";

import {
  add,
  getTime,
  getUnixTime,
  intervalToDuration,
  Duration,
  subMinutes,
  differenceInSeconds,
} from "date-fns";

export default function DepositStatusTx(props: {
  completed: boolean;
  date: number;
  layer: string;
  txHash: string;
  timeStamp?: number;
  tx: FullWithTx;
}) {
  const { completed, date, layer, txHash, timeStamp, tx } = props;
  const providers = useGetTxLayers();
  const [duration, setDuration] = useState("0");

  useEffect(() => {
    if (tx.l1timeStamp) {
      const getDuration = setInterval(() => {
        const startDate = new Date(Number(tx.l1timeStamp) * 1000);
        const currentTime = new Date();
        const elapsedTimeInSeconds = differenceInSeconds(
          currentTime,
          startDate
        );
        const formattedTime = format(
          new Date(elapsedTimeInSeconds * 1000),
          "mm:ss"
        );
        setDuration(formattedTime);
      }, 1000);
      return () => clearInterval(getDuration);
    }
  }, []);

  // useEffect(() => {
  //   if (props.timeStamp) {
  //     const intervalID = setInterval(() => {
  //       const nowTime = getUnixTime(new Date());

  //       if (nowTime > Number(tx.l1timeStamp)) {
  //         setDuration({
  //           days: 0,
  //           hours: 0,
  //           minutes: 0,
  //           months: 0,
  //           seconds: 0,
  //           years: 0,
  //         });
  //       } else {
  //         setDuration(
  //           intervalToDuration({
  //             start: getTime(Number(tx.l1timeStamp) * 1000),
  //             end: getTime(nowTime * 1000),
  //           })
  //         );
  //       }
  //     }, 1000);
  //     return () => clearInterval(intervalID);
  //   }
  // }, [tx.l1timeStamp]);

  return (
    <Flex justifyContent={"space-between"} h="18px" alignItems={"center"}>
      <Flex alignItems={"center"}>
        <Flex
          h="6px"
          w="6px"
          borderRadius={"50%"}
          bg={completed ? "#03D187" : "#8497DB"}
          mr="6px"></Flex>
        {completed ? (
          <Link
            target="_blank"
            href={`${
              layer === "L1"
                ? providers.l1BlockExplorer
                : providers.l2BlockExplorer
            }/tx/${txHash}`}
            fontSize={"11px"}
            fontWeight={600}
            cursor={"pointer"}
            style={{ textDecoration: "none" }}>
            {`${layer}: Completed`}
          </Link>
        ) : (
          <Text
            fontSize={"11px"}
            fontWeight={600}
            style={{ textDecoration: "none" }}>
            {`${layer}:`} {completed ? "Completed" : " Wait ~5 min for relay"}
          </Text>
        )}
      </Flex>
      {completed ? (
        <Flex fontSize={"11px"}>
          <Text>{format(fromUnixTime(date), "yyyy.MM.dd")}</Text>
          <Text ml="3px" color={"#A0A3AD"}>
            {format(fromUnixTime(date), "hh:mm b (z)")}
          </Text>
        </Flex>
      ) : (
        <Flex>
          <Text mr="6px" fontSize={"12px"} color={"#8497DB"}>
            {duration}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
