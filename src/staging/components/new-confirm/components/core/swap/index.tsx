import React, { useMemo, useState } from "react";
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
import useSwapConfirm from "@/staging/components/new-confirm/hooks/useSwapConfirmModal";
import CloseButton from "@/components/button/CloseButton";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import ConfirmDetails from "@/staging/components/new-confirm/components/core/swap/ConfirmDetail";
import ConfirmSubDetail, {
  ConfirmDetailType,
} from "@/staging/components/new-confirm/components/core/swap/ConfirmSubDetail";
import usePriceImpact from "@/hooks/swap/usePriceImpact";
import formatNumber from "@/staging/utils/formatNumbers";
import { useGasFee } from "@/hooks/contracts/fee/getGasFee";
import { useGetMarketPrice } from "@/hooks/price/useGetMarketPrice";
import { getGasCostText } from "@/utils/number/compareNumbers";
import { useAmountOut } from "@/hooks/swap/useSwapTokens";
import useIsLoading from "@/hooks/ui/useIsLoading";
import { useSmartRouter } from "@/hooks/uniswap/useSmartRouter";
import useCallBridgeSwapAction from "@/hooks/contracts/useCallBridgeSwapActions";
import commafy from "@/utils/trim/commafy";
import ApproveButton from "../other/ApproveButton";
import { useApprove } from "@/hooks/token/useApproval";

export default function SwapConfirmModal() {
  const { swapConfirmModal, onCloseSwapConfirmModal } = useSwapConfirm();
  const { inToken, outToken } = useInOutTokens();
  const { outPrice } = usePriceImpact();
  const { totalGasCost, gasCostUS } = useGasFee();
  const totalGasFee = getGasCostText(totalGasCost);
  const { minimumReceived } = useAmountOut();
  const [isLoading] = useIsLoading();
  const { onClick } = useCallBridgeSwapAction();
  const { routingPath } = useSmartRouter();
  const { isApproved } = useApprove();

  const isLoadingCheck =
    isLoading || routingPath === null || routingPath === undefined;

  const { tokenPriceWithAmount: token0PriceWithAmount } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
    amount: Number(inToken?.parsedAmount),
  });

  const { tokenMarketPrice: token0MarketPrice } = useGetMarketPrice({
    tokenName: inToken?.tokenName as string,
  });

  const { tokenPriceWithAmount: token1PriceWithAmount } = useGetMarketPrice({
    tokenName: outToken?.tokenName as string,
    amount: Number(outToken?.parsedAmount),
  });

  const deductionPercentage = useMemo(() => {
    console.log(token0PriceWithAmount);
    console.log(token1PriceWithAmount);
    if (token1PriceWithAmount === 0) return "0";
    const deduction =
      (token1PriceWithAmount ?? 1) / (token0PriceWithAmount ?? 1) - 1;
    return commafy(deduction * 100, 2);
  }, [token0PriceWithAmount, token1PriceWithAmount, inToken, outToken]);

  return (
    <Modal
      isOpen={swapConfirmModal}
      onClose={onCloseSwapConfirmModal}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalHeader px={0} pt={0} pb={"12px"}>
          <Text fontSize={"20px"} fontWeight={"500"} lineHeight={"30px"}>
            Confirm Swap
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseSwapConfirmModal} />
        </Box>
        <ModalBody p={0}>
          <Box
            px={"16px"}
            py={"12px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bg="#0F0F12"
          >
            <Box>
              <ConfirmDetails isInNetwork={true} inToken={inToken} />
              <ConfirmDetails
                isInNetwork={false}
                inToken={outToken}
                deductionPercentage={deductionPercentage}
              />
            </Box>
          </Box>
          <Box mt={"12px"}>
            <ConfirmSubDetail
              type={ConfirmDetailType.Rate}
              tokenValue={`${formatNumber(outPrice)} ${
                outToken?.tokenSymbol
              } = 1 ${inToken?.tokenSymbol}`}
              gasValue={
                token0PriceWithAmount
                  ? `$${formatNumber(token0MarketPrice)}`
                  : "NA"
              }
              isLoading={isLoadingCheck}
            />
            <ConfirmSubDetail
              type={ConfirmDetailType.MinReceived}
              tokenValue={
                minimumReceived !== undefined
                  ? `${formatNumber(minimumReceived)} ${outToken?.tokenSymbol}`
                  : "NA"
              }
              isLoading={isLoadingCheck}
            />
            <ConfirmSubDetail
              type={ConfirmDetailType.NetworkFee}
              tokenValue={totalGasFee ?? "NA"}
              gasValue={gasCostUS ? `$${gasCostUS}` : "NA"}
              isLoading={isLoadingCheck}
            />
          </Box>
        </ModalBody>
        <ModalFooter p={0} display="block">
          <Flex gap={"12px"} flexDir={"column"} mt={"12px"}>
            <ApproveButton isConfirmed={true} />
            <Button
              width="full"
              height={"48px"}
              borderRadius={"8px"}
              sx={{
                backgroundColor: "#007AFF",
                color: "#FFFFFF",
              }}
              onClick={() => {
                onClick();
                onCloseSwapConfirmModal();
              }}
              _active={{}}
              _hover={{}}
              _focus={{}}
              isDisabled={isLoadingCheck || !isApproved ? true : false}
              _disabled={{
                color: "#8E8E92",
                bgColor: "#17181D",
              }}
              opacity={"1 !important"}
            >
              <Flex alignItems={"center"}>
                <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
                  Swap
                </Text>
              </Flex>
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
