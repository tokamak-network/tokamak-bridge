import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Box,
  Text,
  Link,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { confirmWithdraw } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import CloseButton from "../button/CloseButton";
import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import Image from "next/image";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import ETH from "assets/tokens/ETH2.svg";
import GasImgTodo from "assets/icons/gasStation.svg";
import GasImgDone from "assets/icons/gasStation_done.svg";
import GasImgProgress from "assets/icons/gasStation_progress.svg";
import checkDone from "assets/icons/check_done.svg";
import checkProgress from "assets/icons/check_progress.svg";
import checkTodo from "assets/icons/check_todo.svg";
import CalendarIcon from "assets/icons/Google_Calendar_icon.svg";
import "./CalendarButton.css";
import { atcb_action } from "add-to-calendar-button";
import { TokenSymbol } from "../image/TokenSymbol";
import { useState, useEffect, useMemo } from "react";
import {
  add,
  getTime,
  getUnixTime,
  intervalToDuration,
  Duration,
  format,
  subMinutes,
} from "date-fns";
import useCallClaim from "@/hooks/user/actions/useCallClaim";
import { claimTx } from "@/recoil/userHistory/claimTx";

export default function ConfirmWithdraw() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [withdraw, setWithdraw] = useRecoilState(confirmWithdraw);
  const [,setClaimTx] = useRecoilState(claimTx)
  const tx = withdraw.modalData?.tx;

  const { claim } = useCallClaim('relayMessage');
  const check = (progress: string) => {
    switch (progress) {
      case "inProgress":
        return { check: checkProgress, color: "#FFF", gas: GasImgProgress };
      case "done":
        return { check: checkDone, color: "#007AFF", gas: GasImgDone };

      case "todo":
        return { check: checkTodo, color: "#A0A3AD", gas: GasImgTodo };
      default:
        return { check: checkTodo, color: "#A0A3AD", gas: GasImgTodo };
    }
  };

  const TitanContainer = () => {
    return (
      <Flex
        bg="transparent"
        w="176px"
        pt="30px"
        pb={"24px"}
        // justifyContent={"center"}
        h="172px"
        border={"1px solid #313442"}
        borderRadius={"12px"}
        flexDir={"column"}
        alignItems={"center"}
      >
        <Flex w="56px" h="56px">
          <TokenSymbolWithNetwork
            tokenSymbol={tx?.inTokenSymbol || "ETH"}
            chainId={5050}
            symbolW={56}
            symbolH={56}
            networkSymbolH={20}
            networkSymbolW={20}
          />
        </Flex>
        <Text h="24px" mt={"14px"} fontSize={"18px"} fontWeight={600}>
          {tx.inTokenAmount} {tx?.inTokenSymbol || "ETH"}
        </Text>
        <Text
          h="21px"
          mt={"3px"}
          fontSize={"14px"}
          fontWeight={600}
          color={"#A0A3AD"}
        >
          $0.22
        </Text>
      </Flex>
    );
  };
  const EthereumContainer = () => {
    return (
      <Flex
        bg="#0F0F12"
        w="176px"
        h="172px"
        border={"1px solid #313442"}
        borderRadius={"12px"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {/* <Image src={ETH} alt="ETH" height={40} width={40} /> */}
        <TokenSymbol tokenType={tx?.inTokenSymbol as string} w={40} h={40} />
        <Text fontSize={"16px"} mt="12px">
          {tx?.outTokenSymbol || "ETH"}
        </Text>
      </Flex>
    );
  };

  const Step1 = (props: { progress: string }) => {
    return (
      <Flex
        h="36px"
        justifyContent={"space-between"}
        alignItems={"center"}
        // border={"1px solid red"}
        w="100%"
      >
        <Flex>
          <Image src={check(props.progress).check} alt="check" />
          <Text ml="8px" fontSize={"14px"} color={check(props.progress).color}>
            Initiate withdraw
          </Text>
        </Flex>
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check(props.progress).color}>
            {" "}
            ~ $3.18
          </Text>
          <Image src={check(props.progress).gas} alt="gas station" />
        </Flex>
      </Flex>
    );
  };

  const Step2 = (props: { progress: string }) => {
    return (
      <Flex
        h="36px"
        justifyContent={"space-between"}
        alignItems={"center"}
        // border={"1px solid red"}
        w="100%"
      >
        <Flex>
          <Image src={check(props.progress).check} alt="check" />
          <Text ml="8px" fontSize={"14px"} color={check(props.progress).color}>
            Wait ~5 min for rollup
          </Text>
        </Flex>
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check(props.progress).color}>
            {" "}
            ~5 min
          </Text>
        </Flex>
      </Flex>
    );
  };

  const Step3 = (props: { progress: string; timeStamp: number }) => {
    const [duration, setDuration] = useState<Duration>({
      days: 0,
      hours: 0,
      minutes: 0,
      months: 0,
      seconds: 0,
      years: 0,
    });

    useEffect(() => {
      if (props.timeStamp) {
        const intervalID = setInterval(() => {
          const nowTime = getUnixTime(new Date());
          
          
          if (nowTime > props.timeStamp) {
            console.log('nowTime',nowTime,props.timeStamp);
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
                start: getTime(props.timeStamp * 1000),
                end: getTime(nowTime * 1000),
              })
            );
          }
        }, 1000);
        return () => clearInterval(intervalID);
      }
    }, [props.timeStamp]);

    return (
      <Flex
        h="36px"
        justifyContent={"space-between"}
        alignItems={"center"}
        // border={"1px solid red"}
        w="100%"
      >
        <Flex>
          <Image src={check(props.progress).check} alt="check" />
          <Text ml="8px" fontSize={"14px"} color={check(props.progress).color}>
            Wait 7 days
          </Text>
        </Flex>
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check(props.progress).color}>
            {" "}
            {duration.days !== undefined && duration.days < 10 ? "0" : ""}
            {duration.days}:
            {duration.hours !== undefined && duration.hours < 10 ? "0" : ""}
            {duration.hours}:
            {duration.minutes !== undefined && duration.minutes < 10 ? "0" : ""}
            {duration.minutes}:
            {duration.seconds !== undefined && duration.seconds < 10 ? "0" : ""}
            {duration.seconds} Left
          </Text>
        </Flex>
      </Flex>
    );
  };

  const Step4 = (props: { progress: string }) => {
    return (
      <Flex
        h="36px"
        justifyContent={"space-between"}
        alignItems={"center"}
        // border={"1px solid red"}
        w="100%"
      >
        <Flex>
          <Image src={check(props.progress).check} alt="check" />
          <Text ml="8px" fontSize={"14px"} color={check(props.progress).color}>
            Claim withdraw
          </Text>
        </Flex>
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check(props.progress).color}>
            {" "}
            ~ $3.18
          </Text>
          <Image src={check(props.progress).gas} alt="gas station" />
        </Flex>
      </Flex>
    );
  };

  const Dots = (props: { progress: string }) => {
    return (
      <Flex flexDir={"column"} rowGap={"6px"} pl="6px">
        <Flex bg={check(props.progress).color} height={"2px"} w="2px">
          {" "}
        </Flex>
        <Flex bg={check(props.progress).color} height={"2px"} w="2px">
          {" "}
        </Flex>
        <Flex bg={check(props.progress).color} height={"2px"} w="2px">
          {" "}
        </Flex>
      </Flex>
    );
  };

  const TimelineComponent = (props: { tx: any }) => {

    const nowTime = getUnixTime(new Date());
    return (
      <Flex
        flexDir={"column"}
        bg="#15161D"
        borderRadius={"8px"}
        w="364px"
        h="218px"
        px="12px"
        py="8px"
      >
        <Step1 progress="done" />
        <Dots progress="done" />
        <Step2
          progress={
            props.tx.currentStatus === 2
              ? "inProgress"
              : props.tx.currentStatus > 2
              ? "done"
              : "todo"
          }
        />
        <Dots
          progress={
            props.tx.currentStatus === 2
              ? "inProgress"
              : props.tx.currentStatus > 2
              ? "done"
              : "todo"
          }
        />
        <Step3
          progress={
            props.tx.currentStatus === 4
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
          }
          timeStamp={Number(tx.timeReadyForRelay)}
        />
        <Dots
          progress={
            props.tx.currentStatus === 4
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
          }
        />
        <Step4
          progress={
            props.tx.currentStatus === 5
            ? "inProgress"
            : props.tx.currentStatus > 4
            ? "done"
            : "todo"
          }
        />
      </Flex>
    );
  };
  const getCalendarEvent = useMemo(() => {
    if (tx && tx.timeReadyForRelay) {
      const endDate = new Date(tx.timeReadyForRelay * 1000);
      const formattedDate = format(endDate, "yyyy-MM-dd");
      const sub30Minutes = subMinutes(endDate, 30);
      const startTime = format(sub30Minutes, "HH:mm");
      const endTime = format(endDate, "HH:mm");
      return {
        formattedDate: formattedDate,
        startTime: startTime,
        endTime: endTime,
      };
    }
  }, [tx]);

  const config: Object = {
    name: "Claim Tokens on L1",
    description: "Claim Tokens on L1",
    startDate: getCalendarEvent?.formattedDate,
    startTime: getCalendarEvent?.startTime,
    endTime: getCalendarEvent?.endTime,
    options: ["Google"],
    timeZone: "currentBrowser",
  };

  const CalendarComponent = () => {
    return (
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
        w="100%"
        h="70px"
        onClick={() => atcb_action(config)}
      >
        <Text h="19px" fontSize={"12px"} textAlign={"center"}>
          Set calendar reminder to claim withdraw on Ethereum
        </Text>
        <Flex
          mt="6px"
          w="196px"
          h="36px"
          borderRadius={"8px"}
          border={"1px solid #A0A3AD"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text fontSize={"12px"} mr="8px">
            Add to Google Calendar
          </Text>
          <Flex height={"16px"} w="16px" p="0px">
            <Image src={CalendarIcon} alt="calendar" />
          </Flex>
        </Flex>
      </Flex>
    );
  };


  return (
    <Modal isOpen={withdraw.isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        w="404px"
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={"16px"}
        bgColor={"#1f2128"}
        m={0}
      >
        <Flex w={"100%"} h={"100%"} flexDir={"column"} p="20px" rowGap={"16px"}>
          <Flex>
            <Text fontWeight={500} fontSize={"20px"} w="100%">
              Confirm Withdraw
            </Text>
            <Flex w={"100%"} justifyContent={"flex-end"} mt={"-14px"}>
              <CloseButton
                onClick={() => {
                  // setClaimTx(null)
                  setWithdraw({
                    isOpen: false,
                    modalData: null,
                  })
                }
                 
                }
              />
            </Flex>
          </Flex>
          <Flex alignItems={"center"}>
            <TitanContainer />
            <Flex
              h="32px"
              w="32px"
              borderRadius={"8px"}
              border={"1px solid #313442"}
              justifyContent={"center"}
              alignItems={"center"}
              ml={"-10px"}
              bg={"#1F2128"}
              zIndex={10}
              mr={"-10px"}
            >
              <Image src={ARROW_ICON} alt="ARROW_ICON" />
            </Flex>
            <EthereumContainer />
          </Flex>
          <TimelineComponent tx={tx} />
          <CalendarComponent />
          <Button
            h="48px"
            _active={{}}
            _hover={{}}
            isDisabled={tx?.currentStatus !== 5}
            _disabled={{ color: "#8E8E92", bg: "#17181D" }}
            bg="#007AFF"
            onClick={() => {
              console.log('tx',tx);
              
              setClaimTx(tx)
              return claim(tx);
            }}
          >
            Claim Withdraw
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
