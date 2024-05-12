import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Button,
  Circle,
  Flex,
} from "@chakra-ui/react";
import useFxOptionModal from "@/components/fw/hooks/useFwOptionModal";
import CloseButton from "@/componenets/button/CloseButton";
import useFxConfirmModal from "@/components/fw/hooks/useFwConfirmModal";
import { ModalType } from "@/types/fw";
import Image from "next/image";

export default function FwOptionModal() {
  const { fwOptionModal, onCloseFwOptionModal } = useFxOptionModal();
  const { onOpenFwConfirmModal } = useFxConfirmModal();

  const handleConfirm = () => {
    console.log("next");
    onCloseFwOptionModal();
    onOpenFwConfirmModal(ModalType.Trade);
  };

  return (
    <Modal isOpen={fwOptionModal} onClose={onCloseFwOptionModal} isCentered>
      <ModalOverlay />
      <ModalContent
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        width='404px'
        height='480px'
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Withdraw Option
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseFwOptionModal} />
        </Box>
        <ModalBody p={0}>
          <Flex alignItems='center' justifyContent='space-between'>
            <Box>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Cross Trade Bridge
              </Text>
              <Box
                mt={"13px"}
                bg={"#3C2D31"}
                borderRadius={"8px"}
                gap={"8px"}
                px={"10px"}
                py={"16px"}
              >
                <Text
                  fontWeight={600}
                  fontSize={"16px"}
                  lineHeight={"24px"}
                  color={"#DB00FF"}
                  textAlign='center'
                >
                  Coming soon
                </Text>
              </Box>
              <Box mt={"20px"}>
                <Text fontSize={"10px"} fontWeight={400} lineHeight={"15px"}>
                  It can be received faster depending on
                </Text>
                <Text fontSize={"10px"} fontWeight={400} lineHeight={"15px"}>
                  the liquidity provider situation
                </Text>
              </Box>
            </Box>
            <Circle
              size='56px'
              border='1px solid #DB00FF'
              bg='#15161D'
              pb={"8px"}
              pt={"6px"}
            >
              <Box>
                <Text
                  fontWeight={600}
                  fontSize={"22px"}
                  lineHeight={"33px"}
                  letterSpacing={"-0.05em"}
                  color={"#DB00FF"}
                  textAlign='center'
                >
                  ?
                </Text>
                <Text
                  fontWeight={400}
                  fontSize={"10px"}
                  lineHeight={"15px"}
                  color={"#DB00FF"}
                  textAlign='center'
                >
                  day
                </Text>
              </Box>
            </Circle>
          </Flex>
          <Flex
            alignItems='center'
            justifyContent='space-between'
            mt={"12px"}
            border='1px solid #007AFF'
          >
            <Box>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Official Standard Bridge
              </Text>
              <Box>
                <Text>Receive</Text>
                <Text>10.00 USDC</Text>
              </Box>
              <Box mt={"20px"}>
                <Text fontSize={"10px"} fontWeight={400} lineHeight={"15px"}>
                  Crosstrade is a common bridge service.
                </Text>
                <Text fontSize={"10px"} fontWeight={400} lineHeight={"15px"}>
                  Network fee is more expensive than service fee
                </Text>
              </Box>
            </Box>
            <Circle
              size='56px'
              border='1px solid #007AFF'
              bg='#15161D'
              pb={"8px"}
              pt={"6px"}
            >
              <Box>
                <Text
                  fontWeight={600}
                  fontSize={"22px"}
                  lineHeight={"33px"}
                  letterSpacing={"-0.05em"}
                  color={"#007AFF"}
                  textAlign='center'
                >
                  7
                </Text>
                <Text
                  fontWeight={400}
                  fontSize={"10px"}
                  lineHeight={"15px"}
                  color={"#007AFF"}
                  textAlign='center'
                >
                  day
                </Text>
              </Box>
            </Circle>
          </Flex>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            onClick={handleConfirm}
            sx={{
              backgroundColor: "#007AFF",
              color: "#FFFFFF",
            }}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            _hover={{}}
          >
            <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
              Next
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
