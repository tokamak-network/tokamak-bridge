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
} from "@chakra-ui/react";
import { useAccount, useNetwork } from "wagmi";
import {
  Action,
  Status,
  DepositWithdrawType,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import useDepositWithdrawConfirm from "@/staging/components/new-confirm/hooks/useDepositWithdrawConfirmModal";
import CloseButton from "@/components/button/CloseButton";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";

import ConfirmCheckboxComponent from "./ConfirmCheckbox";
import { useApprove } from "@/hooks/token/useApproval";
import { TransactionInfo } from "./TransactionInfo";
import BridgeStatusComponent from "./BridgeStatus";
import BridgeActionButtonComponent from "./BridgeActionButton";
import { useThanosSDK } from "@/staging/hooks/useThanosSDK";
import {
  getBridgeActionButtonContent,
  getBridgeL1ChainId,
  getBridgeL2ChainId,
} from "../../../utils";
import { useTx } from "@/hooks/tx/useTx";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import useCTOption from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import { getTokenAddressByChainId } from "@/constant/contracts/tokens";
import { useWithdrawAction } from "../../../hooks/useWithdrawAction";
import SwitchNetworkWarningComponent from "./SwitchNetworkWarning";
import { useRecoilState } from "recoil";
import { pendingTransactionHashes } from "@/recoil/modal/atom";

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
  const { chain } = useNetwork();

  const toDisplayConfirmBox = transactionData?.status === Status.Initiate;
  const [pendingTxHashes, setPendingTxHashes] = useRecoilState(
    pendingTransactionHashes
  );

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

  const { handleWithdrawTxAction } = useWithdrawAction();

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
      if (transactionData.status === Status.Initiate) {
        onCloseCTOptionModal();
        onCloseThanosDepositWithdrawConfirmModal();
        setIsOpen(true);
        setModalOpen("confirming");
        if (!thanosCM) return;
        performWithdraw();
      } else if (
        transactionData.status === Status.Prove ||
        transactionData.status === Status.Finalize
      )
        handleWithdrawTxAction(transactionData as WithdrawTransactionHistory);
    }
  }, [transactionData, thanosCM, chain, address]);

  const { isApproved } = useApprove();

  useEffect(() => {
    if (transactionData?.status === Status.Initiate) setIsConfirmed(false);
    else setIsConfirmed(true);
  }, [thanosDepositWithdrawConfirmModal.isOpen]);

  const confirmMessage = "Text will be changed.";
  const statusDescription = "Text will be changed.";

  const isDisbleForAction = useMemo(() => {
    if (!transactionData) return true;
    if (
      transactionData.status === Status.Prove ||
      transactionData.status === Status.Finalize
    ) {
      if (chain?.id !== transactionData.outNetwork) return true;
    }
    return false;
  }, [chain, transactionData]);

  if (!transactionData) {
    return null;
  }
  const buttonContent = getBridgeActionButtonContent(transactionData);

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
          <Flex flexDir={"column"} gap={"12px"}>
            {isDisbleForAction && (
              <SwitchNetworkWarningComponent
                chainId={SupportedChainId.SEPOLIA}
              />
            )}
            <TransactionInfo tx={transactionData} address={address} />
            <BridgeStatusComponent tx={transactionData} />
          </Flex>
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
              {transactionData.status === Status.Initiate && (
                <ConfirmCheckboxComponent
                  isChecked={isConfirmed}
                  onClickCheckbox={handleConfirmCheck}
                  content={confirmMessage}
                />
              )}
            </Flex>
            {buttonContent && (
              <BridgeActionButtonComponent
                tx={transactionData}
                isConfirmed={isConfirmed}
                toolTip={"Text will be changed"}
                onClick={handleActionClick}
                disabled={isDisbleForAction}
              />
            )}
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
