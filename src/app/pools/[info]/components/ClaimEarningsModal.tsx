import { Flex, Text, Box, Divider } from "@chakra-ui/layout";
import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react";
import ModalCloseButton from "@/assets/icons/close.svg";
import Image from "next/image";
import { usePoolModals } from "@/hooks/modal/usePoolModals";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import commafy from "@/utils/trim/commafy";
import { usePoolContract } from "@/hooks/pool/usePoolContract";
import { usePricePair } from "@/hooks/price/usePricePair";
import { useEstimateGasCollect } from "@/hooks/pool/useEstimateGasPool";
import { useEffect } from "react";
import useBlockNum from "@/hooks/network/useBlockNumber";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  estimatedGasFee,
  estimatedGasUsage,
} from "@/recoil/global/transaction";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";

export default function ClaimEarningsModal() {
  const { isOpen, onClose } = usePoolModals();
  const { info } = usePositionInfo();
  const { collectFees, estimateGasToCollect } = usePoolContract();

  const token0Amount = Number(commafy(info?.token0CollectedFee, 8, true));
  const token1Amount = Number(commafy(info?.token1CollectedFee, 8, true));

  const { hasTokenPrice, totalMarketPrice, token0Price, token1Price } =
    usePricePair({
      token0Name: info?.token0.name,
      token0Amount,
      token1Name: info?.token1.name,
      token1Amount,
    });

  const { blockNumber } = useBlockNum();
  const [estimatedGasUsageValue, setEstimatedGasUsage] =
    useRecoilState(estimatedGasUsage);

  // useEffect(() => {
  //   async function fetchGasUsage() {
  //     const totalGasUsage = await estimateGasToCollect();
  //     console.log("go?");
  //     console.log(totalGasUsage);

  //     setEstimatedGasUsage(totalGasUsage);
  //   }
  //   fetchGasUsage();
  // }, [blockNumber]);

  const { tokenPriceWithAmount } = useGetMarketPrice({
    tokenName: "ethereum",
    amount: estimatedGasUsageValue,
  });

  console.log(estimatedGasUsageValue);

  console.log(tokenPriceWithAmount);

  return (
    <Modal isOpen={isOpen === "collectFee"} onClose={onClose}>
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
          // h="348px"
          p="20px"
          bgColor="#1F2128"
          flexDir="column"
          borderRadius="16px"
        >
          <Flex flexDir="column">
            <Flex justifyContent="space-between" mb="16px">
              <Box>Claim Fees</Box>
              <Box onClick={onClose} cursor="pointer">
                <Image src={ModalCloseButton} alt="closeModal" />
              </Box>
            </Flex>
            {/* Table of total earnings*/}
            <Box
              w="356px"
              // h="170px"
              p={"16px"}
              bgColor="#0F0F12"
              borderRadius="16px"
            >
              {hasTokenPrice && (
                <Flex justifyContent="space-between" mb="9px">
                  <Flex justifyContent="start">
                    <Text fontSize={14}>Total fees</Text>
                  </Flex>
                  <Flex justifyContent="end">
                    <Text fontSize={16} fontWeight="semibold">
                      {`$${totalMarketPrice}`}
                    </Text>
                  </Flex>
                </Flex>
              )}
              <Flex justifyContent="space-between" mb="8px">
                <Flex justifyContent="start" alignItems="center">
                  <Text fontSize={16} color="#A0A3AD" ml="8px">
                    {info?.token0.symbol}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="end"
                  fontSize={16}
                  columnGap={"35px"}
                  textAlign={"right"}
                >
                  <Text fontWeight="semibold">
                    {commafy(info?.token0CollectedFee, 6)}
                  </Text>
                  <Text
                    minW={"60px"}
                    color={"#A0A3AD"}
                  >{`$${token0Price}`}</Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px">
                <Flex justifyContent="start" alignItems="center">
                  <Text fontSize={16} color="#A0A3AD" ml="8px">
                    {info?.token1.symbol}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="end"
                  fontSize={16}
                  columnGap={"35px"}
                  textAlign={"right"}
                >
                  <Text fontWeight="semibold">
                    {commafy(info?.token1CollectedFee, 6)}
                  </Text>
                  <Text
                    minW={"60px"}
                    color={"#A0A3AD"}
                  >{`$${token1Price}`}</Text>
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
              onClick={() => collectFees()}
            >
              Claim
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
