import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface MaintenanceMobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: string;
  remainingTime: string;
  maintenanceTimeText: string;
}

export default function MaintenanceMobileModal(
  props: MaintenanceMobileModalProps,
) {
  const { isOpen, onClose, modalType, remainingTime, maintenanceTimeText } =
    props;

  const [isModalOpen, setIsModalOpen] = useState(isOpen);

  useEffect(() => {
    setIsModalOpen(isOpen);
  }, []);

  const handleClose = () => {
    setIsModalOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent
        h={"100%"}
        bg={"transparent"}
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
      >
        <Flex
          w={"320px"}
          h="auto"
          bgColor={"#1f2128"}
          borderRadius={"16px"}
          flexDir={"column"}
          alignItems={"center"}
          px={"16px"}
          py={"32px"}
        >
          <Text fontSize={"20px"} fontWeight={500} pb={"32px"}>
            {"Maintenance Commencing"}
          </Text>
          <Box pb={"20px"}>
            <Text fontSize={"14px"} fontWeight={400} textAlign={"center"}>
              {modalType === "yellow"
                ? "Titan Network scheduled"
                : "Titan Network"}
            </Text>
            <Text fontSize={"14px"} fontWeight={400} textAlign={"center"}>
              {modalType === "yellow"
                ? "maintenance commencing in:"
                : "under maintenance."}
            </Text>
          </Box>
          <Box pb={"20px"}>
            <Text
              fontSize={"24px"}
              fontWeight={600}
              color={modalType === "yellow" ? "#F9C03E" : "#DD3A44"}
            >
              {remainingTime}
            </Text>
          </Box>
          <Box>
            <Text fontSize={"11px"} fontWeight={400} textAlign={"center"}>
              Maintenance scheduled from{" "}
              <Box as="span" fontWeight={700}>
                {maintenanceTimeText}
              </Box>
            </Text>
            <Text fontSize={"11px"} fontWeight={400} textAlign={"center"}>
              *You may still swap on Ethereum Network
            </Text>
          </Box>
          <Button
            w="full"
            h={"48px"}
            bgColor={"#007AFF"}
            color={"white"}
            borderRadius={"8px"}
            mt={"16px"}
            mb={"8px"}
            _hover={{}}
            onClick={handleClose}
          >
            <Text fontWeight={600} fontSize={"16px"} color={"#FFFFFF"}>
              Confirm
            </Text>
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
