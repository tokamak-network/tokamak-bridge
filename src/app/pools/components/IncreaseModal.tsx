import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Box,
  Button,
} from "@chakra-ui/react";
import Range from "./Range";
import usePreview from "@/hooks/modal/usePreviewModal";
import Title from "../add/components/Title";
import ActionButton from "../increase/components/ActionButton";
import CloseButton from "@/components/button/CloseButton";
import PriceRange from "../[info]/components/PriceRange";
import { usePoolContract, usePoolMint } from "@/hooks/pool/usePoolContract";
import { useEffect, useState } from "react";
import commafy from "@/utils/trim/commafy";
import useBlockNum from "@/hooks/network/useBlockNumber";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";

export default function IncreaseModal() {
  const { onClosePreviewModal, poolModal } = usePreview();
  const { addLiquidity } = usePoolContract();
  const { mintPosition, estimateGasToMint } = usePoolMint();
  const [gas, setGas] = useState<number | undefined>(undefined);
  const { blockNumber } = useBlockNum();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();

  useEffect(() => {
    const fetchData = async () => {
      if (gas !== undefined) return;
      const gasData = await estimateGasToMint();
      setGas(gasData);
    };
    fetchData();
  }, [gas, estimateGasToMint, blockNumber]);

  return (
    <Modal
      isOpen={poolModal === "increaseLiquidity" || poolModal === "addLiquidity"}
      onClose={() => {
        onClosePreviewModal();
        setGas(undefined);
      }}
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
            title={
              poolModal === "addLiquidity"
                ? "Add Liquidity"
                : "Increase Liquidity"
            }
            style={{ fontSize: "20px", fontWeight: 500 }}
          />
          <Box pos={"absolute"} right={"15px"} top={"15px"}>
            <CloseButton onClick={onClosePreviewModal} />
          </Box>
        </Flex>
        <Range
          style={{ background: "#0F0F12" }}
          page={poolModal}
          estimatedGas={commafy(gas)}
        />
        <PriceRange />
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
              setGas(undefined);
              poolModal === "addLiquidity" ? mintPosition() : addLiquidity();
            }}
          >
            {poolModal === "addLiquidity" ? "Add" : "Increase"}
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
