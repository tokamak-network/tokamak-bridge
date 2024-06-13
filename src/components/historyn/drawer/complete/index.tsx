import { Flex, Box, Text } from "@chakra-ui/react";
import TokenPair from "@/components/historyn/components/TokenPair";
import { TokenSymbol } from "@/components/image/TokenSymbol";
import { TransactionHistory, Action } from "@/components/historyn/types";
import useSwapConfirmModal from "@/components/confirmn/hooks/useSwapConfirmModal";
import { FwFormatNumber } from "@/components/fw/components/FwFormatNumber";
import { formatDateToYMD } from "@/components/historyn/utils/timeUtils";

export default function Complete(transaction: TransactionHistory) {
  const transactionData = transaction;
  const { onOpenSwapConfirmModal } = useSwapConfirmModal();

  return (
    <>
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontWeight={500}
          fontSize={"12px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
        >
          {transactionData.action} completed
        </Text>
        <TokenPair
          networkI={transactionData.inNetwork}
          networkO={transactionData.outNetwork}
          networkW={16}
          networkH={16}
          pairType={"completed"}
        />
      </Flex>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"12px"}
        py={"4px"}
        my={"4px"}
        borderRadius={"6px"}
        border={"1px solid rgba(0, 122, 255, 0.40)"}
      >
        <Flex alignItems='center'>
          <TokenSymbol w={22} h={22} tokenType={transactionData.tokenSymbol} />
          <Box ml={"6px"}>
            <Flex>
              <FwFormatNumber
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "21px",
                  color: "#FFFFFF",
                }}
                value={transactionData.amount}
              />
              <Box w='4px' /> {/** space bar */}
              <Text
                fontWeight={400}
                fontSize={"14px"}
                lineHeight={"21px"}
                color={"#A0A3AD"}
              >
                {transactionData.tokenSymbol}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Text
          fontWeight={400}
          fontSize={"11px"}
          lineHeight={"22px"}
          color={"#A0A3AD"}
          cursor={"pointer"}
          onClick={() => onOpenSwapConfirmModal(transactionData)}
        >
          {formatDateToYMD(
            Number(transactionData.blockTimestamps.finalizedCompletedTimestamp)
          )}
        </Text>
      </Flex>
    </>
  );
}
