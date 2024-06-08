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
import useSwapConfirm from "@/components/confirmn/hooks/useSwapConfirmModal";
import TimeLine from "./TimeLine";
import CloseButton from "@/components/button/CloseButton";

export default function SwapConfirmModal() {
  const { swapConfirmModal, onCloseSwapConfirmModal } = useSwapConfirm();

  return (
    <Modal
      isOpen={swapConfirmModal}
      onClose={onCloseSwapConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Confirm Withdraw
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseSwapConfirmModal} />
        </Box>
        <ModalBody p={0}>
          {/** 첫번째 박스 */}
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            bg='#0F0F12'
          >
            {/** Box안 fLEX 두번 반복 */}
            <Box>
              <Flex>
                <Box>
                  <Text>Send</Text>
                  <Flex>
                    <Box>Image titan logo</Box>
                    <Text>Titan</Text>
                  </Flex>
                </Box>
                <Box>
                  <Flex>
                    <Box>Image eth</Box>
                    <Box>
                      <Flex>2.0123409 ETH</Flex>
                      <Box>Image tx</Box>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Box>
            {/** BORDER TOP 경계 그려진다. */}
            <Box borderTop='1px solid #313442'>
              {/** 해당 fLEX 두번 반복 */}
              <Flex>
                <Text>Bridge</Text>
                <Flex>
                  <Box>Image titan logo</Box>
                  <Text>Titan Standard bridge</Text>
                </Flex>
              </Flex>
            </Box>
          </Box>
          {/** 두번째 박스 */}
          <Box px={"20px"} py={"16px"} borderRadius={"8px"} bg='#15161D'>
            <Flex>
              <Box>
                <TimeLine />
              </Box>
              <Box ml={"10px"}>
                <Flex>
                  <Text>Initiate</Text>
                  <Flex>
                    <Text>Transaction</Text>
                    <Box>Image transaction</Box>
                  </Flex>
                </Flex>
                <Flex>
                  <Text>Rollup</Text>
                  <Flex>
                    <Text>Transaction</Text>
                    <Box>Image transaction</Box>
                  </Flex>
                </Flex>
                <Box
                  pl={"12px"}
                  pr={"210px"}
                  py={"3px"}
                  borderRadius={"4px"}
                  bg={"#1F2128"}
                >
                  <Flex>
                    <Text>84 : 00 : 00</Text>
                    <Box>Image google calender</Box>
                  </Flex>
                </Box>
                <Flex>
                  <Text>Finalize</Text>
                  <Box>
                    <Flex>
                      <Box>Image gasstation</Box>
                      <Text>0.0099 ETH</Text>
                    </Flex>
                    <Text>$30.63</Text>
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </Box>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          footer
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
