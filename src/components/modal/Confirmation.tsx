import { transactionModalStatus } from "@/recoil/modal/atom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import "@/css/spinner.css";
import ConfirmedImage from "assets/image/modal/confirmed.svg";
import Check from "assets/image/modal/check.svg";
import CloseButton from "../button/CloseButton";

export default function Confirmation() {
  const [modalOpen, setModalOpen] = useRecoilState(transactionModalStatus);
  const isConfirming = modalOpen === "confirming";

  return (
    <Modal isOpen={modalOpen !== null} onClose={() => setModalOpen(null)}>
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
          h={"340px"}
          bgColor={"#1f2128"}
          borderRadius={"16px"}
          flexDir={"column"}
          alignItems={"center"}
        >
          <Flex w={"100%"} justifyContent={"flex-end"} pt={"14px"} pr={"14px"}>
            <CloseButton onClick={() => setModalOpen(null)} />
          </Flex>
          <Text mt={"26px"} fontSize={18} mb={"41px"}>
            {isConfirming ? "Confirming Deposit" : "Transaction Initiated!"}
          </Text>
          <Flex pos={"relative"} w={"100%"} justifyContent={"center"}>
            {isConfirming ? (
              <Box w={"96px"} h={"96px"} className="loading2 spinner2"></Box>
            ) : (
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
            )}
          </Flex>
          <Text
            mt={"46px"}
            px={isConfirming ? "32px" : ""}
            textAlign={"center"}
            fontSize={14}
            fontWeight={500}
          >
            {isConfirming
              ? "Please confirm transaction in your wallet"
              : "See your transaction history"}
          </Text>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
