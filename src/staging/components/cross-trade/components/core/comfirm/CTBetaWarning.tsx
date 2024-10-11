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
import useMediaView from "@/hooks/mediaView/useMediaView";

export const CTBetaWarning = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { mobileView } = useMediaView();

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent
        width={mobileView ? "320px" : "404px"}
        bg='#1F2128'
        p={"20px"}
        borderRadius={"16px"}
        h={mobileView ? "235px" : "228px"}
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
          <Text
            fontSize={mobileView ? "14px" : 16}
            fontWeight={400}
            lineHeight={mobileView ? "24px" : "26px"}
            w={mobileView ? "100%" : "356px"}
          >
            {mobileView
              ? "Cross trade beta testing is in progress. Refrain from providing large amounts of liquidity, as it may result in financial losses."
              : "Cross trade beta testing is in progress. \nRefrain from providing large amounts of \nliquidity, as it may result in financial losses."}
          </Text>
          <Button
            w={"100%"}
            borderRadius={"8px"}
            h={mobileView ? "40px" : "48px"}
            bgColor={"#DB00FF"}
            _hover={{}}
            _active={{}}
            onClick={() => setIsOpen(false)}
          >
            {mobileView ? (
              <Text fontWeight={600} fontSize={"14px"} lineHeight={"22px"}>
                I understand the risk
              </Text>
            ) : (
              "I understand the risk"
            )}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
