import { Flex, Text, Box } from "@chakra-ui/layout";
import { Modal, ModalOverlay, ModalContent, Button } from "@chakra-ui/react";
import ModalCloseButton from "@/assets/icons/close.svg";
import Image from "next/image";
import { usePoolModals } from "@/hooks/modal/usePoolModals";
import commafy from "@/utils/trim/commafy";
import { usePoolContract } from "@/hooks/pool/usePoolContract";
import { usePricePair } from "@/hooks/price/usePricePair";
import { useEffect, useState } from "react";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";
import { useRecoilValue } from "recoil";
import { ATOM_collectWethOption } from "@/recoil/pool/positions";
import useConnectedNetwork from "@/hooks/network";
import { PoolCardDetail } from "../../components/PoolCard";

export default function ClaimEarningsModal(props: { info: PoolCardDetail }) {
  const { info } = props;
  const { isOpen, onClose } = usePoolModals();
  const { collectFees, estimateGasToCollect } = usePoolContract();
  const collectAsWETH = useRecoilValue(ATOM_collectWethOption);

  const token0Amount = Number(commafy(info?.token0CollectedFee, 8, true));
  const token1Amount = Number(commafy(info?.token1CollectedFee, 8, true));

  const { hasTokenPrice, totalMarketPrice, token0Price, token1Price } =
    usePricePair({
      token0Name: info?.token0.name,
      token0Amount,
      token1Name: info?.token1.name,
      token1Amount,
    });

  const [estimatedGasUsageValue, setEstimatedGasUsage] = useState<
    string | undefined
  >(undefined);

  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { layer } = useConnectedNetwork();
  useEffect(() => {
    const fetchData = async () => {
      if (isOpen === "collectFee") {
        const estimatedGas = await estimateGasToCollect();
        return setEstimatedGasUsage(
          smallNumberFormmater(commafy(estimatedGas?.toString(), 2))
        );
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
  }, [isOpen]);

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
              <Box fontSize={20}>Claim Fees</Box>
              <Box onClick={onClose} cursor="pointer" pos={"relative"}>
                <Box pos={"absolute"} w={"24px"} right={"-6px"} top={"-6px"}>
                  <Image src={ModalCloseButton} alt="closeModal" />
                </Box>
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
                <Flex
                  justifyContent="start"
                  alignItems="center"
                  columnGap={"8px"}
                >
                  <TokenSymbolWithNetwork
                    tokenSymbol={
                      info?.token0.symbol === "ETH" && collectAsWETH
                        ? "WETH"
                        : (info?.token0.symbol as string)
                    }
                    chainId={info?.token0.chainId}
                    symbolW={24}
                    symbolH={24}
                    networkSymbolH={12}
                    networkSymbolW={12}
                  />
                  <Text fontSize={16} color="#A0A3AD">
                    {info?.token0.symbol === "ETH" && collectAsWETH
                      ? "WETH"
                      : info?.token0.symbol}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="end"
                  fontSize={16}
                  columnGap={"35px"}
                  textAlign={"right"}
                >
                  <Text fontWeight="semibold">
                    {smallNumberFormmater(info?.token0CollectedFee, 6)}
                  </Text>
                  <Text
                    minW={"60px"}
                    color={"#A0A3AD"}
                  >{`$${token0Price}`}</Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" mb="8px">
                <Flex
                  justifyContent="start"
                  alignItems="center"
                  columnGap={"8px"}
                >
                  <TokenSymbolWithNetwork
                    tokenSymbol={
                      info?.token1.symbol === "ETH" && collectAsWETH
                        ? "WETH"
                        : (info?.token1.symbol as string)
                    }
                    chainId={info?.token1.chainId}
                    symbolW={24}
                    symbolH={24}
                    networkSymbolH={12}
                    networkSymbolW={12}
                  />
                  <Text fontSize={16} color="#A0A3AD">
                    {info?.token1.symbol === "ETH" && collectAsWETH
                      ? "WETH"
                      : info?.token1.symbol}
                  </Text>
                </Flex>
                <Flex
                  justifyContent="end"
                  fontSize={16}
                  columnGap={"35px"}
                  textAlign={"right"}
                >
                  <Text fontWeight="semibold">
                    {smallNumberFormmater(info?.token1CollectedFee, 6)}
                  </Text>
                  <Text
                    minW={"60px"}
                    color={"#A0A3AD"}
                  >{`$${token1Price}`}</Text>
                </Flex>
              </Flex>
              <Box w={"100%"} h={"1px "} bgColor={"#313442"} />
              <Flex justifyContent="space-between" pt="8px">
                <Flex justifyContent="start" alignItems="center">
                  <Text fontSize={14} color="#A0A3AD">
                    {layer === "L1"
                      ? "Estimated gas fee "
                      : "Estimated L2 execution fee"}
                  </Text>
                </Flex>
                <Flex justifyContent="end">
                  <Text fontSize={16} fontWeight="semibold">
                    {`$${estimatedGasUsageValue ?? "-"}`}
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
              onClick={() => {
                setModalOpen("confirming");
                setIsOpen(true);
                onClose();
                collectFees();
              }}
            >
              Claim
            </Button>
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
