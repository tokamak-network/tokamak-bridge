import { Flex, Text, Link } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { format, fromUnixTime } from "date-fns";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import { FullWithTx } from "@/types/activity/history";

import { differenceInSeconds } from "date-fns";
import useMediaView from "@/hooks/mediaView/useMediaView";

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
  const { mobileView } = useMediaView();

  //calculates the duration of the relay time
  useEffect(() => {
    if (tx.l1timeStamp) {
      const getDuration = setInterval(() => {
        const startDate = new Date(Number(tx.l1timeStamp) * 1000);
        const currentTime = new Date(Date.now());
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
          mr="6px"
        ></Flex>
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
            _hover={{
              textDecoration: mobileView ? "none" : "underline"
            }}
          >
            {mobileView ? "Deposited" : `${layer}: Completed`}
          </Link>
        ) : mobileView ? (
          <Link
            target="_blank"
            href={`${providers.l1BlockExplorer}/tx/${tx.l1txHash}`}
            fontSize={"11px"}
            fontWeight={600}
            style={{ textDecoration: "none" }}
          >
            {"Wait for L2"}
          </Link>
        ) : (
          <Text fontSize={"11px"} fontWeight={600}>
            {`${layer}: Wait ~5 min for relay`}
          </Text>
        )}
      </Flex>
      {completed ? (
        mobileView ? (
          <Link
            target="_blank"
            href={`${providers.l2BlockExplorer}/tx/${txHash}`}
            style={{ textDecoration: "none" }}
          >
            <Flex fontSize={"11px"}>
              <Text color={mobileView ? "#A0A3AD" : "#FFFFFF"}>
                {format(fromUnixTime(date), "yyyy.MM.dd")}
              </Text>
              {!mobileView && (
                <Text ml="3px" color={"#A0A3AD"}>
                  {format(fromUnixTime(date), "hh:mm b (z)")}
                </Text>
              )}
            </Flex>
          </Link>
        ) : (
          <Flex fontSize={"11px"}>
            <Text color={mobileView ? "#A0A3AD" : "#FFFFFF"}>
              {format(fromUnixTime(date), "yyyy.MM.dd")}
            </Text>
            {!mobileView && (
              <Text ml="3px" color={"#A0A3AD"}>
                {format(fromUnixTime(date), "hh:mm b (z)")}
              </Text>
            )}
          </Flex>
        )
      ) : mobileView ? (
        <Link
          target="_blank"
          href={`${providers.l1BlockExplorer}/tx/${tx.l1txHash}`}
          style={{ textDecoration: "none" }}
        >
          <Text mr="6px" fontSize={"12px"} color={"#8497DB"}>
            {duration}
          </Text>
        </Link>
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
