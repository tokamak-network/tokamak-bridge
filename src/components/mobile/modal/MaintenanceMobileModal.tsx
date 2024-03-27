import { Modal, ModalOverlay, ModalContent, Flex, Text, Box, Link, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { intervalToDuration, formatDuration } from "date-fns";

export default function MaintenanceMobileModal() {
    const [remainingTime, setRemainingTime] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [modalType, ] = useState("red")


    useEffect(() => {
        const updateRemainingTime = () => {
            
            const now = new Date().getTime();
            // 해당 시간을 바꾼다.
            const startTime = 1711455095000;
            const endTime = 1711486945000;

            if (now < startTime) {
                setIsOpen(false);
                return;
            } else if (now >= startTime && now <= endTime) {
                setIsOpen(true);
                const duration = intervalToDuration({ start: now, end: endTime });

                const hours = String(duration.hours).padStart(2, '0');
                const minutes = String(duration.minutes).padStart(2, '0');
                const seconds = String(duration.seconds).padStart(2, '0');
                const formattedDuration = `${hours}:${minutes}:${seconds}`;

                setRemainingTime(formattedDuration);
            } else {
                setIsOpen(false);
                setRemainingTime("00:00:00");
            }
        };

        const intervalId = setInterval(updateRemainingTime, 1000);

        return () => clearInterval(intervalId);
    }, []);


    return (
        <Modal isOpen={isOpen} onClose={() => console.log("Close modal")}>
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
                        {
                            modalType == "yellow" ? "Titan Network scheduled" : "Titan Network"
                        }
                    </Text>
                    <Text fontSize={"14px"} fontWeight={400} textAlign={"center"}>
                        {
                            modalType == "yellow" ? "maintenance commencing in:" : "under maintenance."
                        }
                    </Text>
                </Box>
                <Box pb={"20px"}>
                    <Text 
                        fontSize={"24px"} 
                        fontWeight={600} 
                        color={modalType == "yellow" ? "#F9C03E" : "#DD3A44"}
                    >
                        {remainingTime}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize={"11px"} fontWeight={400} textAlign={"center"}>
                        Maintenance scheduled from <Box as="span" fontWeight={700}>19:00 - 19:30 GMT +9</Box>
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
                    onClick={() => console.log("Confirm")}
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