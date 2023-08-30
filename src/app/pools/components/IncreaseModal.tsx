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
import { useRecoilValue } from "recoil";
import { estimatedGasFee } from "@/recoil/global/transaction";

export default function IncreaseModal() {
  const { onClosePreviewModal, poolModal } = usePreview();
  const { increaseLiquidity } = usePoolContract();
  const { mintPosition, estimateGasToMint } = usePoolMint();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const [gasToAdd, setGasToAdd] = useState<number | undefined>(undefined);
  const { blockNumber } = useBlockNum();
  const gasFeeToIncrease = useRecoilValue(estimatedGasFee);

  useEffect(() => {
    const fetchData = async () => {
      const gasData = await estimateGasToMint();
      setGasToAdd(gasData);
    };
    if (poolModal === "increaseLiquidity") {
      fetchData();
    }
  }, [estimateGasToMint, blockNumber]);

  return (
    <Modal
      isOpen={poolModal === "increaseLiquidity" || poolModal === "addLiquidity"}
      onClose={() => {
        onClosePreviewModal();
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
          estimatedGas={
            poolModal === "addLiquidity"
              ? commafy(gasToAdd, 2)
              : commafy(gasFeeToIncrease, 2)
          }
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
              // setGas(undefined);
              poolModal === "addLiquidity"
                ? mintPosition()
                : increaseLiquidity();
            }}
          >
            {poolModal === "addLiquidity" ? "Add" : "Increase"}
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
