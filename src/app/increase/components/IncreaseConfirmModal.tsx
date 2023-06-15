import { Flex, Text, Box, Divider } from "@chakra-ui/layout";
import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react";
import TokenSymbolPair from "@/components/ui/TokenSymbolPair";
import ModalCloseButton from "@/assets/icons/close.svg";
import Image from "next/image";
import TokenNetwork from "@/components/ui/TokenNetwork";
import PriceRange from "../../../components/ui/PriceRange";

type IncreaseConfirmProps = {
  isOpen: boolean;
  onClose: () => void;
  inRange: boolean;
};

export default function RemoveConfirmModal({
  isOpen,
  onClose,
  inRange,
}: IncreaseConfirmProps) {
  const DivisionLine = () => {
    return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"14px"}></Box>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="rgba(15, 15, 18, 1)" />
      <ModalContent
        h="100%"
        bg="transparent"
        justifyContent="center"
        alignItems="center"
        m={0}
      >
        <Flex
          w="404px"
          p="20px"
          bgColor="#1F2128"
          flexDir="column"
          borderRadius="16px"
        >
          <Flex flexDir="column">
            <Flex justifyContent="space-between" mb="16px">
              <Box>Increase Liquidity</Box>
              <Box onClick={onClose} cursor="pointer">
                <Image src={ModalCloseButton} alt="closeModal" />
              </Box>
            </Flex>
            <Flex
              flexDir="column"
              border="3px solid #383736"
              w="364px"
              py="17px"
              px="16px"
              bgColor="#0F0F12"
              borderRadius="16px"
            >
              <Flex mb={"12px"}>
                <Flex alignItems={"center"}>
                  <Text fontWeight="bold" fontSize="23px">
                    {/* {props.in.symbol} / {props.out.symbol} */}
                    ETH / USDC
                  </Text>
                  {/* <Text fontSize={"12px"}>{props.slippage}</Text> */}
                  <Flex bgColor={"#1F2128"} borderRadius={8} p={1} ml={2}>
                    <Text fontSize={"12px"} as="b">
                      {"0.30%"}
                    </Text>
                  </Flex>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"center"}>
                  {inRange === false ? (
                    <>
                      <Box
                        w="6px"
                        h="6px"
                        borderRadius="50%"
                        bg="#DD3A44"
                        mr="6px"
                        ml="20px"
                      />
                      <Text fontSize="14px" fontWeight="600" color="#DD3A44">
                        Out of Range
                      </Text>
                    </>
                  ) : (
                    <>
                      <Box
                        w="6px"
                        h="6px"
                        borderRadius="50%"
                        bg="#00EE98"
                        mr="6px"
                        ml="61px"
                      />
                      <Text fontSize="14px" fontWeight="600" color="#00EE98">
                        In Range
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>

              <Flex
                alignItems="center"
                textAlign="center"
                left="20px"
                justifyContent={"center"}
                mb={"16px"}
              >
                <TokenSymbolPair
                  tokenType1={"ETH"}
                  tokenType2={"USDC"}
                  network="Ethereum"
                  w={64}
                  h={64}
                  w2={20}
                  h2={20}
                  groupWidth={64}
                />
              </Flex>
              <Flex direction="column" fontSize={"16px"} line-height={"20px"}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">ETH</Text>
                  <Flex>
                    <Text marginLeft="2" color={"#A0A3AD"}>
                      0.001403
                    </Text>
                    <Text marginLeft="2">+0.001403</Text>
                  </Flex>
                </Flex>
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">USDC</Text>
                  <Flex>
                    <Text marginLeft="2" color={"#A0A3AD"}>
                      0.001403
                    </Text>
                    <Text marginLeft="2">+0.001403</Text>
                  </Flex>
                </Flex>
                <DivisionLine />
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">Estimated gas fees</Text>
                  <Text marginLeft="2">$4.33</Text>
                </Flex>
              </Flex>
            </Flex>
            <Flex flexDir={"column"} mt="20px">
              <PriceRange
                title={"Selected Range"}
                inToken="ETH"
                outToken="USDC"
                minPrice={772.84}
                maxPrice={772.84}
                currentPrice={772.84}
                inRange={true}
                w={"362px"}
              />
            </Flex>
            <Button
              w="364px"
              h="48px"
              mt="16px"
              bgColor="#007AFF"
              _hover={{ bgColor: "#007AFF" }}
            >
              Increase
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
