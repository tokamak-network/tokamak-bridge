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
  CT_PROVIDE,
} from "@/staging/types/transaction";
import { SupportedChainId } from "@/types/network/supportedNetwork";
import { ModalType } from "../../../types";
import { T_FETCH_REQUEST_LIST_L2 } from "@/staging/hooks/useCrossTrade";
import { CrossTradeData } from "@/staging/types/crossTrade";

interface CTProviderProps {
  // status: number;
  status: boolean;
  crossTradeData: CrossTradeData;
  subgraphData: T_FETCH_REQUEST_LIST_L2;
}

export default function CTProvider({
  status,
  crossTradeData,
  subgraphData,
}: CTProviderProps) {
  const { blockTimestamps, inNetwork, outNetwork, inToken, outToken } =
    crossTradeData;
  const { onOpenCTConfirmModal } = useCTConfirmModal();

  const openProvideModal = () =>
    onOpenCTConfirmModal({
      type: ModalType.Trade,
      txData: {
        category: HISTORY_SORT.CROSS_TRADE,
        action: CT_ACTION.PROVIDE,
        status: CT_PROVIDE.Provide,
        inNetwork,
        outNetwork,
        inToken,
        outToken,
        blockTimestamps: {
          provide: 0,
        },
        transactionHashes: {
          provide: "",
        },
        serviceFee: BigInt(0),
      },
      isProvide: true,
      subgraphData,
    });

  const renderButton = () => {
    // if (status === STATUS.COUNTDOWN && blockTimestamps) {
    //   const remainTime = calculateInitialCountdown(
    //     blockTimestamps,
    //     TRANSACTION_CONSTANTS.CROSS_TRADE.PROVIDE
    //   );
    //   const isZeroTime = remainTime <= 0;
    //   const timeDisplay = isZeroTime
    //     ? "00 : 00"
    //     : useCountdown(formatTimeDisplay(remainTime));

    //   return (
    //     <Flex justifyContent={"center"}>
    //       <Text
    //         fontWeight={600}
    //         fontSize={"11px"}
    //         lineHeight={"16.5px"}
    //         color={"#DB00FF"}
    //       >
    //         {timeDisplay}
    //       </Text>
    //     </Flex>
    //   );
    // }

    const isDisabled = status;
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
