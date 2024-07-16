import { Text, Button, Flex } from "@chakra-ui/react";
import {
  STATUS,
  calculateInitialCountdown,
} from "@/staging/components/cross-trade/utils/getStatus";
import { useCountdown } from "@/staging/hooks/useCountdown";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";
import { TRANSACTION_CONSTANTS } from "@/staging/constants/transactionTime";
import useCTConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import {
  HISTORY_SORT,
  CT_ACTION,
  CT_REQUEST,
} from "@/staging/types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { ModalType } from "../../../types";

interface CTProviderProps {
  status: number;
  blockTimestamps?: number;
}

export default function CTProvider({
  status,
  blockTimestamps,
}: CTProviderProps) {
  const { onOpenCTConfirmModal } = useCTConfirmModal();

  const openProvideModal = () =>
    onOpenCTConfirmModal({
      type: ModalType.Trade,
      txData: {
        category: HISTORY_SORT.CROSS_TRADE,
        action: CT_ACTION.REQUEST,
        isCanceled: false,
        status: CT_REQUEST.Request,
        blockTimestamps: {
          request: 0,
        },
        inNetwork: SupportedChainId.TITAN,
        outNetwork: SupportedChainId.MAINNET,
        inToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        outToken: {
          address: "0x",
          name: "ETH",
          symbol: "ETH",
          amount: "000000000000",
          decimals: 0,
        },
        transactionHashes: {
          request: "",
        },
      },
      isProvide: true,
    });

  const renderButton = () => {
    if (status === STATUS.COUNTDOWN && blockTimestamps) {
      const remainTime = calculateInitialCountdown(
        blockTimestamps,
        TRANSACTION_CONSTANTS.CROSS_TRADE.PROVIDE
      );
      const isZeroTime = remainTime <= 0;
      const timeDisplay = isZeroTime
        ? "00 : 00"
        : useCountdown(formatTimeDisplay(remainTime));

      return (
        <Flex justifyContent={"center"}>
          <Text
            fontWeight={600}
            fontSize={"11px"}
            lineHeight={"16.5px"}
            color={"#DB00FF"}
          >
            {timeDisplay}
          </Text>
        </Flex>
      );
    }

    const isDisabled = status === STATUS.DISABLED;
    const bgColor = isDisabled ? "#23242B" : "#007AFF";
    const textColor = isDisabled ? "#A0A3AD" : "#FFFFFF";

    return (
      <Button
        w={"64px"}
        h={"28px"}
        px={"10px"}
        py={"5px"}
        justifyContent={"center"}
        gap={"8px"}
        flexShrink={0}
        borderRadius={"6px"}
        bg={bgColor}
        isDisabled={isDisabled}
        _active={{}}
        _hover={{}}
        _focus={{}}
        _disabled={{
          opacity: 1,
        }}
        cursor={"pointer"}
        onClick={() => openProvideModal()}
      >
        <Text
          fontWeight={600}
          fontSize={"11px"}
          lineHeight={"16.5px"}
          color={textColor}
        >
          Provide
        </Text>
      </Button>
    );
  };

  return <>{renderButton()}</>;
}
