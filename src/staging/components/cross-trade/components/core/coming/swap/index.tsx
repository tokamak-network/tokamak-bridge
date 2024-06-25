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
  Flex,
  Circle,
} from "@chakra-ui/react";
import useCTOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import CloseButton from "@/components/button/CloseButton";
import CTComingOptionDetail from "@/staging/components/cross-trade/components/core/coming/swap/CTComingOptionDetail";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { FormatNumber } from "@/staging/components/common/FormatNumber";
import { Action, Status } from "@/staging/types/transaction";
import { useHandleConfirm } from "@/staging/components/new-confirm/hooks/useDepositWithdrawHandleConfirm";

export default function CTComingModal() {
  const { tabletView } = useMediaView();

  const { ctOptionModal, onCloseCTOptionModal } = useCTOptionModal();
  const { inToken } = useInOutTokens();

  const handleConfirm = useHandleConfirm();

  const handleClickConfirm = () => {
    handleConfirm(Action.Withdraw, Status.Initiate);
    onCloseCTOptionModal();
  };

  return (
    <Modal
      isOpen={ctOptionModal}
      onClose={onCloseCTOptionModal}
      motionPreset={tabletView ? "slideInBottom" : "none"}
      isCentered={tabletView ? false : true}
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        marginTop={tabletView ? "auto" : undefined}
        marginBottom={tabletView ? "0" : undefined}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Withdraw Option
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseCTOptionModal} />
        </Box>
        <ModalBody p={0}>
          <CTComingOptionDetail />
          <Flex
            alignItems='center'
            justifyContent='space-between'
            mt={"12px"}
            border={"1px solid #007AFF"}
            py={"16px"}
            px={"20px"}
            borderRadius={"8px"}
            cursor={"pointer"}
          >
            <Box>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Official Standard Bridge
              </Text>
              <Box mt={"12px"}>
                <Flex alignItems='center'>
                  <Text
                    fontWeight={400}
                    fontSize={"10px"}
                    lineHeight={"20px"}
                    color={"#A0A3AD"}
                  >
                    Receive
                  </Text>
                </Flex>
                <Text
                  fontWeight={600}
                  fontSize={"22px"}
                  lineHeight={"33px"}
                  color={"#007AFF"}
                >
                  <FormatNumber
                    style={{
                      fontWeight: 600,
                      fontSize: "22px",
                      lineHeight: "33px",
                      color: "#007AFF",
                    }}
                    value={inToken?.parsedAmount}
                    tokenSymbol={inToken?.tokenSymbol}
                  />
                </Text>
              </Box>
              <Box mt={"12px"}>
                <Text
                  fontSize={"10px"}
                  fontWeight={400}
                  lineHeight={"15px"}
                  color={"#A0A3AD"}
                >
                  Takes up to 6 hours to "rollup" and
                  <br />7 days to "finalize" the withdrawal.
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
                  height={"29px"}
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
                  days
                </Text>
              </Box>
            </Circle>
          </Flex>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            mt={"12px"}
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: "#007AFF",
              color: "#FFFFFF",
            }}
            _active={{}}
            _hover={{}}
            _focus={{}}
            onClick={handleClickConfirm}
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
