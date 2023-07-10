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
import SelectedRange from "../increase/components/SelectedRange";
import usePreview from "@/hooks/modal/usePreviewModal";
import Title from "../add/components/Title";
import ActionButton from "../add/ActionButton";
import CloseButton from "@/components/button/CloseButton";

export default function IncreaseModal() {
  const { isOpen, onClosePreviewModal,poolModal } = usePreview();  
  return (
    <Modal isOpen={isOpen && poolModal === 'increaseLiquidity'} onClose={onClosePreviewModal} isCentered>
      <ModalOverlay opacity={0.1} bg="blackAlpha.900"  />
      <ModalContent
        // h={"100%"}
        w="404px"
        bg={"#1F2128"}
        p="20px"
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
        rowGap={"16px"}
      >
        <Flex alignItems={'flex-start'} w='100%'>
        <Title
          title="Increase Liquidity"
          style={{ fontSize: "20px", fontWeight: 500 }}
        />
        <Box pos={"absolute"} right={'15px'} top={"15px"}>
              <CloseButton onClick={onClosePreviewModal} />
            </Box>
        </Flex>
      
        <Range style={{ background: "#0F0F12" }} page="Increase" />
        <SelectedRange  show={false}/>
        <ActionButton actionName="Increase" page={'Increase'}/>
      </ModalContent>
    </Modal>
  );
}
