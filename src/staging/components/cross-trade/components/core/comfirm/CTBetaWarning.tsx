import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Link,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { ctRefreshModalStatus } from "@/recoil/modal/atom";
import { useRequestData } from "@/staging/hooks/useCrossTrade";
import useCTConfirmModal from "@/staging/components/cross-trade/hooks/useCTConfirmModal";
import { ModalType } from "../../../types";
import { useState } from "react";

export const CTBetaWarning = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent
        width={"404px"}
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
        h={"228px"}
      >
        <ModalBody
          p={0}
          display={"flex"}
          flexDir={"column"}
          alignItems={"center"}
          rowGap={"16px"}
          textAlign={"center"}
          color={"#fff"}
        >
          <Text fontSize={20} fontWeight={500} h={"30px"}>
            Warning
          </Text>
          <Text fontSize={16} fontWeight={400} lineHeight={"26px"} w={"356px"}>
            Cross trade beta testing is in progress. <br />
            Refrain from providing large amounts of <br />
            liquidity, as it may result in financial losses.
          </Text>
          <Button
            w={"100%"}
            borderRadius={"8px"}
            h={"48px"}
            bgColor={"#DB00FF"}
            _hover={{}}
            _active={{}}
            onClick={() => setIsOpen(false)}
          >
            I understand the risk
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
