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
import useFxOptionModal from "@/components/fw/hooks/useFwOptionModal";
import CloseButton from "@/components/button/CloseButton";
import FwComingOptionDetail from "../../modal/option/FwComingOptionDetail";
import { useRecoilState } from "recoil";
import { confirmWithdrawStats } from "@/recoil/modal/atom";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import useMediaView from "@/hooks/mediaView/useMediaView";
import formatNumber from "@/componenets/fw/utils/formatNumbers";

export default function FwComingModal() {
  const { mobileView } = useMediaView();
  const { fwOptionModal, onCloseFwOptionModal } = useFxOptionModal();
  const [, setWithdrawStatus] = useRecoilState(confirmWithdrawStats);
  const { inToken } = useInOutTokens();

  const handleConfirm = () => {
    setWithdrawStatus({ isOpen: true });
    onCloseFwOptionModal();
  };

  return (
    <Modal
      isOpen={fwOptionModal}
      onClose={onCloseFwOptionModal}
      motionPreset={mobileView ? "slideInBottom" : "none"}
      isCentered={mobileView ? false : true}
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        marginTop={mobileView ? "auto" : undefined}
        marginBottom={mobileView ? "0" : undefined}
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
          <FwComingOptionDetail />
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
                  {formatNumber(inToken?.parsedAmount)} {inToken?.tokenSymbol}
                </Text>
              </Box>
              <Box mt={"12px"}>
                <Text
                  fontSize={"10px"}
                  fontWeight={400}
                  lineHeight={"15px"}
                  color={"#A0A3AD"}
                >
                  Takes up to 24 hours to "prove" and
                </Text>
                <Text
                  fontSize={"10px"}
                  fontWeight={400}
                  lineHeight={"15px"}
                  color={"#A0A3AD"}
                >
                  7 days to "finalize" the withdrawal.
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
            onClick={handleConfirm}
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
