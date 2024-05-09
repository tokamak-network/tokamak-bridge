import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  Box,
  Text,
  Divider,
  HStack,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import useFxConfirmModal from "@/hooks/modal/useFxConfirmModal";
import ThanosSymbol from "assets/icons/fw/thanos_fw.svg";

export default function ConfirmCrossModal() {
  const { isOpen, onCloseFwConfirmModal } = useFxConfirmModal();
  console.log(isOpen);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onCloseFwConfirmModal}>
        <ModalOverlay />
        <ModalContent bg='#1F2128' p={"20px"}>
          <ModalHeader
            px={0}
            pt={0}
            pb={"12px"}
            fontSize={"20px"}
            fontWeight={"500"}
          >
            Confirm Cross Trade
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0}>
            <Box
              bg='#15161D'
              px={"20px"}
              py={"16px"}
              border={"1px, 1px, 0px, 1px"}
              borderRadius={"8px"}
            >
              <Box>
                <Text fontWeight='semibold'>Send</Text>
                <Box>
                  <Text>10 USDC</Text>
                </Box>
                <Text>($99.00)</Text>
              </Box>
              <Box>
                <Text fontWeight='semibold'>Receive</Text>
                <Text>9.988 USDC ($99.00)</Text>
              </Box>
              <Divider />
              <HStack justify='space-between'>
                <Text>Service fee</Text>
                <Text>0.012 USDC ($0.43)</Text>
              </HStack>
              <HStack justify='space-between'>
                <Text>Network fee</Text>
                <Text>0.16 TON ($0.43)</Text>
              </HStack>
            </Box>
            <Box>
              <Checkbox colorScheme='blue'>
                <Text fontSize='sm'>Estimated Time of Arrival: ~1 day</Text>
              </Checkbox>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue'>Confirm Cross Trade</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
