import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Link,
  Flex,
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
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
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
            textAlign={"left"}
          >
            {mobileView ? (
              <Flex flexDir={"column"} rowGap={"16px"}>
                <Text>
                  Cross trade beta testing is in progress. Refrain from
                  providing large amounts of liquidity, as it may result in
                  financial losses.
                </Text>
                <Text>
                  L2 state root containing the cross trade request must be
                  rolled up to Ethereum and wait 15 minutes for block finality.
                  Our current frontend doesn't verify this, so we advise users
                  to conduct their own research.
                </Text>
              </Flex>
            ) : (
              <Flex flexDir={"column"} rowGap={"16px"}>
                <Text>
                  Cross trade beta testing is in progress. Refrain from
                  providing large amounts of liquidity, as it may result in
                  financial losses.
                </Text>
                <Text>
                  L2 state root containing the cross trade request must be
                  rolled up to Ethereum and wait 15 minutes for block finality.
                  Our current frontend doesn't verify this, so we advise users
                  to conduct their own research.
                </Text>
              </Flex>
            )}
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
