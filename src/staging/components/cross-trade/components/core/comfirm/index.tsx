import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Text,
} from "@chakra-ui/react";
import { ModalType } from "@/staging/components/cross-trade/types";
import { useEffect, useMemo, useState } from "react";
import useCTUpdateFeeModal from "@/staging/components/cross-trade/hooks/useCTUpdateFeeModal";
import useFxConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import CloseButton from "@/components/button/CloseButton";
import CTConfirmDetail from "./CTConfirmDetail";
import CTConfirmCrossTradeFooter, {
  ContractWrite,
} from "./CTConfirmCrossTradeFooter";
import CTConfirmHistoryFooter from "./CTConfirmHistoryFooter";
import {
  isInCT_Provide,
  isInCT_REQUEST_CANCEL,
} from "@/staging/types/transaction";
import { WrongNetwork } from "../../common/WrongNetwork";
import { useCrossTradeContract } from "@/staging/hooks/useCrossTradeContracts";

export default function CTModal() {
  const { ctConfirmModal, onCloseCTConfirmModal } = useFxConfirmModal();
  const { onOpenCTUpdateFeeModal } = useCTUpdateFeeModal();
  const [isChecked, setIsChecked] = useState<{
    firstChecked: boolean;
    secondChecked: boolean;
  }>({
    firstChecked: false,
    secondChecked: false,
  });

  // pencil 클릭시 업데이트
  const handlePencilClick = () => {
    onCloseCTConfirmModal();
    console.log("ctConfirmModal.txData", ctConfirmModal.txData);
    onOpenCTUpdateFeeModal(ctConfirmModal.txData);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;
    if (id === "firstChecked" || id === "secondChecked") {
      setIsChecked({ ...isChecked, [id]: !isChecked[id] });
    }
  };

  const handleConfirm = () => {
    setIsChecked({
      firstChecked: false,
      secondChecked: false,
    });
    onCloseCTConfirmModal();
  };

  const isProvide = ctConfirmModal?.txData
    ? isInCT_Provide(ctConfirmModal.txData.status)
    : false;
  const isCanceled =
    ctConfirmModal?.txData &&
    isInCT_REQUEST_CANCEL(ctConfirmModal.txData.status);

  const modalTitles = {
    [ModalType.Trade]: "Confirm Request",
    [ModalType.History]: isProvide
      ? "Provide"
      : isCanceled
      ? "Cancel"
      : "Request",
  };

  useEffect(() => {
    if (ctConfirmModal)
      return setIsChecked({
        firstChecked: false,
        secondChecked: false,
      });
  }, [ctConfirmModal]);

  const { provideCT, requestRegisteredToken } = useCrossTradeContract();

  const requester = useMemo(() => {
    if (ctConfirmModal.type === ModalType.Trade) {
      return ctConfirmModal.subgraphData?._requester;
    }
    if (ctConfirmModal.type === ModalType.History) {
      return ctConfirmModal.txData?.L1_subgraphData?._requester;
    }
  }, [ctConfirmModal]);

  return (
    <Modal
      isOpen={ctConfirmModal.isOpen}
      onClose={onCloseCTConfirmModal}
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
            {isProvide && ctConfirmModal.type === ModalType.Trade
              ? "Confirm Provide"
              : modalTitles[ctConfirmModal.type]}
          </Text>
        </ModalHeader>
        <Box pos={"absolute"} right={4} top={"15px"}>
          <CloseButton onClick={onCloseCTConfirmModal} />
        </Box>
        <ModalBody p={0}>
          {isProvide && ctConfirmModal.type !== "history" && (
            <WrongNetwork style={{ marginBottom: "12px" }} />
          )}
          <CTConfirmDetail
            modalType={ctConfirmModal.type}
            onPencilClick={handlePencilClick}
            txData={ctConfirmModal.txData}
            requester={requester}
          />
        </ModalBody>
        <ModalFooter p={0} display="block">
          {ctConfirmModal.type == ModalType.Trade ? (
            <CTConfirmCrossTradeFooter
              isChecked={isChecked}
              onCheckboxChange={handleCheckboxChange}
              onConfirm={handleConfirm}
              txData={ctConfirmModal.txData}
              isProvide={ctConfirmModal.isProvide}
              subgraphData={ctConfirmModal.subgraphData}
              provideCT={provideCT as ContractWrite}
              requestRegisteredToken={requestRegisteredToken as ContractWrite}
            />
          ) : (
            <CTConfirmHistoryFooter txData={ctConfirmModal.txData} />
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
