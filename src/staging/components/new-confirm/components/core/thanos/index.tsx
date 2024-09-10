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
  DepositWithdrawType,
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
import { useThanosSDK } from "@/staging/hooks/useThanosSDK";
import { getBridgeL1ChainId, getBridgeL2ChainId } from "../../../utils";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import useCTOption from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";

type TxInfoType = {
  l1ChainId: SupportedChainId | null;
  l2ChainId: SupportedChainId | null;
  l1TokenAddress: string;
  l2TokenAddress: string;
};

export default function ThanosDepositWithdrawConfirmModal() {
  const {
    thanosDepositWithdrawConfirmModal,
    onCloseThanosDepositWithdrawConfirmModal,
  } = useDepositWithdrawConfirm();
  const transactionData = thanosDepositWithdrawConfirmModal.transaction;
  const { address } = useAccount();
  const { onClick } = useCallBridgeSwapAction();
  const { totalGasCost, gasCostUS } = useGasFee();
  const [txHash, setTxHash] = useState<string | undefined>(undefined);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { onCloseCTOptionModal } = useCTOption();
  const [txInfo, setTxInfo] = useState<TxInfoType | null>(null);

  const toDisplayConfirmBox = transactionData?.status === Status.Initiate;

  useEffect(() => {
    if (
      !transactionData ||
      !transactionData?.inToken ||
      !transactionData.outToken ||
      !transactionData.inNetwork ||
      !transactionData.outNetwork
    )
      return;
    const l1ChainId = getBridgeL1ChainId(transactionData);

    const l2ChainId = getBridgeL2ChainId(transactionData);

    const inTokenAddress = getTokenAddressByChainId(
      transactionData.inToken.symbol,
      transactionData.inNetwork
    );
    const outTokenAddress = getTokenAddressByChainId(
      transactionData.inToken.symbol,
      transactionData.outNetwork
    );

    setTxInfo({
      l1ChainId,
      l2ChainId,
      l1TokenAddress:
        transactionData.action === Action.Deposit
          ? inTokenAddress
          : outTokenAddress,
      l2TokenAddress:
        transactionData.action === Action.Deposit
          ? outTokenAddress
          : inTokenAddress,
    });
  }, [transactionData]);

  const handleConfirmCheck = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsConfirmed(e.target.checked);

  const { crossChainMessenger: thanosCM } = useThanosSDK(
    txInfo?.l1ChainId ?? null,
    txInfo?.l2ChainId ?? null
  );

  const {} = useTx({
    hash: txHash as `0x${string}`,
    txSort:
      transactionData?.action === Action.Withdraw ? "Withdraw" : "Deposit",
    L2Chain: txInfo?.l2ChainId ?? SupportedChainId.THANOS_SEPOLIA,
    inToken: transactionData?.inToken.symbol,
  });

  // need to update when we decide to use this component for Titan
  const handleActionClick = useCallback(() => {
    if (transactionData?.action === Action.Withdraw) {
      onCloseCTOptionModal();
      onCloseThanosDepositWithdrawConfirmModal();
      setIsOpen(true);
      setModalOpen("confirming");
      if (!thanosCM) return;
      const performWithdraw = async () => {
        try {
          let result;
          switch (transactionData.withdrawType) {
            case DepositWithdrawType.ETH:
              result = await thanosCM.withdrawETH(transactionData.amount);
              break;
            case DepositWithdrawType.NativeToken:
              result = await thanosCM.withdrawNativeToken(
                transactionData.amount
              );
              break;
            case DepositWithdrawType.ERC20:
              result = await thanosCM.withdrawERC20(
                txInfo?.l1TokenAddress,
                txInfo?.l2TokenAddress,
                transactionData.amount
              );
              break;
          }

          // Now `result` holds the transaction response, check if it has a hash
          if (result && result.hash) {
            setTxHash(result.hash);
            const withdrawalTx = await result.wait();
            return withdrawalTx; // Return the transaction receipt
          } else {
            throw new Error(
              "Withdrawal transaction failed to generate a hash."
            );
          }
        } catch (error) {
          setModalOpen("error");
          console.error(error);
        }
      };
      performWithdraw();
    }
  }, [transactionData, thanosCM]);

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
              onClick={handleActionClick}
            />
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
