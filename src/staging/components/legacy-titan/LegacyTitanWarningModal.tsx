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
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import useMediaView from "@/hooks/mediaView/useMediaView";
import {
  actionMode,
  networkStatus,
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";

export const LegacyTitanWarningModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { mobileView } = useMediaView();
  const { mode } = useRecoilValue(actionMode);
  const [network, setNetwork] = useRecoilState(networkStatus);
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  useEffect(() => {
    if (mode !== null) setIsOpen(true);
  }, [mode]);

  const handleCloseModal = () => {
    setIsOpen(false);
    if (mode !== "Withdraw") {
      setNetwork({ inNetwork: null, outNetwork: null });
      setSelectedInToken(null);
      setSelectedOutToken(null);
    }
  };

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
                <Text>Text will be changed</Text>
                <Text>Text will be changed</Text>
              </Flex>
            ) : (
              <Flex flexDir={"column"} rowGap={"16px"}>
                <Text>Text will be changed</Text>
                <Text>Text will be changed</Text>
              </Flex>
            )}
          </Text>
          <Button
            w={"100%"}
            borderRadius={"8px"}
            h={mobileView ? "40px" : "48px"}
            bgColor={"#007AFF"}
            _hover={{}}
            _active={{}}
            onClick={handleCloseModal}
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
