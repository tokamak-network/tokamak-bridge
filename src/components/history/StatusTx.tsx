import { Flex, Text, Link } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Calendar from "assets/icons/Google_Calendar_icon.svg";
import { confirmWithdraw } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { atcb_action } from "add-to-calendar-button";
import { format, fromUnixTime } from "date-fns";
import useConnectedNetwork from "@/hooks/network";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import {
  add,
  getTime,
  getUnixTime,
  intervalToDuration,
  Duration,
  subMinutes
} from "date-fns";

export default function StatusTx(props: {
  completed: boolean;
  date: number;
  layer: string;
  txHash: string;
  timeStamp?: number;
  tx:any;
}) {
  const { completed, date, layer, txHash, timeStamp, tx } = props;
  const providers = useGetTxLayers();
  const [duration, setDuration] = useState<Duration>({
    days: 0,
    hours: 0,
    minutes: 0,
    months: 0,
    seconds: 0,
    years: 0,
  });  
  const [withdraw, setWithdraw] = useRecoilState(confirmWithdraw);

  
  const getCalendarEvent = useMemo(()=> {
    if (timeStamp) {
      const endDate = new Date(timeStamp * 1000)
      const formattedDate = format(endDate, 'yyyy-MM-dd');
      const sub30Minutes   =  subMinutes(endDate, 30);
      const startTime = format(sub30Minutes, 'HH:mm')
      const endTime = format(endDate,'HH:mm')
      return {
        formattedDate:formattedDate,
        startTime:startTime,
        endTime:endTime
      }
    }
   
  },[timeStamp])
  

  // todo: should be adjusted for the browser's timezone
  const config: Object = {
    name: "Claim Tokens on L1",
    description:
      "Claim Tokens on L1",
    startDate: getCalendarEvent?.formattedDate,
    startTime: getCalendarEvent?.startTime,
    endTime:getCalendarEvent?.endTime,
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


  useEffect(() => {
    if (timeStamp) {
      const intervalID = setInterval(() => {
        const nowTime = getUnixTime(new Date());
        // setDuration(
        //   intervalToDuration({
        //     start: getTime(timeStamp * 1000),
        //     end: getTime(nowTime * 1000),
        //   })
        // );
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
          bg={tx.currentStatus === 6 ||(layer === 'L2' && tx.l2txHash)? "#03D187" : "#8497DB"}
          mr="6px"
        ></Flex>
       { tx.currentStatus === 6  || (layer === 'L2' && tx.l2txHash) ? (
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
            style={{ textDecoration: "none" }}
          >
            {`${layer}: Completed`}
          </Link>
        ) : tx.currentStatus === 5?  (
          <Text
            fontSize={"11px"}
            cursor={"pointer"}
            fontWeight={600}
            onClick={() => !completed && setWithdraw({isOpen: true, modalData:{
             tx

            }})}
          >{`${layer}: Ready to be claimed`}</Text>
        ):tx.currentStatus === 4?  (
          <Text
            fontSize={"11px"}
            cursor={"pointer"}
            fontWeight={600}
            onClick={() => !completed && setWithdraw({isOpen: true, modalData:{
             tx

            }})}
          >{`${layer}: Wait 7 days`}</Text>
        ): (
          <Text
            fontSize={"11px"}
            cursor={"pointer"}
            fontWeight={600}
            onClick={() => !completed && setWithdraw({isOpen: true, modalData:{
             tx

            }})}
          >{`${layer}: Wait ~5 min for rollup`}</Text>
        )}
      </Flex>
      {tx.currentStatus === 6 ||(layer === 'L2' && tx.l2txHash) ? (
        <Flex fontSize={"11px"}>
          <Text>{format(fromUnixTime(date), "yyyy.MM.dd")}</Text>
          <Text ml="3px" color={"#A0A3AD"}>
            {format(fromUnixTime(date), "hh:mm b (z)")}
          </Text>
        </Flex>
      ) : tx.currentStatus === 4 ?(
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
            cursor={"pointer"}
          >
            <Image src={Calendar} alt="google calendar" />
          </Flex>
        </Flex>
      ): <></>}
    </Flex>
  );
}
