import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Flex,
  CloseButton,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  Action,
  StandardHistory,
  TransactionHistory,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import { legacyTitanConfirmModalStatus } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useMemo, useState } from "react";
import { useNetwork } from "wagmi";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import SwitchNetworkWarningComponent from "../../new-confirm/components/core/thanos/SwitchNetworkWarning";
import useDepositWithdrawConfirm from "../../new-confirm/hooks/useDepositWithdrawConfirmModal";
import TransactionInfo from "./TransactionInfo";
import BridgeActionButtonComponent from "../../new-confirm/components/core/thanos/BridgeActionButton";
import ConfirmCheckboxComponent from "../../new-confirm/components/core/thanos/ConfirmCheckbox";
import { useWithdrawLegacyTitan } from "@/staging/hooks/legacyTitan/useWithdrawLegacyTitan";

export const LegacyTitanConfirmModal = () => {
  const { onCloseLegacyTitanConfirmModal } = useDepositWithdrawConfirm();
  const [legacyConfirmModal, setLegacyConfirmModal] = useRecoilState(
    legacyTitanConfirmModalStatus
  );
  const { chain } = useNetwork();

  const transactionData = legacyConfirmModal.transaction;
  const isDisbleForAction = useMemo(() => {
    if (!transactionData) return true;
    if (chain?.id !== transactionData.outNetwork) return true;
    return false;
  }, [chain, transactionData]);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const handleConfirmCheck = () => {
    setIsConfirmed((prev) => !prev);
  };
  const { callToWithdrawLegacyTitan } = useWithdrawLegacyTitan(
    transactionData as WithdrawTransactionHistory
  );
  const handleActionClick = () => {
    callToWithdrawLegacyTitan();
  };
  const confirmMessage = "Text will be changed.";
  return (
    <Modal
      isOpen={legacyConfirmModal.isOpen}
      onClose={onCloseLegacyTitanConfirmModal}
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
          <CloseButton onClick={onCloseLegacyTitanConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <Flex flexDir={"column"} gap={"12px"}>
            {isDisbleForAction && (
              <SwitchNetworkWarningComponent
                chainId={
                  transactionData?.outNetwork ?? SupportedChainId.MAINNET
                }
              />
            )}
            <TransactionInfo transaction={transactionData as StandardHistory} />
          </Flex>
        </ModalBody>
        <ModalFooter p={0} display="block">
          <Flex gap={"12px"} flexDir={"column"} mt={"12px"}>
            <ConfirmCheckboxComponent
              isChecked={isConfirmed}
              onClickCheckbox={handleConfirmCheck}
              content={confirmMessage}
            />
            <BridgeActionButtonComponent
              tx={transactionData as TransactionHistory}
              isConfirmed={isConfirmed}
              toolTip={"Text will be changed"}
              onClick={handleActionClick}
              disabled={isDisbleForAction}
            />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
