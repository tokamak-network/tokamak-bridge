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
  Checkbox,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import CloseButton from "../button/CloseButton";
import ARROW_ICON from "assets/icons/toast/toastArrow.svg";
import ARROW from "assets/icons/arrow.svg";
import Image from "next/image";
import TokenSymbolWithNetwork from "../image/TokenSymbolWithNetwork";
import ETH from "assets/tokens/ETH2.svg";
import ETH_Rounded from "assets/tokens/eth_half_rounded.svg";
import GasImgTodo from "assets/icons/gasStation.svg";
import GasImgDone from "assets/icons/gasStation_done.svg";
import GasImgProgress from "assets/icons/gasStation_progress.svg";
import checkDone from "assets/icons/check_done.svg";
import checkProgress from "assets/icons/check_progress.svg";
import checkTodo from "assets/icons/check_todo.svg";
import CalendarIcon from "assets/icons/Google_Calendar_icon.svg";
import TitanHalfRounded from "assets/tokens/titan_half_rounded.svg";
import "./CalendarButton.css";
import { atcb_action } from "add-to-calendar-button";
import { TokenSymbol } from "../image/TokenSymbol";
import { useState, useEffect, useMemo } from "react";
import TxLinkIcon from "assets/icons/accountHistory/TxLink.svg";
import commafy from "@/utils/trim/commafy";
import Step2 from "../history/modalComponents/Step2";
import {
  add,
  getTime,
  getUnixTime,
  intervalToDuration,
  Duration,
  format,
  subMinutes,
  addHours,
  differenceInSeconds,
} from "date-fns";
import useGetTxLayers from "@/hooks/user/useGetTxLayers";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useCallClaim from "@/hooks/user/actions/useCallClaim";
import { claimTx } from "@/recoil/userHistory/claimTx";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import { confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";
import { useFeeData } from "wagmi";
import useConnectedNetwork from "@/hooks/network";
import { ethers } from "ethers";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { FullWithTx } from "@/types/activity/history";
import { txDataStatus } from "@/recoil/global/transaction";
import { fetchMarketPrice } from "@/utils/price/fetchMarketPrice";
import { confirmWithdrawData, confirmWithdrawStats } from "@/recoil/modal/atom";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { useGetMode } from "@/hooks/mode/useGetMode";

type TxType = FullWithTx & {
  inTokenAmount: string;
  inTokenSymbol: string;
};
export default function ConfirmWithdraw() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [withdrawData, setWithdrawData] = useRecoilState(confirmWithdrawData);
  const [withdrawStatus, setWithdrawStatus] =
    useRecoilState(confirmWithdrawStats);

  const [, setClaimTx] = useRecoilState(claimTx);
  const providers = useGetTxLayers();
  const tx = withdrawData.modalData;
  const { onClick } = useCallBridgeSwapAction();
  const { gasCostUS } = useGasFee();
  const { claim } = useCallClaim("relayMessage");
  const { isConnectedToMainNetwork, connectedChainId, chainName } =
    useConnectedNetwork();
  const { tokenMarketPrice } = useGetMarketPrice({ tokenName: "ethereum" });
  const [txData, setTxData] = useRecoilState(txDataStatus);

  const { mobileView, pcView } = useMediaView();

  const { data: feeData } = useFeeData({
    chainId: 1,
  });

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

  const getCalendarEvent = useMemo(() => {
    if (tx && tx.timeReadyForRelay) {
      const startDate = new Date(tx.timeReadyForRelay * 1000);
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

  const TitanContainer = (props: { tx: TxType }) => {
    const { tx } = props;
    const { inToken } = useInOutTokens();
    const [usdPrice, setUsdPrice] = useState(0);
    const { mode } = useGetMode();

    // const tokenPrice = useMemo(async () => {
    //   const marketPrice = await fetchMarketPrice(

    //   return marketPrice;
    // }, [inToken, tx]);

    useEffect(() => {
      const getUsdPrice = async () => {
        const marketPrice = await fetchMarketPrice(
          tx ? tx.inTokenSymbol : (inToken?.tokenName as string)
        );
        setUsdPrice(marketPrice);
      };
      getUsdPrice();
    }, [inToken, tx]);
    return (
      <Flex
        pos={"relative"}
        bg="transparent"
        w={{ base: "full", lg: "176px" }}
        pt={{ base: "26px", lg: "30px" }}
        pb={"24px"}
        // justifyContent={"center"}
        h={{ base: "148px", lg: "172px" }}
        border={"1px solid #313442"}
        borderRadius={"12px"}
        flexDir={"column"}
        alignItems={"center"}
      >
        {mobileView && (
          <Flex
            pos={"absolute"}
            top={"0px"}
            right={"0px"}
            w={"34px"}
            h={"34px"}
            borderRadius={"0px 9px 0px 9px"}
            bg={"#2E3140"}
            justify={"center"}
            align={"center"}
            zIndex={100}
          >
            <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
              <Image alt="eth" src={TitanHalfRounded} />
            </Flex>
          </Flex>
        )}
        {mobileView ? (
          <TokenSymbol
            tokenType={inToken?.tokenSymbol ?? "default"}
            w={mobileView ? 48 : 56}
            h={mobileView ? 48 : 56}
          />
        ) : (
          <TokenSymbolWithNetwork
            tokenSymbol={
              tx ? tx.inTokenSymbol : (inToken?.tokenSymbol as string)
            }
            chainId={5050}
            symbolW={56}
            symbolH={56}
            networkSymbolH={20}
            networkSymbolW={20}
          />
        )}

        <Flex
          fontSize={{ base: 17, lg: 18 }}
          fontWeight={600}
          columnGap={"8px"}
          h={"24px"}
          mt={"10px"}
        >
          <Text fontWeight={600}>
            {commafy(tx?.inTokenAmount || inToken?.parsedAmount, 2)}{" "}
          </Text>
          <Text fontWeight={400}>
            {tx?.inTokenSymbol || inToken?.tokenSymbol}
          </Text>
        </Flex>
        <Text
          h="21px"
          mt={"3px"}
          fontSize={"14px"}
          fontWeight={600}
          color={"#A0A3AD"}
        >
          ${" "}
          {inToken?.tokenSymbol && usdPrice !== undefined
            ? commafy(Number(usdPrice) * Number(inToken?.parsedAmount), 2)
            : "0.00"}
        </Text>
      </Flex>
    );
  };

  const EthereumContainer = () => {
    return (
      <Flex
        bg="#0F0F12"
        w={{ base: "full", lg: "176px" }}
        h={{ base: "148px", lg: "172px" }}
        border={"1px solid #313442"}
        borderRadius={"12px"}
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Image src={mobileView ? ETH_Rounded : ETH} alt="ETH" height={40} width={40} />
        {/* <TokenSymbol
          tokenType={
            tx ? (tx.inTokenSymbol as string) : (inToken?.tokenSymbol as string)
          }
          w={40}
          h={40}
        /> */}
        <Text fontSize={"16px"} mt="12px" fontWeight={500}>
          {isConnectedToMainNetwork ? "Ethereum" : "Goerli"}
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
        {tx ? (
          <Flex>
            <Link
              target="_blank"
              href={`${providers.l2BlockExplorer}/tx/${tx.l2txHash}`}
              textDecor={"none"}
              _hover={{ textDecor: "none" }}
              display={"flex"}
            >
              <Text mr="6px" fontSize={"14px"} color={"#FFFFFF"}>
                Transaction
              </Text>
              <Image src={TxLinkIcon} alt="gas station" />
            </Link>
          </Flex>
        ) : (
          <Flex>
            <Text
              mr="6px"
              fontSize={"14px"}
              color={check(props.progress).color}
            >
              {Number(gasCostUS) < 0.01 ? `< $0.01` : `~ $ ${gasCostUS}`}
            </Text>

            <Image src={check(props.progress).gas} alt="gas station" />
          </Flex>
        )}
        {/* <Flex>
          <Text mr="6px" fontSize={"14px"} color={check(props.progress).color}>
            {" "}
          ${gasCostUS}
          </Text>
          <Image src={check(props.progress).gas} alt="gas station" />
        </Flex> */}
      </Flex>
    );
  };

  // const Step2 = (props: { tx:any,progress: string; timeStamp?: number }) => {
  //   const { timeStamp,tx } = props;
  //   const [duration, setDuration] = useState("0");

  //   useEffect(() => {
  //     if (timeStamp) {
  //       const getDuration = setInterval(() => {
  //         const startDate = new Date(timeStamp * 1000);
  //         const currentTime = new Date();
  //         const elapsedTimeInSeconds = differenceInSeconds(
  //           currentTime,
  //           startDate
  //         );
  //         const formattedTime = format(
  //           new Date(elapsedTimeInSeconds * 1000),
  //           "mm:ss"
  //         );
  //         setDuration(formattedTime);
  //       }, 1000);
  //       return () => clearInterval(getDuration);
  //     }
  //   }, []);
  //   // const elapsedTimeInSeconds = differenceInSeconds(currentTime, startTime);

  //   // // Format the elapsed time as hours, minutes, and seconds
  //   // const formattedTime = format(new Date(elapsedTimeInSeconds * 1000), 'HH:mm:ss');

  //   return (
  //     <Flex
  //       h="36px"
  //       justifyContent={"space-between"}
  //       alignItems={"center"}
  //       // border={"1px solid red"}
  //       w="100%"
  //     >
  //       <Flex>
  //         <Image src={check(props.progress).check} alt="check" />
  //         <Text ml="8px" fontSize={"14px"} color={check(props.progress).color}>
  //           Wait {isConnectedToMainNetwork ? "11" : "2"} min for rollup
  //         </Text>
  //       </Flex>
  //       {props.progress !== "done" && (
  //         <Flex>
  //           <Text
  //             mr="6px"
  //             fontSize={"14px"}
  //             color={check(props.progress).color}
  //           >
  //             {"~ "}
  //             {tx ? duration : isConnectedToMainNetwork ? "~11 min" : "~2 min"}
  //           </Text>
  //         </Flex>
  //       )}
  //     </Flex>
  //   );
  // };

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
        {tx && props.progress === "inProgress" && (
          <Flex>
            <Text
              mr="6px"
              fontSize={"14px"}
              color={check(props.progress).color}
            >
              {" "}
              {duration.days !== undefined && duration.days < 10 ? "0" : ""}
              {duration.days}:
              {duration.hours !== undefined && duration.hours < 10 ? "0" : ""}
              {duration.hours}:
              {duration.minutes !== undefined && duration.minutes < 10
                ? "0"
                : ""}
              {duration.minutes}:
              {duration.seconds !== undefined && duration.seconds < 10
                ? "0"
                : ""}
              {duration.seconds} Left
            </Text>
          </Flex>
        )}
      </Flex>
    );
  };

  const Step4 = (props: { progress: string }) => {
    const [relayGasCost, setRelayGasCost] = useState("0");

    useEffect(() => {
      if (feeData && tokenMarketPrice) {
        const gasLimit = 600000;
        const { gasPrice } = feeData;
        const gasCost = gasLimit * Number(gasPrice);
        const parsedTotalGasCost = ethers.utils.formatUnits(
          gasCost.toString(),
          "ether"
        );

        const usTotal = commafy(
          Number(tokenMarketPrice) * Number(parsedTotalGasCost),
          2
        );
        setRelayGasCost(usTotal);

        const getFee = setInterval(() => {
          const gasLimit = 1000000;
          const { gasPrice } = feeData;
          const gasCost = gasLimit * Number(gasPrice);
          const parsedTotalGasCost = ethers.utils.formatUnits(
            gasCost.toString(),
            "ether"
          );

          const usTotal = commafy(
            Number(tokenMarketPrice) * Number(parsedTotalGasCost),
            2
          );
          setRelayGasCost(usTotal);
        }, 12000);

        return () => clearInterval(getFee);
      }
    }, [feeData]);

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
        {props.progress !== "done" && (
          <Flex>
            <Text
              mr="6px"
              fontSize={"14px"}
              color={check(props.progress).color}
            >
              {" "}
              ~ ${relayGasCost}
            </Text>
            <Image src={check(props.progress).gas} alt="gas station" />
          </Flex>
        )}
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

  const TimelineComponent = (props: { tx: TxType }) => {
    return (
      <Flex
        flexDir={"column"}
        bg="#15161D"
        borderRadius={"8px"}
        w={{ base: "full", lg: "364px" }}
        h="218px"
        px="12px"
        py="8px"
      >
        <Step1
          progress={
            props.tx === undefined || props.tx === null ? "inProgress" : "done"
          }
        />
        <Dots progress={!props.tx ? "inProgress" : "done"} />
        <Step2
          progress={
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 2
              ? "inProgress"
              : props.tx.currentStatus > 2
              ? "done"
              : "todo"
          }
          timeStamp={tx ? tx.l2timeStamp : undefined}
        />
        <Dots
          progress={
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 2
              ? "inProgress"
              : props.tx.currentStatus > 2
              ? "done"
              : "todo"
          }
        />
        <Step3
          progress={
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 4
              ? "inProgress"
              : props.tx.currentStatus > 4
              ? "done"
              : "todo"
          }
          timeStamp={tx ? Number(tx.timeReadyForRelay) : 0}
        />
        <Dots
          progress={
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 4
              ? "inProgress"
              : props.tx.currentStatus > 4
              ? "done"
              : "todo"
          }
        />
        <Step4
          progress={
            !props.tx
              ? "todo"
              : props.tx.currentStatus === 5
              ? "inProgress"
              : props.tx.currentStatus > 4
              ? "done"
              : "todo"
          }
        />
      </Flex>
    );
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
  const CalendarComponent = () => {
    return (
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        cursor={"pointer"}
        w="100%"
        h={{base: "fit-content", lg: "70px"}}
        onClick={() => atcb_action(config)}
      >
        {pcView && <Text h="19px" fontSize={"12px"} textAlign={"center"}>
          Set calendar reminder to claim withdraw on Ethereum
        </Text>}
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
        {tx ? "Claim Withdraw" : "Initiate Withdraw"}
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
          ) : tx.currentStatus === 4 ? (
            <CalendarComponent />
          ) : null}
          <ActionButton />
        </Flex>
      </ModalContent>
    </Modal>
  );
}
