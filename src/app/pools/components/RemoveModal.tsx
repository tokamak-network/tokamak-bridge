import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import Range from "./Range";
import usePreview from "@/hooks/modal/usePreviewModal";
import Title from "../add/components/Title";
import CloseButton from "@/components/button/CloseButton";
import { usePoolContract } from "@/hooks/pool/usePoolContract";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { removeAmount } from "@/recoil/pool/setPoolPosition";
import { useRecoilValue } from "recoil";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useEffect, useState } from "react";
import useBlockNum from "@/hooks/network/useBlockNumber";

export default function RemoveModal() {
  const { onClosePreviewModal, poolModal } = usePreview();
  const { removeLiquidity, estimateGasToRemove } = usePoolContract();
  const { info } = usePositionInfo();
  const removeLiquidityPercentage = useRecoilValue(removeAmount);
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const { blockNumber } = useBlockNum();
  const [gas, setGas] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (gas !== undefined) return;
      const gasData = await estimateGasToRemove(
        info?.id,
        removeLiquidityPercentage
      );
      console.log(gasData);
      setGas(gasData);
    };
    fetchData();
  }, [gas, info, blockNumber, removeLiquidityPercentage]);

  console.log(gas);

  return (
    <Modal
      isOpen={poolModal === "removeLiquidity"}
      onClose={onClosePreviewModal}
      isCentered
    >
      <ModalOverlay opacity={0.1} bg="blackAlpha.900" />
      <ModalContent
        // h={"100%"}
        w="404px"
        bg={"#1F2128"}
        p="20px"
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
        rowGap={"16px"}
      >
        <Flex alignItems={"flex-start"} w="100%">
          <Title
            title="Remove Liquidity"
            style={{ fontSize: "20px", fontWeight: 500 }}
          />
          <Box pos={"absolute"} right={"15px"} top={"15px"}>
            <CloseButton onClick={onClosePreviewModal} />
          </Box>
        </Flex>
        <Range style={{ background: "#0F0F12" }} page={"removeLiquidity"} />
        <Text
          fontSize={"12px"}
          color={"#A0A3AD"}
          width={"100%"}
          textAlign={"left"}
        >
          You will also collect fees earned from this position
        </Text>
        <Flex w={"100%"}>
          <Button
            w={"100%"}
            h={"48px"}
            borderRadius={"8px"}
            bg={"#007AFF"}
            fontSize={16}
            fontWeight={600}
            _hover={{}}
            _active={{}}
            _disabled={{}}
            onClick={() => {
              setModalOpen("confirming");
              setIsOpen(true);
              onClosePreviewModal();
              removeLiquidity(info?.id, removeLiquidityPercentage);
            }}
          >
            <Text>Remove</Text>
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
