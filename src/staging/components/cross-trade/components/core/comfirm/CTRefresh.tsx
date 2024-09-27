import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Button,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { ctRefreshModalStatus } from "@/recoil/modal/atom";
import { useRequestData } from "@/staging/hooks/useCrossTrade";
import useCTConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import { ModalType } from "../../../types";

export const CTRefresh = () => {
  const [refreshModalStatus, setRefreshModalStatus] =
    useRecoilState(ctRefreshModalStatus);
  const { onOpenCTConfirmModal } = useCTConfirmModal();
  const { requestDataBySaleCount } = useRequestData(
    refreshModalStatus.saleCount
  );

  const openProvideModal = () => {
    if (refreshModalStatus.txData && requestDataBySaleCount) {
      onOpenCTConfirmModal({
        type: ModalType.Trade,
        txData: {
          //only update datas for UI and wouldn't have a problem to call a contract call because it depends on subgraph data and it's also updated with it
          ...refreshModalStatus.txData,
          inToken: requestDataBySaleCount.inToken,
          outToken: requestDataBySaleCount.outToken,
          serviceFee: requestDataBySaleCount.serviceFee,
        },
        isProvide: true,
        subgraphData: requestDataBySaleCount.subgraphData,
      });
    }
  };

  const closeRefreshModal = () => {
    setRefreshModalStatus({
      isOpen: false,
      saleCount: undefined,
      txData: undefined,
    });
    openProvideModal();
  };

  return (
    <Modal
      isOpen={refreshModalStatus.isOpen}
      onClose={() => closeRefreshModal()}
      isCentered
    >
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalBody
          p={0}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          rowGap={"15px"}
          textAlign={"center"}
          color={"#fff"}
        >
          <Text fontSize={20} fontWeight={500}>
            Service fee updated
          </Text>
          <Text fontSize={16} fontWeight={400}>
            The requester has updated the service fee. Please recheck the
            "provide" and "receive" amounts.
          </Text>
          <Button
            w={"100%"}
            borderRadius={"8px"}
            bgColor={"#007AFF"}
            _hover={{}}
            _active={{}}
            onClick={() => closeRefreshModal()}
          >
            Refresh
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
