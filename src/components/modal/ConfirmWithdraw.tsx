import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";

import Image from "next/image";
import { useMemo } from "react";
import { format, addHours } from "date-fns";
import useCallClaim from "@/hooks/user/actions/useCallClaim";
import { claimTx } from "@/recoil/userHistory/claimTx";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import useConnectedNetwork from "@/hooks/network";
import { txDataStatus } from "@/recoil/global/transaction";
import { confirmWithdrawData, confirmWithdrawStats } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import TimelineComponent from "../history/modalComponents/TimelineComponent";
import TitanContainer from "./TitanContainer";
import EthereumContainer from "./EthereumContainer";
import CalendarComponent from "../history/modalComponents/CalendarComponent";
import CloseButton from "../button/CloseButton";

import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import ARROW from "assets/icons/arrow.svg";
import "./CalendarButton.css";

export default function ConfirmWithdraw() {
  const [withdrawData, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const [withdrawStatus, setWithdrawStatus] =
    useRecoilState(confirmWithdrawStats);

  const [, setClaimTx] = useRecoilState(claimTx);
  const tx = withdrawData.modalData;
  const { onClick } = useCallBridgeSwapAction();
  const { claim } = useCallClaim("relayMessage");
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const [txData] = useRecoilState(txDataStatus);

  const { mobileView } = useMediaView();

  const getCalendarEvent = useMemo(() => {
    if (tx && tx.l2timeStamp) {
      const timeStamp = tx.l2timeStamp;
      const status4Duration = isConnectedToMainNetwork ? 605400 : 610; //7 days challenge period on mainnet +  5 minutes rollup
      const status4EndTimestamp = Number(timeStamp) + status4Duration;
      const startDate = new Date(status4EndTimestamp * 1000);

      const formattedDate = format(startDate, "yyyy-MM-dd");
      const add1Hour = addHours(startDate, 1);
      const startTime = format(startDate, "HH:mm");
      const formattedEndTime = format(add1Hour, "HH:mm");
      return {
        formattedDate: formattedDate,
        startTime: startTime,
        endTime: formattedEndTime,
      };
    }
  }, [tx]);

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

  const CheckContainer = () => {
    const [isConfirm, setIsConfirm] = useRecoilState(confirmWithdrawStatus);

    return (
      <Flex mt={"2px"} columnGap={"12px"} alignItems={"center"}>
        <Checkbox
          w={"16px"}
          h={"16px"}
          mt={"5px"}
          mb={"auto"}
          isChecked={isConfirm}
          borderLeft={0}
          borderWidth={"1px"}
          borderColor={isConfirm ? "#fff" : "#A0A3AD"}
          colorScheme={"#fff"}
          onChange={(e) => {
            const checkValue = e.target.checked;
            setIsConfirm(checkValue);
          }}
        ></Checkbox>
        <Text
          lineHeight={"20px"}
          fontSize={13}
          fontWeight={500}
          color={isConfirm ? "#fff" : "#A0A3AD"}
        >
          I understand that I have to send a transaction on Ethereum to "Claim"
          my withdraw after 7 days.{" "}
        </Text>
      </Flex>
    );
  };

  const ActionButton = () => {
    const isChecked = useRecoilValue(confirmWithdrawStatus);

    return (
      <Button
        h="48px"
        _active={{}}
        _hover={{}}
        color={"#fff"}
        isDisabled={
          txData?.hash?.transactionHash !== undefined &&
          txData?.hash.txSort === "Claim"
            ? true
            : !tx && isChecked
            ? false
            : tx?.currentStatus !== 5
        }
        _disabled={{ color: "#8E8E92", bg: "#17181D" }}
        bg="#007AFF"
        onClick={
          !tx
            ? () => {
                onClick();
                setWithdrawStatus({ isOpen: false });
                setWithdrawData({
                  modalData: null,
                });
              }
            : () => {
                setClaimTx(tx);
                claim(tx);
              }
        }
      >
        {tx ? "Claim" : "Initiate"}
      </Button>
    );
  };

  return (
    <Modal
      isOpen={withdrawStatus.isOpen}
      onClose={() => {
        // setClaimTx(null)
        setWithdrawStatus({
          isOpen: false,
        });
        setWithdrawData({
          modalData: null,
        });
      }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        w={{ base: "full", lg: "404px" }}
        justifyContent={"center"}
        alignItems={"center"}
        borderRadius={{ base: "16px 16px 0px 0px", lg: "16px" }}
        bgColor={"#1f2128"}
        mb={{ base: "0", lg: "auto" }}
      >
        <Flex
          w={"100%"}
          h={"100%"}
          flexDir={"column"}
          p={{ base: "16px 12px", lg: "20px" }}
          rowGap={"16px"}
        >
          <Flex>
            <Text fontSize={{ base: 16, lg: 20 }} fontWeight={500} w="100%">
              Confirm Withdraw
            </Text>
            <Flex w={"100%"} justifyContent={"flex-end"}>
              <CloseButton
                onClick={() => {
                  // setClaimTx(null)
                  setWithdrawStatus({
                    isOpen: false,
                  });
                  setWithdrawData({
                    modalData: null,
                  });
                }}
              />
            </Flex>
          </Flex>
          <Flex alignItems={"center"} columnGap={{ base: "8px", lg: "0px" }}>
            <TitanContainer tx={tx} />

            {mobileView ? (
              <Image width={24} height={24} src={ARROW} alt={"ARROW"} />
            ) : (
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
            )}

            <EthereumContainer />
          </Flex>
          <TimelineComponent tx={tx} />
          {!tx ? (
            <CheckContainer />
          ) : tx.currentStatus >= 2 && tx.currentStatus < 5 ? (
            <CalendarComponent config={config} />
          ) : null}
          <ActionButton />
        </Flex>
      </ModalContent>
    </Modal>
  );
}
