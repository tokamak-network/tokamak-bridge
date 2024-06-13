import React, { useMemo } from "react";
import {
  Modal,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Button,
} from "@chakra-ui/react";
import { useAccount } from "wagmi";
import { trimAddress } from "@/utils/trim";
import {
  Network,
  Action,
  Status,
  TransactionHistory,
} from "@/components/historyn/types";
import useSwapConfirm from "@/components/confirmn/hooks/useSwapConfirmModal";
import TimeLine from "./TimeLine";
import CloseButton from "@/components/button/CloseButton";
import NetworkSymbol from "@/components/confirmn/components/NetworkSymbol";
import { FwTooltip } from "@/components/fw/components/FwTooltip";
import ConfirmDetails from "@/components/confirmn/ConfirmDetails";
import { STATUS_CONFIG } from "@/components/historyn/constants";
import StatusComponent from "@/components/confirmn/StatusComponent";
import ConditionalBox from "@/components/confirmn/ConditionalBox";
import getLineType from "@/components/confirmn/utils/getLineType";

export default function SwapConfirmModal() {
  const { swapConfirmModal, onCloseSwapConfirmModal } = useSwapConfirm();
  const transactionData = swapConfirmModal.transaction;

  const { address } = useAccount();

  if (!transactionData) {
    return null;
  }
  const lineType = getLineType(transactionData);

  const statuses: Status[] =
    transactionData.action === Action.Withdraw
      ? STATUS_CONFIG.WITHDRAW
      : STATUS_CONFIG.DEPOSIT;

  const renderStatusComponents = (
    statuses: Status[],
    transaction: TransactionHistory
  ) => {
    return statuses.map((statusKey, index) => {
      const lineType = getLineType(transaction);

      const type = (() => {
        switch (lineType) {
          case 0:
            return "wait";
          case 1:
            return index === 0 ? "timer" : "wait";
          case 2:
            return index === 0 ? "box" : "timer";
          case 3:
            return "box";
          case 4:
            return "box";
          case 100:
            return "wait";
          case 101:
            return "timer";
          case 102:
            return "box";
          default:
            return undefined;
        }
      })();

      const waitMessage = (() => {
        if (lineType === 0) {
          return index === 0 ? "Wait 1~11 min" : "Wait 7 days";
        } else if (lineType === 1) {
          return "Wait 7 days";
        } else if (lineType === 100) {
          return "Wait 1 min";
        } else {
          return undefined;
        }
      })();

      return (
        <React.Fragment key={index}>
          <StatusComponent
            label={statusKey}
            transactionData={transaction}
            lineType={lineType}
          />
          {(statuses.length === 2 && index === 0) ||
          (statuses.length === 3 && index < 2)
            ? type !== undefined && (
                <ConditionalBox
                  type={type}
                  transactionData={transaction}
                  waitMessage={waitMessage}
                />
              )
            : null}
        </React.Fragment>
      );
    });
  };

  return (
    <Modal
      isOpen={swapConfirmModal.isOpen}
      onClose={onCloseSwapConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Confirm{" "}
            {transactionData?.action === Action.Withdraw
              ? "Withdraw"
              : "Deposit"}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseSwapConfirmModal} />
        </Box>
        <ModalBody p={0}>
          {/** 첫번째 박스 @Box1 */}
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bg='#0F0F12'
          >
            {/** Box안 fLEX 두번 반복 @Repeat1 */}
            <Box>
              <ConfirmDetails
                isInNetwork={true}
                transactionHistory={transactionData}
              />
              <ConfirmDetails
                isInNetwork={false}
                transactionHistory={transactionData}
              />
            </Box>
            {/** BORDER TOP 경계 그려진다. */}
            <Box borderTop='1px solid #313442' mt={"16px"} pt={"16px"}>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text
                  fontWeight={400}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  Bridge
                </Text>
                <Flex>
                  <NetworkSymbol
                    networkI={Network.Titan}
                    networkH={16}
                    networkW={16}
                  />
                  <Text
                    ml={"4px"}
                    fontWeight={500}
                    fontSize={"12px"}
                    lineHeight={"18px"}
                    color={"#FFFFFF"}
                  >
                    Titan Standard bridge
                  </Text>
                </Flex>
              </Flex>
              <Flex
                mt={"6px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontWeight={400}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  {transactionData?.action === Action.Withdraw
                    ? "Withdraw"
                    : "Deposit"}
                  {/** Add a space */ " "}
                  to
                </Text>
                <Text
                  fontWeight={600}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#FFFFFF"}
                >
                  {trimAddress({ address: address, firstChar: 6 })}
                </Text>
              </Flex>
            </Box>
          </Box>
          {/** 두번째 박스 @Box2 */}
          <Box
            my={"12px"}
            px={"20px"}
            pt={"16px"}
            borderRadius={"8px"}
            bg='#15161D'
          >
            <Flex>
              {/** 타임라인 @TimeLine */}
              <Box>
                <TimeLine lineType={lineType} />
              </Box>
              <Box ml={"10px"}>
                {renderStatusComponents(statuses, transactionData)}
              </Box>
            </Flex>
          </Box>
          <Box my={"12px"}>
            <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
              Estimated Time of Arrival: ~1 day
            </Text>
            <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
              Estimated Time of Arrival: ~1 day
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: lineType !== 3 ? "#17181D" : "#007AFF",
              color: lineType !== 3 ? "#8E8E92" : "#FFFFFF",
            }}
            _active={{}}
            _hover={{}}
            _focus={{}}
          >
            <Flex alignItems={"center"}>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Finalize
              </Text>
              {/* <FwTooltip
                tooltipLabel={"text will be changed"}
                style={{ marginLeft: "2px" }}
              /> */}
            </Flex>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
