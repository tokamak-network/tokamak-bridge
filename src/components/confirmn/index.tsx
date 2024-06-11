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
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { trimAddress } from "@/utils/trim";
import { Network, Action } from "@/components/historyn/types";
import useSwapConfirm from "@/components/confirmn/hooks/useSwapConfirmModal";
import TimeLine from "./TimeLine";
import CloseButton from "@/components/button/CloseButton";
import NetworkSymbol from "@/components/confirmn/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { FwTooltip } from "@/components/fw/components/FwTooltip";
import ConfirmDetails from "@/components/confirmn/ConfirmDetails";
import TxLink from "@/assets/icons/confirm/link.svg";
import GasStationSymbol from "assets/icons/confirm/gas-station.svg";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import { STATUS_CONFIG } from "@/components/historyn/constants";
import StatusComponent from "@/components/confirmn/StatusComponent";
import ConditionalBox from "@/components/confirmn/ConditionalBox";

export default function SwapConfirmModal() {
  const { swapConfirmModal, onCloseSwapConfirmModal } = useSwapConfirm();
  const { address } = useAccount();

  if (!swapConfirmModal.transaction) {
    return null;
  }

  const statuses =
    swapConfirmModal.transaction.action === Action.Withdraw
      ? STATUS_CONFIG.WITHDRAW
      : STATUS_CONFIG.DEPOSIT;

  return (
    <Modal
      isOpen={swapConfirmModal.isOpen}
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
            Confirm{" "}
            {swapConfirmModal.transaction?.action === Action.Withdraw
              ? "Withdraw"
              : "Deposit"}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseSwapConfirmModal} />
        </Box>
        <ModalBody p={0}>
          {/** 첫번째 박스 @Box1 */}
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bg='#0F0F12'
          >
            {/** Box안 fLEX 두번 반복 @Repeat1 */}
            <Box>
              <ConfirmDetails
                isInNetwork={true}
                transactionHistory={swapConfirmModal.transaction}
              />
              <ConfirmDetails
                isInNetwork={false}
                transactionHistory={swapConfirmModal.transaction}
              />
            </Box>
            {/** BORDER TOP 경계 그려진다. */}
            <Box borderTop='1px solid #313442' mt={"16px"} pt={"16px"}>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text
                  fontWeight={400}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  Bridge
                </Text>
                <Flex>
                  <NetworkSymbol
                    networkI={Network.Titan}
                    networkH={16}
                    networkW={16}
                  />
                  <Text
                    ml={"4px"}
                    fontWeight={500}
                    fontSize={"12px"}
                    lineHeight={"18px"}
                    color={"#FFFFFF"}
                  >
                    Titan Standard bridge
                  </Text>
                </Flex>
              </Flex>
              <Flex
                mt={"6px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text
                  fontWeight={400}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#A0A3AD"}
                >
                  {swapConfirmModal.transaction?.action === Action.Withdraw
                    ? "Withdraw"
                    : "Deposit"}
                  {/** Add a space */ " "}
                  to
                </Text>
                <Text
                  fontWeight={600}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#FFFFFF"}
                >
                  {trimAddress({ address: address, firstChar: 6 })}
                </Text>
              </Flex>
            </Box>
          </Box>
          {/** 두번째 박스 @Box2 */}
          <Box
            my={"12px"}
            px={"20px"}
            py={"16px"}
            borderRadius={"8px"}
            bg='#15161D'
          >
            <Flex>
              {/** 타임라인 @TimeLine */}
              <Box>
                <TimeLine />
              </Box>
              <Box ml={"10px"}>
                {/** 내부 반복 @inrepeat1 */}
                <StatusComponent />
                {/** @Box1 */}
                <ConditionalBox type='wait' />
                {/** 내부 반복 @inrepeat2 */}
                <StatusComponent />
                {/** 내부 반복 @inrepeat2 */}
                {/** @Box2 */}
                <ConditionalBox type='timer' />
                {/** 내부 반복 @inrepeat3 */}
                <StatusComponent />
                {/* <Flex
                  h={"38px"}
                  justifyContent={"space-between"}
                  alignItems={"flex-start"}
                >
                  <Text
                    fontWeight={600}
                    fontSize={"17px"}
                    lineHeight={"20px"}
                    color={"#A0A3AD"}
                  >
                    Finalize
                  </Text>
                  <Box>
                    <Flex alignItems={"center"}>
                      <Flex
                        w={"14px"}
                        h={"16px"}
                        px={"0.88px"}
                        py={"1px"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <Image
                          src={GasStationSymbol}
                          alt={"GasStationSymbol"}
                        />
                      </Flex>
                      <Text
                        ml={"6px"}
                        fontWeight={400}
                        fontSize={"14px"}
                        lineHeight={"20px"}
                        color={"#A0A3AD"}
                      >
                        0.0099 ETH
                      </Text>
                    </Flex>
                    <Text
                      fontWeight={400}
                      fontSize={"11px"}
                      lineHeight={"16.5px"}
                      color={"#A0A3AD"}
                      textAlign='right'
                    >
                      $30.63
                    </Text>
                  </Box>
                </Flex> */}
              </Box>
            </Flex>
          </Box>
          <Box my={"12px"}>
            <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
              Estimated Time of Arrival: ~1 day
            </Text>
            <Text fontWeight={400} fontSize={"13px"} lineHeight={"20px"}>
              Estimated Time of Arrival: ~1 day
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter p={0} display='block'>
          <Button
            width='full'
            height={"48px"}
            borderRadius={"8px"}
            sx={{
              backgroundColor: "#17181D",
              color: "#8E8E92",
            }}
            _active={{}}
            _hover={{}}
            _focus={{}}
          >
            <Flex alignItems={"center"}>
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Finalize
              </Text>
              <FwTooltip
                tooltipLabel={"text will be changed"}
                style={{ marginLeft: "2px" }}
              />
            </Flex>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
