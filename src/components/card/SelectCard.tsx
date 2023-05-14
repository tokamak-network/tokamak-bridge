import { InTokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { Button, Flex, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

export function SelectCardButton() {
  const [inTokenModal, setInTokenModal] = useRecoilState(InTokenModalStatus);
  return (
    <Flex
      w={"562px"}
      h={"100px"}
      bgColor={"#17181D"}
      alignItems={"center"}
      justifyContent={"center"}
      cursor={"pointer"}
      onClick={() => setInTokenModal({ isOpen: true, modalData: null })}
    >
      <Text color={"#FFFFFF"} fontSize={24} fontWeight={"semibold"}>
        Select Token
      </Text>
    </Flex>
  );
}

export function SelectCardModal() {
  const [inTokenModal, setInTokenModal] = useRecoilState(InTokenModalStatus);
  const onClose = () => {
    setInTokenModal({ isOpen: false, modalData: null });
  };

  return (
    <Modal isOpen={inTokenModal.isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
}
