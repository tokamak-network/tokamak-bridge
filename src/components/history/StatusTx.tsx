import { Flex, Text, Link } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Calendar from "assets/icons/Google_Calendar_icon.svg";
import { confirmWithdrawStats, confirmWithdrawData } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { atcb_action } from "add-to-calendar-button";
import { format, fromUnixTime } from "date-fns";
import useConnectedNetwork from "@/hooks/network";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import { claimTx } from "@/recoil/userHistory/claimTx";
import { FullDepTx, FullWithTx } from "@/types/activity/history";
import {
  add,
  getTime,
  getUnixTime,
  intervalToDuration,
  Duration,
  subMinutes,
  addHours,
  differenceInSeconds,
} from "date-fns";

// type TokenData = {
//   token0Symbol: string;
//   token1Symbol: string;
//   token0Name: string;
//   token1Name: string;
//   token0Decimals: number;
//   token1Decimals: number;
// };

type TxType = FullWithTx & {
  inTokenSymbol: string | undefined;
  outTokenSymbol: string | undefined;
  inTokenAmount: string;
};

export default function StatusTx(props: {
  completed: boolean;
  date: number;
  layer: string;
  txHash: string;
  timeStamp?: number;
  tx: TxType;
}) {
  const { completed, date, layer, txHash, timeStamp, tx } = props;
  const providers = useGetTxLayers();
  const [durationRollup, setDurationRollup] = useState("0");

  const [duration, setDuration] = useState<Duration>({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });
  const [withdrawData, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const [withdrawStatus, setWithdrawStatus] =
    useRecoilState(confirmWithdrawStats);
  const [, setClaimTx] = useRecoilState(claimTx);
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  //creates the calendar event start time, end time, and even date
  const getCalendarEvent = useMemo(() => {
    if (tx.l2timeStamp) {
      const timeStamp = tx.l2timeStamp;

      //605400 === 7 days +10 minutes of rollup & challenge period => mainnet
      //610 === 10 minutes  and 10 seconds of rollup & challenge period => testnet
      const status4Duration = isConnectedToMainNetwork ? 605400 : 610;
      const status4EndTimestamp = Number(timeStamp) + status4Duration;
      const startDate = new Date(status4EndTimestamp * 1000);

      const formattedDate = format(startDate, "yyyy-MM-dd");
      const add1Hour = addHours(startDate, 1); //even duration is 1 hour
      const startTime = format(startDate, "HH:mm");
      const formattedEndTime = format(add1Hour, "HH:mm");

      return {
        formattedDate: formattedDate,
        startTime: startTime,
        endTime: formattedEndTime,
      };
    }
  }, [tx.l2timeStamp]);

  //creates the count up clock for the rollup period
  useEffect(() => {
    if (tx.l2timeStamp) {
      const getDuration = setInterval(() => {
        const startDate = new Date(Number(tx.l2timeStamp) * 1000);
        const currentTime = new Date();
        const elapsedTimeInSeconds = differenceInSeconds(
          currentTime,
          startDate
        );
        const formattedTime = format(
          new Date(elapsedTimeInSeconds * 1000),
          "mm:ss"
        );
        setDurationRollup(formattedTime);
      }, 1000);
      return () => clearInterval(getDuration);
    }
  }, [tx.l2timeStamp]);

 //creates the calendar config. 
  const config: Object = {
    name: "Claim withdrawal on Ethereum network using Tokamak Bridge",
    description:
      "How to claim:\n1. Go to Tokamak Bridge (https://bridge.tokamak.network/) \n2. Connect to your wallet \n3. Click the wallet address on the top right  \n4. Find the relevant claim transaction and click “Claim”  ",
    startDate: getCalendarEvent?.formattedDate,
    startTime: getCalendarEvent?.startTime,
    endTime: getCalendarEvent?.endTime,
    options: ["Google"],
    timeZone: "currentBrowser",
  };

  /**
   * Message is an L1 to L2 message and has not been processed by the L2.
   */
  // UNCONFIRMED_L1_TO_L2_MESSAGE,  ==> 0

  /**
   * Message is an L1 to L2 message and the transaction to execute the message failed.
   * When this status is returned, you will need to resend the L1 to L2 message, probably with a
   * higher gas limit.
   */
  //  FAILED_L1_TO_L2_MESSAGE, ===> 1

  /**
   * Message is an L2 to L1 message and no state root has been published yet.
   */
  //  STATE_ROOT_NOT_PUBLISHED, ===> 2

  /**
   * Message is ready to be proved on L1 to initiate the challenge period.
   */
  //  READY_TO_PROVE, ===>3

  /**
   * Message is a proved L2 to L1 message and is undergoing the challenge period.
   */
  //  IN_CHALLENGE_PERIOD,   ===> 4

  /**
   * Message is ready to be relayed.
   */
  //  READY_FOR_RELAY,   ===> 5

  /**
   * Message has been relayed.
   */
  //  RELAYED, ===> 6


  //create the count up duration for the challenge period
  useEffect(() => {
    if (timeStamp !== undefined && !isNaN(timeStamp)) {
      const intervalID = setInterval(() => {
        const nowTime = getUnixTime(new Date());
        if (nowTime > timeStamp) {
          setDuration({
            days: 0,
            hours: 0,
            minutes: 0,
            months: 0,
            seconds: 0,
            years: 0,
          });
        } else {
          setDuration(
            intervalToDuration({
              start: getTime(timeStamp * 1000),
              end: getTime(nowTime * 1000),
            })
          );
        }
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [timeStamp]);

  return (
    <Flex justifyContent={"space-between"} h="18px" alignItems={"center"}>
      <Flex alignItems={"center"}>
        <Flex
          h="6px"
          w="6px"
          borderRadius={"50%"}
          bg={
            tx.currentStatus === 6 || (layer === "L2" && tx.l2txHash)
              ? "#03D187"
              : tx.currentStatus === 5
              ? "#007AFF"
              : "#8497DB"
          }
          mr="6px"></Flex>
        {tx.currentStatus === 6 || (layer === "L2" && tx.l2txHash) ? (
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
        ) : tx.currentStatus === 5 ? (
          <Text
            fontSize={"11px"}
            cursor={"pointer"}
            fontWeight={600}
            onClick={
              !completed
                ? () => {
                    setClaimTx(tx);
                    setWithdrawStatus({
                      isOpen: true,
                    });
                    setWithdrawData({ modalData: tx });
                  }
                : undefined
            }>{`${layer}: Ready to be claimed`}</Text>
        ) : tx.currentStatus === 4 ? (
          <Text
            fontSize={"11px"}
            cursor={"pointer"}
            fontWeight={600}
            onClick={
              !completed
                ? () => {
                    setClaimTx(tx);
                    setWithdrawStatus({
                      isOpen: true,
                    });
                    setWithdrawData({ modalData: tx });
                  }
                : undefined
            }>{`${layer}: Wait 7 days`}</Text>
        ) : (
          <Text
            fontSize={"11px"}
            cursor={"pointer"}
            fontWeight={600}
            onClick={
              !completed
                ? () => {
                    setClaimTx(tx);
                    setWithdrawStatus({
                      isOpen: true,
                    });
                    setWithdrawData({ modalData: tx });
                  }
                : undefined
            }>{`${layer}: Wait ~${
            isConnectedToMainNetwork ? "11" : "2"
          } min for rollup`}</Text>
        )}
      </Flex>
      {tx.currentStatus === 6 || (layer === "L2" && tx.l2txHash) ? (
        <Flex fontSize={"11px"}>
          <Text>{format(fromUnixTime(date), "yyyy.MM.dd")}</Text>
          <Text ml="3px" color={"#A0A3AD"}>
            {format(fromUnixTime(date), "hh:mm b (z)")}
          </Text>
        </Flex>
      ) : tx.currentStatus === 4 ? (
        <Flex>
          <Text fontSize={"12px"} color={"#8497DB"}>
            {duration.days !== undefined && duration.days < 10 ? "0" : ""}
            {duration.days}:
            {duration.hours !== undefined && duration.hours < 10 ? "0" : ""}
            {duration.hours}:
            {duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
            {duration.minutes}:
            {duration.seconds !== undefined && duration.seconds < 10 ? "0" : ""}
            {duration.seconds} Left
          </Text>
          <Flex
            ml={"5px"}
            onClick={() => atcb_action(config)}
            cursor={"pointer"}>
            <Image src={Calendar} alt="google calendar" />
          </Flex>
        </Flex>
      ) : tx.currentStatus === 2 ? (
        <Flex>
          <Text mr="6px" fontSize={"12px"} color={"#8497DB"}>
            {durationRollup}
          </Text>
          <Flex
            ml={"5px"}
            onClick={() => atcb_action(config)}
            cursor={"pointer"}>
            <Image src={Calendar} alt="google calendar" />
          </Flex>
        </Flex>
      ) : (
        <></>
      )}
    </Flex>
  );
}
