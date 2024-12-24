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
import { useState } from "react";
import useMediaView from "@/hooks/mediaView/useMediaView";
import { UnorderedList, ListItem } from "@chakra-ui/react";

export const TitanSunsetWarningModal10 = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { mobileView } = useMediaView();

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
            <UnorderedList pl={"10px"} textAlign={"left"} fontSize={"14px"}>
              <ListItem>L2 deposits are not available</ListItem>
              <ListItem>L2 transactions suspended</ListItem>
              <ListItem>L2 balance can only be viewed through L2 RPC</ListItem>
              <ListItem>Only Finalize operations supported in history</ListItem>
              <ListItem>Claimable list remains clickable</ListItem>
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
