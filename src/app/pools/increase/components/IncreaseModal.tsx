import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";

import Range from "./Range";
import SelectedRange from "./SelectedRange";
import usePreview from "@/hooks/modal/usePreviewModal";
import Title from "../../add/components/Title";
import ActionButton from "../../add/ActionButton";
export default function IncreaseModal() {
  const { isOpen, onClosePreviewModal } = usePreview();

  return (
    <Modal isOpen={isOpen} onClose={onClosePreviewModal} isCentered>
      <ModalOverlay opacity={0.1} />
      <ModalContent
        // h={"100%"}
        w='404px'
        bg={"#1F2128"}
        p='20px'
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
        rowGap={'16px'}
      >
        <Title title="Increase Liquidity" style={{fontSize:'20px', fontWeight:500}}/>
        <Range style={{background: '#0F0F12'}} />
        <SelectedRange />
        <ActionButton/>
      </ModalContent>
    </Modal>
  );
}
