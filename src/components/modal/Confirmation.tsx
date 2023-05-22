import { transactionModalStatus } from "@/recoil/modal/atom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Flex,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

export default function Confirmation() {
  const modalOpen = useRecoilValue(transactionModalStatus);

  console.log(modalOpen);

  return (
    <Modal isOpen={modalOpen === "confirming"} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent
        minW={"100%"}
        maxW={"100%"}
        h={"100%"}
        m={0}
        p={0}
        bg={"transparent"}
      >
        <ModalBody
          minW={"100%"}
          maxW={"100%"}
          h={"100px"}
          m={0}
          p={0}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"end"}
          bg={"transparent"}
          // onClick={onClose}
        >
          <Flex>go</Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
