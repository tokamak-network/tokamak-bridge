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
  CT_PROVIDE,
  CT_REQUEST,
} from "@/staging/types/transaction";
import { ModalType } from "../../../types";
import { T_FETCH_REQUEST_LIST_L2 } from "@/staging/hooks/useCrossTrade";
import { CrossTradeData } from "@/staging/types/crossTrade";
import { useAccount } from "wagmi";
import { useMemo } from "react";
import useCTUpdateFeeModal from "@/staging/components/cross-trade/hooks/useCTUpdateFeeModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import { useTimeOver } from "@/hooks/time/useTimeOver";
interface CTProviderProps {
  status: boolean;
  crossTradeData: CrossTradeData;
  subgraphData: T_FETCH_REQUEST_LIST_L2;
  serviceFee: BigInt;
  isNetaveProfit: boolean;
}

export default function CTProvider({
  status,
  crossTradeData,
  subgraphData,
  isNetaveProfit,
}: CTProviderProps) {
  const {
    blockTimestamps,
    inNetwork,
    outNetwork,
    inToken,
    outToken,
    serviceFee,
    isInRelay,
    isUpdateFee,
    initialCTAmount,
    editedCTAmount,
  } = crossTradeData;
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
        serviceFee,
      },
      isProvide: true,
      subgraphData,
      forConfirmProviding: {
        isUpdateFee,
        initialCTAmount,
        editedCTAmount,
      },
    });

  const { onCloseCTConfirmModal } = useFxConfirmModal();
  const { onOpenCTUpdateFeeModal } = useCTUpdateFeeModal();

  const openUpdateModal = () => {
    onCloseCTConfirmModal();
    onOpenCTUpdateFeeModal({
      category: HISTORY_SORT.CROSS_TRADE,
      action: CT_ACTION.REQUEST,
      status: CT_REQUEST.Request,
      inNetwork,
      outNetwork,
      inToken,
      outToken,
      blockTimestamps: {
        request: 0,
      },
      transactionHashes: {
        request: "",
      },
      isCanceled: false,
      isUpdateFee: false,
      serviceFee,
      L2_subgraphData: subgraphData,
    });
  };

  const { isTimeOver } = useTimeOver({
    timeStamp: blockTimestamps,
    //15mins
    timeBuffer: TRANSACTION_CONSTANTS.CROSS_TRADE.PROVIDE,
    needToCheck: true,
    defaultValue: true,
  });
  const { address } = useAccount();
  const isCreatedByUser = useMemo(() => {
    return (
      address?.toLocaleLowerCase() ===
      crossTradeData.requester?.toLocaleLowerCase()
    );
  }, [address, crossTradeData.requester]);

  const ProvidingButton = () => {
    // if (!isTimeOver && !isCreatedByUser) {
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

    const isDisabled = isInRelay || (isNetaveProfit && !isCreatedByUser);
    const bgColor =
      isDisabled || isInRelay
        ? "#23242B"
        : isCreatedByUser
        ? "none"
        : "#007AFF";
    const textColor =
      isDisabled || isInRelay
        ? "#A0A3AD"
        : isCreatedByUser
        ? "#DB00FF"
        : "#FFFFFF";

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
        bg={isInRelay ? "none" : bgColor}
        border={
          isInRelay
            ? "none"
            : isCreatedByUser
            ? "1px solid var(--X-Trade, #DB00FF);"
            : "none"
        }
        isDisabled={isDisabled}
        _active={{}}
        _hover={{}}
        _focus={{}}
        _disabled={{
          opacity: 1,
        }}
        cursor={"pointer"}
        onClick={isCreatedByUser ? openUpdateModal : openProvideModal}
      >
        <Text
          fontWeight={600}
          fontSize={"11px"}
          lineHeight={"16.5px"}
          color={textColor}
        >
          {isInRelay ? "Completed" : isCreatedByUser ? "Edit" : "Provide"}
        </Text>
      </Button>
    );
  };

  return <ProvidingButton />;
}
