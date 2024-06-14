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
import { Network, Action, Status } from "@/components/historyn/types";
import useSwapConfirm from "@/components/confirmn/hooks/useSwapConfirmModal";
import TimeLine from "./TimeLine";
import CloseButton from "@/components/button/CloseButton";
import NetworkSymbol from "@/components/confirmn/components/NetworkSymbol";
import { FwTooltip } from "@/components/fw/components/FwTooltip";
import ConfirmDetails from "@/components/confirmn/modal/other/ConfirmDetails";
import { STATUS_CONFIG } from "@/components/historyn/constants";
import StatusComponent from "@/components/confirmn/modal/other/StatusComponent";
import ConditionalBox from "@/components/confirmn/modal/other/ConditionalBox";
import {
  getLineType,
  getType,
  getWaitMessage,
} from "@/components/confirmn/utils/getConfirmType";

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

  {
    /**
     * The renderStatusComponents function iterates over the statuses array @Robert
     * and renders a StatusComponent and, conditionally, a ConditionalBox
     * component for each status. The ConditionalBox component is rendered
     * between the StatusComponent elements based on the length of the statuses array.
     *
     * - For WITHDRAW (length 3): Two ConditionalBox components are inserted between the StatusComponent elements.
     * - For DEPOSIT (length 2): One ConditionalBox component is inserted between the StatusComponent elements.
     */
  }
  const renderStatusComponents = (statuses: Status[]) => {
    return statuses.map((statusKey, index) => {
      const lineType = getLineType(transactionData);
      const typeValue = getType(lineType, index);
      const waitMessage = getWaitMessage(lineType, index);

      return (
        <React.Fragment key={index}>
          <StatusComponent
            label={statusKey}
            transactionData={transactionData}
            lineType={lineType}
          />
          {(statuses.length === 2 && index === 0) ||
          (statuses.length === 3 && index < 2)
            ? typeValue !== undefined && (
                <ConditionalBox
                  type={typeValue}
                  transactionData={transactionData}
                  waitMessage={waitMessage}
                />
              )
            : null}
        </React.Fragment>
      );
    });
  };

  const isButtonVisible =
    !(transactionData.action === Action.Deposit) &&
    !(
      transactionData.action === Action.Withdraw &&
      transactionData.status === Status.Completed
    );

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
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bg='#0F0F12'
          >
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
          <Box
            my={"12px"}
            px={"20px"}
            pt={"16px"}
            borderRadius={"8px"}
            bg='#15161D'
          >
            <Flex>
              <Box>
                <TimeLine lineType={lineType} />
              </Box>
              <Box ml={"10px"}>{renderStatusComponents(statuses)}</Box>
            </Flex>
          </Box>
          <Box mt={"12px"} mb={isButtonVisible ? "12px" : undefined} pb={"4px"}>
            <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
              Estimated Time of Arrival: ~1 day
            </Text>
            <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
              Estimated Time of Arrival: ~1 day
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          {isButtonVisible && (
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
                <FwTooltip
                  tooltipLabel={"text will be changed"}
                  style={{ marginLeft: "2px" }}
                  type={lineType !== 3 ? "grey" : "white"}
                />
              </Flex>
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
