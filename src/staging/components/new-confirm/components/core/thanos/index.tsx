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
} from "@/staging/types/transaction";
import useDepositWithdrawConfirm from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
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
import { getKeyByValue } from "@/utils/ts/getKeyByValue";
import { THANOS_SEPOLIA_CHAIN_ID } from "@/constant/network/thanos";
import Link from "next/link";
import { BLOCKEXPLORER_CONSTANTS } from "@/staging/constants/blockexplorer";
import ConfirmCheckboxComponent from "./ConfirmCheckbox";
import InitiateButton from "@/staging/components/new-confirm/components/core/other/InitiateButton";
import ApproveButton from "./ApproveButton";
import { useApprove } from "@/hooks/token/useApproval";
import { TransactionInfo } from "./TransactionInfo";
import BridgeStatusComponent from "./BridgeStatus";
import BridgeActionButtonComponent from "./BridgeActionButton";

export default function ThanosDepositWithdrawConfirmModal() {
  const {
    thanosDepositWithdrawConfirmModal,
    onCloseThanosDepositWithdrawConfirmModal,
  } = useDepositWithdrawConfirm();
  const transactionData = thanosDepositWithdrawConfirmModal.transaction;
  const { address } = useAccount();
  const { onClick } = useCallBridgeSwapAction();
  const { totalGasCost, gasCostUS } = useGasFee();

  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const toDisplayConfirmBox = transactionData?.status === Status.Initiate;

  const handleConfirmCheck = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsConfirmed(e.target.checked);

  const { isApproved } = useApprove();

  useEffect(() => {
    if (transactionData?.status === Status.Initiate) setIsConfirmed(false);
    else setIsConfirmed(true);
  }, [thanosDepositWithdrawConfirmModal.isOpen]);

  const confirmMessage = "Text will be changed.";
  const statusDescription = "Text will be changed.";

  if (!transactionData) {
    return null;
  }

  return (
    <Modal
      isOpen={thanosDepositWithdrawConfirmModal.isOpen}
      onClose={onCloseThanosDepositWithdrawConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg="#1F2128"
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
          <CloseButton onClick={onCloseThanosDepositWithdrawConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <TransactionInfo tx={transactionData} address={address} />
          <BridgeStatusComponent tx={transactionData} />
        </ModalBody>
        <ModalFooter p={0} display="block">
          <Flex gap={"12px"} flexDir={"column"}>
            <Flex gap={"8px"} flexDir={"column"}>
              <Text
                fontSize={"13px"}
                fontWeight={toDisplayConfirmBox ? 600 : 400}
                lineHeight={"20px"}
                color={
                  toDisplayConfirmBox && !isConfirmed ? "#A0A3AD" : "white"
                }
              >
                {statusDescription}
              </Text>
              <ConfirmCheckboxComponent
                isChecked={isConfirmed}
                onClickCheckbox={handleConfirmCheck}
                content={confirmMessage}
              />
            </Flex>
            <BridgeActionButtonComponent
              tx={transactionData}
              isConfirmed={isConfirmed}
              toolTip={"Text will be changed"}
            />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
