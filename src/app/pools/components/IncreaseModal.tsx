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
import CloseButton from "@/components/button/CloseButton";
import PriceRange from "../[info]/components/PriceRange";
import { usePoolContract, usePoolMint } from "@/hooks/pool/usePoolContract";
import { useEffect, useState } from "react";
import commafy from "@/utils/trim/commafy";
import useBlockNum from "@/hooks/network/useBlockNumber";
import useTxConfirmModal from "@/hooks/modal/useTxConfirmModal";
import { useRecoilValue } from "recoil";
import { estimatedGasFee } from "@/recoil/global/transaction";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";

export default function IncreaseModal() {
  const { onClosePreviewModal, poolModal } = usePreview();
  const { increaseLiquidity, estimateGasToIncrease } = usePoolContract();
  const { mintPosition, estimateGasToMint } = usePoolMint();
  const { setModalOpen, setIsOpen } = useTxConfirmModal();
  const [gasToAdd, setGasToAdd] = useState<number | undefined>(undefined);
  const { blockNumber } = useBlockNum();
  const { info } = usePositionInfo();

  useEffect(() => {
    const fetchData = async () => {
      if (poolModal === "addLiquidity") {
        const gasData = await estimateGasToMint();
        return setGasToAdd(gasData);
      }

      if (poolModal === "increaseLiquidity") {
        const gasData = await estimateGasToIncrease();
        return setGasToAdd(gasData);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 10000);
    return () => clearInterval(interval);
  }, [poolModal, blockNumber]);

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
          estimatedGas={commafy(gasToAdd)}
        />
        <PriceRange info={info} />
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
