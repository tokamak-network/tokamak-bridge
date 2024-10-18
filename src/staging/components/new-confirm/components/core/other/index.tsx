import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Action,
  Status,
  GasCostData,
  CT_ACTION,
  StandardHistory,
} from "@/staging/types/transaction";
import useDepositWithdrawConfirmModal from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import TimeLine from "./TimeLine";
import CloseButton from "@/components/button/CloseButton";
import NetworkSymbol from "@/staging/components/new-confirm/components/NetworkSymbol";
import { Tooltip } from "@/staging/components/common/Tooltip";
import ConfirmDetails from "@/staging/components/new-confirm/components/core/other/ConfirmDetails";
import { getStatusConfig, STATUS_CONFIG } from "@/staging/constants/status";
import StatusComponent from "@/staging/components/new-confirm/components/core/other/StatusComponent";
import ConditionalBox from "@/staging/components/new-confirm/components/core/other/ConditionalBox";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import useRelayGas from "@/staging/components/new-confirm/hooks/useGetGas";
import {
  NetworkDisplayName,
  SupportedChainId,
} from "@/types/network/supportedNetwork";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";

import {
  getLineType,
  getType,
  getWaitMessage,
} from "@/staging/components/new-confirm/utils/getConfirmType";
import { getGasCostText } from "@/utils/number/compareNumbers";
import useConnectedNetwork from "@/hooks/network";
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { THANOS_SEPOLIA_CHAIN_ID } from "@/constant/network/thanos";
import Link from "next/link";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import ConfirmCheckboxComponent from "./ConfirmCheckbox";
import InitiateButton from "@/staging/components/new-confirm/components/core/other/InitiateButton";
import ApproveButton from "./ApproveButton";
import { useApprove } from "@/hooks/token/useApproval";
import { getRemainTime } from "@/staging/components/new-history-thanos/utils/getTimeDisplay";
import { useCountdown } from "@/staging/hooks/useCountdown";
import useMediaView from "@/hooks/mediaView/useMediaView";
import ArrowIcon from "@/assets/icons/newHistory/small-arrow.svg";
import Image from "next/image";
import InfoIcon from "@/assets/icons/info.svg"

