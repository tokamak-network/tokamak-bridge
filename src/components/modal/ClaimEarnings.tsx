import { Flex, Text, Box, Divider } from "@chakra-ui/layout";
import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react";
import TokenSymbolPair from "@/components/ui/TokenSymbolPair";
import ModalCloseButton from "@/assets/icons/close.svg";
import Image from "next/image";
import TokenNetwork from "@/components/ui/TokenNetwork";

type ClaimEarningProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ClaimEarningsModal({
  isOpen,
  onClose,
}: ClaimEarningProps) {
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
          h="348px"
          p="20px"
          bgColor="#1F2128"
          flexDir="column"
          borderRadius="16px"
        >
          <Flex flexDir="column">
            <Flex justifyContent="space-between" mb="16px">
              <Box>Claim Earnings</Box>
              <Box onClick={onClose} cursor="pointer">
                <Image src={ModalCloseButton} alt="closeModal" />
              </Box>
            </Flex>
            {/* Table of total earnings*/}
            <Box
              w="356px"
              h="170px"
              py="17px"
              px="16px"
              bgColor="#0F0F12"
              borderRadius="16px"
            >
              <Flex justifyContent="space-between" mb="9px">
                <Flex justifyContent="start">
                  <Text fontSize={14}>Total earnings</Text>
                </Flex>
                <Flex justifyContent="end">
                  <Text fontSize={16} fontWeight="semibold">
                    $4.34
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px">
                <Flex justifyContent="start" alignItems="center">
                  <TokenNetwork
                    network="Ethereum"
                    tokenType="ETH"
                    groupWidth={24}
                  />
                  <Text fontSize={16} color="#A0A3AD" ml="8px">
                    ETH
                  </Text>
                </Flex>
                <Flex justifyContent="end">
                  <Text fontSize={16} fontWeight="semibold">
                    0.001403
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px">
                <Flex justifyContent="start" alignItems="center">
                  <TokenNetwork
                    network="Ethereum"
                    tokenType="USDC"
                    groupWidth={24}
                  />
                  <Text fontSize={16} color="#A0A3AD" ml="8px">
                    USDC
                  </Text>
                </Flex>
                <Flex justifyContent="end">
                  <Text fontSize={16} fontWeight="semibold">
                    0.001403
                  </Text>
                </Flex>
              </Flex>
              <Divider style={{ border: "1px solid #313442" }} />
              <Flex justifyContent="space-between" pt="8px">
                <Flex justifyContent="start" alignItems="center">
                  <Text fontSize={14} color="#A0A3AD">
                    Estimated gas fees
                  </Text>
                </Flex>
                <Flex justifyContent="end">
                  <Text fontSize={16} fontWeight="semibold">
                    $4.34
                  </Text>
                </Flex>
              </Flex>
            </Box>
            {/* Info */}
            <Text color="#A0A3AD" fontSize="12px" mt="16px">
              Collecting fees will withdraw current available fees for you.
            </Text>
            <Button
              w="364px"
              h="48px"
              mt="16px"
              bgColor="#007AFF"
              _hover={{ bgColor: "#007AFF" }}
            >
              Collect
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
