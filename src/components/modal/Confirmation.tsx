import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import "@/css/spinner.css";
import ConfirmedImage from "assets/image/modal/confirmed.svg";
import ErrorImage from "assets/image/modal/error.svg";
import Check from "assets/image/modal/check.svg";
import CloseButton from "../button/CloseButton";
import useConnectedNetwork from "@/hooks/network";
import { useTransaction } from "@/hooks/tx/useTx";
import { useCallback, useState } from "react";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useGetMode } from "@/hooks/mode/useGetMode";
import { txHashLog, txHashStatus } from "@/recoil/global/transaction";
import { useRouter } from "next/navigation";
import { capitalizeFirstChar } from "@/utils/trim/capitalizeChar";
import { useGetPositionIdFromPath } from "@/hooks/pool/useGetPositionIds";

export default function Confirmation() {
  const { blockExplorer, connectedChainId } = useConnectedNetwork();
  const txHash = useRecoilValue(txHashStatus);

  const { isConfirmed, isConfirming, isError, isOpen, setIsOpen, closeModal } =
    useTxConfirmModal();
  const { mode, subMode } = useGetMode();
  const txLog = useRecoilValue(txHashLog);
  const { positionId } = useGetPositionIdFromPath();

  const closeThisModal = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const subModeValue = Object.keys(subMode).filter(
    (key) => subMode[key as keyof typeof subMode] === true
  );

  return (
    <Modal isOpen={isOpen} onClose={closeThisModal}>
      <ModalOverlay />
      <ModalContent
        h={"100%"}
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
      >
        <Flex
          w={"254px"}
          h={"350px"}
          bgColor={"#1f2128"}
          borderRadius={"16px"}
          flexDir={"column"}
          alignItems={"center"}
        >
          <Flex w={"100%"} justifyContent={"flex-end"} pt={"14px"} pr={"14px"}>
            {/*it's for fetching new data after tx confirmed on those pages */}
            {(subMode.add || subMode.increase || subMode.remove) &&
            isConfirmed ? (
              <Link
                href={`/pools/${txLog?.logs?.tokenId.toString()}?chainId=${connectedChainId}`}
              >
                <CloseButton onClick={closeThisModal} />
              </Link>
            ) : (
              <CloseButton onClick={closeThisModal} />
            )}
          </Flex>
          <Text mt={"26px"} fontSize={18} mb={"41px"}>
            {isConfirming
              ? `Confirming ${
                  subModeValue.length === 1
                    ? capitalizeFirstChar(subModeValue[0])
                    : mode === "Pool"
                    ? "Claim"
                    : mode
                }`
              : isConfirmed
              ? "Transaction Confirmed!"
              : isError
              ? "Transaction Failed"
              : null}
          </Text>
          <Flex pos={"relative"} w={"100%"} justifyContent={"center"}>
            {isConfirming ? (
              <Box w={"96px"} h={"96px"} className="loading2 spinner2"></Box>
            ) : isConfirmed ? (
              <Flex>
                <Image src={ConfirmedImage} alt={"ConfirmedImage"} />
                <Image
                  src={Check}
                  alt={"Check"}
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "40%",
                  }}
                />
              </Flex>
            ) : isError ? (
              <Image src={ErrorImage} alt={"ErrorImage"} />
            ) : null}
          </Flex>

          <Text
            w={"254px"}
            mt={"46px"}
            px={isConfirming ? "32px" : ""}
            textAlign={"center"}
            fontSize={14}
            fontWeight={500}
          >
            {isConfirming ? (
              "Please confirm transaction in your wallet"
            ) : isConfirmed ? (
              <ChakraLink
                href={`${blockExplorer}/tx/${txHash}`}
                isExternal={true}
                textDecoration={"underline"}
                w={"100%"}
              >
                See your transaction history
              </ChakraLink>
            ) : isError ? (
              "Error occurred, please try again."
            ) : null}
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
