import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Text,
  Button,
  Link,
  Flex,
  ListItem,
  UnorderedList,
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
import {
  SupportedChainId,
  SupportedChainIdOnProd,
} from "@/types/network/supportedNetwork";
import { useInOutNetwork } from "@/hooks/network";

export const LegacyTitanWarningModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { mobileView } = useMediaView();
  const { mode } = useRecoilValue(actionMode);
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { inNetwork } = useInOutNetwork();
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );

  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  useEffect(() => {
    if (mode === "Withdraw") return;
    if (
      (mode === "Swap" || mode === "Wrap" || mode === "Unwrap") &&
      (inNetwork?.chainId === SupportedChainId.MAINNET ||
        inNetwork?.chainId === SupportedChainId.SEPOLIA)
    )
      return;
    setNetwork({ inNetwork: null, outNetwork: null });

    setSelectedInToken(null);
    setSelectedOutToken(null);
  }, [mode]);

  return (
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay />
      <ModalContent
        width={"408px"}
        bg="#1F2128"
        p={"20px"}
        borderRadius={"16px"}
      >
        <ModalBody
          p={0}
          display={"flex"}
          flexDir={"column"}
          rowGap={"16px"}
          textAlign={"center"}
          color={"#fff"}
        >
          <Text fontSize={20} fontWeight={500} h={"30px"}>
            Warning
          </Text>
          <Flex flexDir={"column"} alignItems={"start"}>
            <Text>Titan Network Shutdown Warning:</Text>
            <UnorderedList pl={"11px"} textAlign={"left"} fontSize={"14px"}>
              <ListItem>L1 Claim feature is opend</ListItem>
              <ListItem>
                Uniswap Pool and Cross Trade are not supported
              </ListItem>
              <ListItem>No L2 transactions possible</ListItem>
              <ListItem>
                No Bridge history support for Deposit or Cross Trade
              </ListItem>
              <ListItem>Full withdrawal history supported only</ListItem>
            </UnorderedList>
          </Flex>
          <Button
            w={"100%"}
            borderRadius={"8px"}
            h={mobileView ? "40px" : "48px"}
            bgColor={"#007AFF"}
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
