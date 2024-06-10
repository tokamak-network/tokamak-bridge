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
import { Network } from "@/components/historyn/types";
import useSwapConfirm from "@/components/confirmn/hooks/useSwapConfirmModal";
import TimeLine from "./TimeLine";
import CloseButton from "@/components/button/CloseButton";
import NetworkSymbol from "@/components/confirmn/components/NetworkSymbol";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { FwTooltip } from "@/components/fw/components/FwTooltip";
import TxLink from "@/assets/icons/confirm/link.svg";
import GasStationSymbol from "assets/icons/fw/gas_station_fw.svg";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";

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
          {/** 첫번째 박스 @Box1 */}
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            bg='#0F0F12'
          >
            {/** Box안 fLEX 두번 반복 @Repeat1 */}
            <Box>
              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Box>
                  <Text
                    fontWeight={500}
                    fontSize={"12px"}
                    lineHeight={"21px"}
                    color={"#FFFFFF"}
                  >
                    Send
                  </Text>
                  <Flex mt={"4px"}>
                    <NetworkSymbol
                      networkI={Network.Titan}
                      networkH={14}
                      networkW={14}
                    />
                    <Text
                      ml={"6px"}
                      fontWeight={400}
                      fontSize={"11px"}
                      lineHeight={"14px"}
                      color={"#A0A3AD"}
                    >
                      Ethereum
                    </Text>
                  </Flex>
                </Box>
                <Box>
                  <Flex>
                    <Flex alignItems={"center"}>
                      <TokenSymbol w={24} h={24} tokenType={"ETH"} />
                    </Flex>
                    <Box ml={"6px"}>
                      <Flex>
                        <Text
                          mr={"6px"}
                          fontWeight={600}
                          fontSize={"16px"}
                          lineHeight={"24px"}
                          color={"#FFFFFF"}
                        >
                          2.0123409 ETH
                        </Text>
                        <Flex alignItems={"center"}>
                          <Image src={TxLink} alt={"TxLink"} />
                        </Flex>
                      </Flex>
                      <Text
                        fontWeight={400}
                        fontSize={"12px"}
                        lineHeight={"18px"}
                        color={"#A0A3AD"}
                      >
                        $000.00
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
              {/** Box안 fLEX 두번 반복 @Repeat2 */}
              <Flex
                mt={"16px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Box>
                  <Text
                    fontWeight={500}
                    fontSize={"12px"}
                    lineHeight={"21px"}
                    color={"#FFFFFF"}
                  >
                    Receive
                  </Text>
                  <Flex mt={"4px"}>
                    <NetworkSymbol
                      networkI={Network.Mainnet}
                      networkH={14}
                      networkW={14}
                    />
                    <Text
                      ml={"6px"}
                      fontWeight={400}
                      fontSize={"11px"}
                      lineHeight={"14px"}
                      color={"#A0A3AD"}
                    >
                      Titan
                    </Text>
                  </Flex>
                </Box>
                <Box>
                  <Flex>
                    <Flex alignItems={"center"}>
                      <TokenSymbol w={24} h={24} tokenType={"ETH"} />
                    </Flex>
                    <Box ml={"6px"}>
                      <Flex>
                        <Text
                          mr={"6px"}
                          fontWeight={600}
                          fontSize={"16px"}
                          lineHeight={"24px"}
                          color={"#FFFFFF"}
                        >
                          2.0123409 ETH
                        </Text>
                        <Flex alignItems={"center"}>
                          <Image src={TxLink} alt={"TxLink"} />
                        </Flex>
                      </Flex>
                      <Text
                        fontWeight={400}
                        fontSize={"12px"}
                        lineHeight={"18px"}
                        color={"#A0A3AD"}
                      >
                        $000.00
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            {/** BORDER TOP 경계 그려진다. */}
            <Box borderTop='1px solid #313442' mt={"16px"} pt={"16px"}>
              {/** 해당 fLEX 두번 반복 @Repeat1 */}
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
              {/** 해당 fLEX 두번 반복 @Repeat2 */}
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
                  Withdraw to
                </Text>
                <Text
                  fontWeight={600}
                  fontSize={"12px"}
                  lineHeight={"18px"}
                  color={"#FFFFFF"}
                >
                  0x1234...1234
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
                <Flex
                  h={"38px"}
                  justifyContent={"space-between"}
                  alignItems={"flex-start"}
                  mb={"24px"}
                >
                  <Text
                    fontWeight={600}
                    fontSize={"17px"}
                    lineHeight={"20px"}
                    color={"#A0A3AD"}
                  >
                    Initiate
                  </Text>
                  <Flex alignItems={"center"}>
                    <Text
                      mr={"4px"}
                      fontWeight={400}
                      fontSize={"13px"}
                      lineHeight={"20px"}
                      color={"#A0A3AD"}
                    >
                      Transaction
                    </Text>
                    <Flex w={"14px"} h={"14px"}>
                      <Image src={TxLink} alt={"TxLink"} />
                    </Flex>
                  </Flex>
                </Flex>
                {/** 내부 반복 @inrepeat2 */}
                <Flex
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
                    Rollup
                  </Text>
                  <Flex alignItems={"center"}>
                    <Text
                      mr={"4px"}
                      fontWeight={400}
                      fontSize={"13px"}
                      lineHeight={"20px"}
                      color={"#A0A3AD"}
                    >
                      Transaction
                    </Text>
                    <Flex w={"14px"} h={"14px"}>
                      <Image src={TxLink} alt={"TxLink"} />
                    </Flex>
                  </Flex>
                </Flex>
                <Box
                  mt={"3px"}
                  mb={"21px"}
                  pl={"12px"}
                  pr={"210px"}
                  py={"3px"}
                  borderRadius={"4px"}
                  bg={"#1F2128"}
                >
                  <Flex alignItems={"center"}>
                    <Text
                      fontWeight={600}
                      fontSize={"11px"}
                      lineHeight={"22px"}
                    >
                      84 : 00 : 00
                    </Text>
                    <Flex
                      w={"18px"}
                      h={"18px"}
                      ml={"6px"}
                      justifyContent={"center"}
                    >
                      <Image src={GoogleCalendar} alt={"GoogleCalendar"} />
                    </Flex>
                  </Flex>
                </Box>
                {/** 내부 반복 @inrepeat3 */}
                <Flex
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
                      <Flex w={"12.25px"} h={"14px"}>
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
                    {/**오른쪽으로 붙이고 싶어 */}
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
                </Flex>
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
