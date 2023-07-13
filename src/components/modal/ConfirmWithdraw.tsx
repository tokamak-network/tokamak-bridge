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
import { AddToCalendarButton } from "add-to-calendar-button-react";

export default function ConfirmWithdraw() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalOpen, setModalOpen] = useRecoilState(confirmWithdraw);

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
            tokenSymbol={"ETH"}
            chainId={5050}
            symbolW={56}
            symbolH={56}
            networkSymbolH={20}
            networkSymbolW={20}
          />
        </Flex>
        <Text h="24px" mt={"14px"} fontSize={"18px"} fontWeight={600}>
          2.761213... ETH
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
        <Image src={ETH} alt="ETH" height={40} width={40} />
        <Text fontSize={"16px"} mt="12px">
          ETHEREUM
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

  const Step3 = (props: { progress: string }) => {
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
            84 : 00 : 00 Left
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

  const TimelineComponent = () => {
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
        <Step2 progress="done" />
        <Dots progress="done" />
        <Step3 progress="inProgress" />
        <Dots progress="inProgress" />
        <Step4 progress="todo" />
      </Flex>
    );
  };

  const calStyle = `
   .atcb-initialized {

    .atcb-button-wrapper{
        height:16px;
        width:16px;
        padding:0px
.atcb-button { 

    background-color: transparent;
    }
   }
  `;
  const CalendarComponent = () => {
    return (
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        w="100%"
        h="70px"
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
          {/* <Flex id="my-default-button">
            <Image src={CalendarIcon} alt="calendar" />
          </Flex> */}
          <style>{calStyle}</style>
          <AddToCalendarButton
            name="[Reminder] Test the Add to Calendar Button"
            startDate="2023-07-13"
            startTime="10:15"
            endTime="23:30"
            timeZone="currentBrowser"
            description="Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/"
            options="'Google'"
            buttonsList
            hideTextLabelButton
            buttonStyle="default"
            customCss="https://github.com/tokamak-network/Unified-interface/blob/origin/feat/txHistory/src/components/modal/CalendarButton.css"
            lightMode="bodyScheme"
          ></AddToCalendarButton>
        </Flex>
      </Flex>
    );
  };
  return (
    <Modal isOpen={modalOpen} onClose={onClose} isCentered>
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
              <CloseButton onClick={() => setModalOpen(false)} />
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
          <TimelineComponent />
          <CalendarComponent />
          <Button
            h="48px"
            _disabled={{ color: "#8E8E92", bg: "#17181D" }}
            bg="#007AFF"
          >
            Claim Withdraw
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
