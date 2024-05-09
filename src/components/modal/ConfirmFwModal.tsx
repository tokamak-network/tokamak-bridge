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
  Center,
} from "@chakra-ui/react";
import useFxConfirmModal from "@/hooks/modal/useFxConfirmModal";
import Image from "next/image";
import EthSymbol from "assets/icons/fw/eth_fw.svg";
import ThanosSymbol from "assets/icons/fw/thanos_fw.svg";
import TipSymbol from "assets/icons/fw/tip_fw.svg";
import GasStationSymbol from "assets/icons/fw/gas_station_fw.svg";
import { useState } from "react";

export default function ConfirmFwModal() {
  const { isOpen, onCloseFwConfirmModal } = useFxConfirmModal();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onCloseFwConfirmModal} isCentered>
        <ModalOverlay />
        <ModalContent bg='#1F2128' p={"20px"} borderRadius={"16px"}>
          <ModalHeader
            px={0}
            pt={0}
            pb={"12px"}
            fontSize={"20px"}
            fontWeight={"500"}
            lineHeight={"30px"}
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
                <Text
                  fontSize={"12px"}
                  fontWeight={500}
                  color={"#A0A3AD"}
                  lineHeight={"18px"}
                >
                  Send
                </Text>
                <Box>
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text
                      fontSize={"32px"}
                      fontWeight={600}
                      lineHeight={"48px"}
                    >
                      10 USDC
                    </Text>
                    <Center
                      width='32px'
                      height='32px'
                      bg='#FFFFFF'
                      borderRadius='2px'
                    >
                      <Image src={ThanosSymbol} alt={"ThanosSymbol"} />
                    </Center>
                  </Flex>
                </Box>
                <Text
                  fontWeight={400}
                  fontSize={"14px"}
                  lineHeight={"21px"}
                  color={"#E3E4C0"}
                >
                  <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>
                    (
                  </span>
                  $99.00
                  <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>
                    )
                  </span>
                </Text>
              </Box>
              <Box mt={"24px"}>
                <Text
                  fontSize={"12px"}
                  fontWeight={500}
                  color={"#A0A3AD"}
                  lineHeight={"18px"}
                >
                  Receive
                </Text>
                <Box>
                  <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Text
                      fontSize={"32px"}
                      fontWeight={600}
                      lineHeight={"48px"}
                    >
                      9.988 USDC
                    </Text>
                    <Center
                      width='32px'
                      height='32px'
                      bg='#383736'
                      borderRadius='2px'
                    >
                      <Image src={EthSymbol} alt={"EthSymbol"} />
                    </Center>
                  </Flex>
                </Box>
                <Text
                  fontWeight={400}
                  fontSize={"14px"}
                  lineHeight={"21px"}
                  color={"#E3E4C0"}
                >
                  <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>
                    (
                  </span>
                  $99.00
                  <span style={{ fontSize: "11px", lineHeight: "16.5px" }}>
                    )
                  </span>
                </Text>
              </Box>
              <Box
                mt={"24px"}
                borderTop='1px solid #313442'
                pt={"16px"}
                px={0}
                pb={0}
              >
                <HStack justify='space-between' lineHeight={"18px"}>
                  <Flex>
                    <Text
                      fontWeight={400}
                      fontSize={"12px"}
                      color={"#A0A3AD"}
                      mr={"2px"}
                    >
                      Service fee
                    </Text>
                    <Image src={TipSymbol} alt={"TipSymbol"} />
                  </Flex>
                  <Flex>
                    <Text fontWeight={600} fontSize={"12px"} mx={"4px"}>
                      0.012 USDC
                    </Text>
                    <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
                      <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                        (
                      </span>
                      $0.43
                      <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                        )
                      </span>
                    </Text>
                  </Flex>
                </HStack>
                <HStack justify='space-between' lineHeight={"18px"} mt={"6px"}>
                  <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
                    Network fee
                  </Text>
                  <Flex>
                    <Image src={GasStationSymbol} alt={"GasStationSymbol"} />
                    <Text fontWeight={600} fontSize={"12px"} mx={"4px"}>
                      0.16 TON
                    </Text>
                    <Text fontWeight={400} fontSize={"12px"} color={"#A0A3AD"}>
                      <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                        (
                      </span>
                      $0.43
                      <span style={{ fontSize: "10px", lineHeight: "15px" }}>
                        )
                      </span>
                    </Text>
                  </Flex>
                </HStack>
              </Box>
            </Box>
            <Box mt={"12px"}>
              <Checkbox
                isChecked={isChecked}
                onChange={handleCheckboxChange}
                sx={{
                  ".chakra-checkbox__control": {
                    borderWidth: "1px", // 기본 테두리 두께 설정
                    borderColor: "#A0A3AD", // 기본 테두리 색상 설정
                  },
                  _checked: {
                    "& .chakra-checkbox__control": {
                      borderColor: "#FFFFFF", // 체크 상태의 테두리 색상 변경
                    },
                  },
                }}
                colorScheme='#A0A3AD' // Chakra UI 색상 스키마, 여기서는 기본 스타일을 위해 사용
              >
                <Text
                  color={isChecked ? "#FFFFFF" : "#A0A3AD"}
                  fontWeight={600}
                  fontSize={"13px"}
                  lineHeight={"20px"}
                  letterSpacing={"0.01em"}
                >
                  Estimated Time of Arrival:{" "}
                  <span style={{ color: isChecked ? "#DB00FF" : "#A0A3AD" }}>
                    ~1 day
                  </span>
                </Text>
              </Checkbox>
              <Text
                mt={"5px"}
                color={isChecked ? "#FFFFFF" : "#A0A3AD"}
                pl={"25px"}
                fontWeight={400}
                fontSize={"12px"}
                lineHeight={"20px"}
                letterSpacing={"0.01em"}
              >
                text will be changed
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter p={0} mt={"12px"}>
            <Button
              sx={{
                backgroundColor: isChecked ? "#007AFF" : "#17181D",
                color: isChecked ? "#FFFFFF" : "#8E8E92",
              }}
              width='full'
              height={"48px"}
              borderRadius={"8px"}
              _hover={{}}
            >
              <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                Confirm Cross Trade
              </Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