export default function DepositWithdrawConfirmModal() {
  const { mobileView } = useMediaView();
  const { depositWithdrawConfirmModal, onCloseDepositWithdrawConfirmModal } =
    useDepositWithdrawConfirmModal();

  const transactionData =
    depositWithdrawConfirmModal.transaction as StandardHistory;
  const isStandardBridge =
    transactionData?.toAddress === transactionData?.fromAddress;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { address } = useAccount();
  const { onClick } = useCallBridgeSwapAction();
  const { totalGasCost, gasCostUS } = useGasFee();
  const networkChainId = transactionData?.outNetwork || THANOS_SEPOLIA_CHAIN_ID;
  const inNetworkChainId =
    transactionData?.inNetwork || SupportedChainId.MAINNET;

  const chainName = getKeyByValue(SupportedChainId, networkChainId) || "";

  const displayNetworkName = NetworkDisplayName[chainName];
  /**
   * Lakmi src/components/history/modalComponents/Step4.tsx @Robert
   * Removed interval, added gasLimit parameter.
   * Replaced 600000 and 1000000 with gasLimit parameter.
   * Changed fixed chainId to chainId parameter.
   */
  const CLAIM_GAS_USED = 1000000;
  const withdrawCost = useRelayGas(CLAIM_GAS_USED, SupportedChainId["MAINNET"]);

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const handleConfirmCheck = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsConfirmed(e.target.checked);

  const { isApproved } = useApprove();

  useEffect(() => {
    setIsConfirmed(false);
  }, [depositWithdrawConfirmModal.isOpen]);

  const gasCostData: GasCostData = useMemo(() => {
    const formatValue = (value: string | undefined | null) =>
      value == null || value === "0" || value === "-" ? "NA" : value;

    if (transactionData?.action === Action.Deposit) {
      return {
        depositInitiateGasCostText: formatValue(getGasCostText(totalGasCost)),
        depositGasCostUS: formatValue(gasCostUS),
      };
    }
    if (transactionData?.action === Action.Withdraw) {
      return {
        withdrawInitiateGasCostText: formatValue(getGasCostText(totalGasCost)),
        withdrawInitiateGasCostUS: formatValue(gasCostUS),
        withdrawClaimGasCostText: formatValue(
          getGasCostText(withdrawCost.totalGasCost)
        ),
        withdrawClaimGasCostUS: formatValue(withdrawCost.usGasCost),
      };
    }
    return {};
  }, [transactionData, totalGasCost, gasCostUS, withdrawCost]);

  const remainTime = useMemo(() => {
    return getRemainTime(transactionData);
  }, [transactionData]);
  const { time: timeDisplay, isCountDown } = useCountdown(
    remainTime,
    false,
    transactionData
  );

  if (!transactionData) {
    return null;
  }

  const lineType = getLineType(transactionData);

  const statusConfig = getStatusConfig(
    transactionData.inNetwork,
    transactionData.outNetwork
  );

  const statuses: Status[] =
    transactionData.action === Action.Withdraw
      ? statusConfig.WITHDRAW
      : statusConfig.DEPOSIT;

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
  const renderStatusComponents = (
    statuses: Status[],
    action: Action | CT_ACTION
  ) => {
    return statuses.map((statusKey, index) => {
      const lineType = getLineType(transactionData);
      const typeValue = getType(lineType, index);
      const waitMessage = getWaitMessage(
        lineType,
        index,
        action === Action.Deposit
          ? transactionData.outNetwork
          : transactionData.inNetwork
      );

      return (
        <React.Fragment key={index}>
          <StatusComponent
            label={statusKey}
            transactionData={transactionData}
            lineType={lineType}
            gasCostData={gasCostData}
          />
          {(statuses.length === 2 && index === 0) ||
            (statuses.length === 3 && index < 2)
            ? typeValue !== undefined && (
              <ConditionalBox
                isCountDown={isCountDown}
                timeDisplay={timeDisplay}
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
      isOpen={depositWithdrawConfirmModal.isOpen}
      onClose={onCloseDepositWithdrawConfirmModal}
      motionPreset={mobileView ? "slideInBottom" : "scale"}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        mb={mobileView ? 0 : "auto"}
        alignSelf={mobileView ? "flex-end" : "center"}
        borderRadius={mobileView ? "16px 16px 0 0" : "16px"}
        width={mobileView ? "100%" : "404px"}
        bg="#1F2128"
        p={mobileView ? "12px 12px 16px 12px" : "20px"}
        {...(mobileView && {
          maxHeight: "calc(100vh - 80px)",
          overflowY: "auto",
        })}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text
            fontSize={mobileView ? "16px" : "20px"}
            fontWeight={"500"}
            lineHeight={mobileView ? "24px" : "30px"}
          >
            Confirm{" "}
            {transactionData?.action === Action.Withdraw
              ? "Withdraw"
              : "Deposit"}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseDepositWithdrawConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bg="#0F0F12"
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
            <Flex
              borderTop="1px solid #313442"
              mt={"16px"}
              pt={"16px"}
              flexDir={"column"}
              gap={"6px"}
            >
              {isStandardBridge && (
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
                      networkI={transactionData.outNetwork}
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
                      {`${displayNetworkName} Standard Bridge`}
                    </Text>
                  </Flex>
                </Flex>
              )}
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Flex gap={"3px"} alignItems={"center"}>
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
                    {"to"}
                  </Text>
                  {!isStandardBridge && <Image src={InfoIcon} alt="info icon" />}
                </Flex>
                <Link
                  target="_blank"
                  href={`${BLOCKEXPLORER_CONSTANTS[inNetworkChainId]}/address/${address}`}
                >
                  {isStandardBridge ? (
                    <Text
                      fontWeight={600}
                      fontSize={"12px"}
                      lineHeight={"18px"}
                      color={"#FFFFFF"}
                      cursor={"pointer"}
                    >
                      {trimAddress({ address: address, firstChar: 6 })}
                    </Text>
                  ) : (
                    <Flex gap={"4px"}>
                      <Text
                        fontSize={"12px"}
                        fontWeight={
                          transactionData?.fromAddress === address ? 400 : 700
                        }
                      >
                        {transactionData?.fromAddress === address
                          ? "This address"
                          : trimAddress({
                            address: transactionData?.fromAddress,
                            firstChar: 6,
                          })}
                      </Text>
                      <Image src={ArrowIcon} alt="Arrow Icon" />
                      <Text
                        fontSize={"12px"}
                        fontWeight={
                          transactionData?.toAddress === address ? 400 : 700
                        }
                      >
                        {transactionData?.toAddress === address
                          ? "This address"
                          : trimAddress({
                            address: transactionData?.toAddress,
                            firstChar: 6,
                          })}
                      </Text>
                    </Flex>
                  )}
                </Link>
              </Flex>
            </Flex>
          </Box>
          <Box
            mt={"12px"}
            px={"20px"}
            pt={"16px"}
            borderRadius={"8px"}
            bg="#15161D"
          >
            <Flex gap={"10px"}>
              <Box>
                <TimeLine lineType={lineType} />
              </Box>
              <Box width={"calc(100% - 20px)"}>
                {renderStatusComponents(statuses, transactionData.action)}
              </Box>
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter
          p={0}
          display="block"
          mt={
            transactionData.status === Status.Initiate || isButtonVisible
              ? "12px"
              : 0
          }
        >
          {transactionData.status === Status.Initiate ? (
            <Flex gap={"12px"} flexDir={"column"}>
              <ConfirmCheckboxComponent
                isChecked={isConfirmed}
                onClickCheckbox={handleConfirmCheck}
              />
              <ApproveButton isConfirmed={isConfirmed} />
              <InitiateButton
                isApproved={isApproved}
                isConfirmed={isConfirmed}
                onClick={onClick}
                onCloseDepositWithdrawConfirmModal={
                  onCloseDepositWithdrawConfirmModal
                }
              />
            </Flex>
          ) : (
            <>
              {isButtonVisible && (
                <Button
                  width="full"
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
                    <Text
                      fontWeight={600}
                      fontSize={"16px"}
                      lineHeight={"24px"}
                    >
                      Finalize
                    </Text>
                    <Tooltip
                      tooltipLabel={"text will be changed"}
                      style={{ marginLeft: "2px" }}
                      type={lineType !== 3 ? "grey" : "white"}
                    />
                  </Flex>
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
