import { transactionModalStatus } from "@/recoil/modal/atom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Link,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import "@/css/spinner.css";
import ConfirmedImage from "assets/image/modal/confirmed.svg";
import ErrorImage from "assets/image/modal/error.svg";

import Check from "assets/image/modal/check.svg";
import CloseButton from "../button/CloseButton";
import useConnectedNetwork from "@/hooks/network";
import { useTransaction } from "@/hooks/tx/useTx";
import { useState } from "react";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useGetMode } from "@/hooks/mode/useGetMode";

export default function Confirmation() {
  // const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  // const isConfirming = modalOpen === "confirming";
  // const isConfirmed = modalOpen === "confirmed";
  // const isError = modalOpen === "error";

  const { blockExplorer } = useConnectedNetwork();
  const { confirmedTransaction } = useTransaction();

  const {
    isConfirmed,
    isConfirming,
    isError,
    isOpen,
    setIsOpen,
    closeModal,
    isClaim,
  } = useTxConfirmModal(true);
  const { mode } = useGetMode();

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
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
            <CloseButton onClick={closeModal} />
          </Flex>
          <Text mt={"26px"} fontSize={18} mb={"41px"}>
            {isConfirming
              ? `Confirming ${mode}`
              : isConfirmed
              ? "Transaction Confirmed!"
              : isError
              ? "Transaction Failed"
              : isClaim
              ? "Confirming Claim"
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
            w={"203px"}
            mt={"46px"}
            px={isConfirming ? "32px" : ""}
            textAlign={"center"}
            fontSize={14}
            fontWeight={500}
          >
            {isConfirming ? (
              "Please confirm transaction in your wallet"
            ) : isConfirmed ? (
              <Link
                href={`${blockExplorer}/tx/${
                  confirmedTransaction &&
                  confirmedTransaction.length > 0 &&
                  confirmedTransaction[confirmedTransaction.length - 1][0]
                }`}
                isExternal={true}
                textDecoration={"underline"}
                w={"100%"}
              >
                See your transaction history
              </Link>
            ) : isError ? (
              "Error occurred, please try again."
            ) : null}
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
