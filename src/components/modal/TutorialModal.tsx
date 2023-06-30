import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Box,
  Text,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import CloseButton from "../button/CloseButton";
import { useState } from "react";
import step0 from "assets/image/step0.svg";
import step1 from "assets/image/step1.svg";
import step2 from "assets/image/step2.svg";
import step3 from "assets/image/step3.svg";
import step4 from "assets/image/step4.svg";
import step5 from "assets/image/step5.svg";

export default function TutorialModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(true);
  const steps = [
    {
      stepTitle: "Welcome to Tokamak Bridge",
      stepDescription: [
        "Allow us to give you a few tips on how to set up a Swap, Deposit or Withdraw. ",
      ],
    },
    {
      stepTitle: "Selecting Networks",
      stepDescription: [
        "Tokamak Bridge gives you the flexibility on what type of exchange you would like to perform. This is all dependent on how the networks are set up.",
        "Easy Tip: All transactions are performed from left > right.",
      ],
    },
    {
      stepTitle: "Set up Swap",
      stepDescription: [
        "In order to perform a Swap, both networks need to be on the same network.",
        "For example: ETH Mainnet > ETH Mainnet",
      ],
    },
    {
      stepTitle: "Set up Deposit",
      stepDescription: [
        "In order to perform a Deposit, the left network needs to be layer 1, the right network needs to be layer 2. ",
        "For example: ETH Mainnet > Titan",
      ],
    },
    {
      stepTitle: "Set up Withdraw",
      stepDescription: [
        "In order to perform a Withdraw, the left network needs to be layer 2, the right network needs to be layer 1. ",
        "For example: Titan > ETH Mainnet",
      ],
    },
    {
      stepTitle: "More Help",
      stepDescription: [
        "To get a more in-depth guide on how to use Tokamak Bridge, you can find a link to our user guide under the “More” tab in the menu.",
      ],
    },
  ];

  const bgs = [
    { bg: step0, px:'55%', size: "502px 463px" },
    { bg: step1, px: "55%", size: "502px 463px" },
    { bg: step2, px: "50%", size: "520px 514px" },
    { bg: step3, px: "50%", size: "520px 516px" },
    { bg: step4, px: "50%", size: "520px 516px" },
    { bg: step0, px: "55%", size: "502px 463px" },
  ];

  return (
    <Modal onClose={onClose} isOpen={modalOpen} isCentered>
      <ModalOverlay
        bg={"rgba(0, 0, 0, 0.6)"}
        backgroundImage={currentStep !== 5?  bgs[currentStep].bg.src:''}
        backgroundRepeat={"no-repeat"}
        backgroundSize={bgs[currentStep].size}
        css={{
          backgroundPositionY: bgs[currentStep].px,
          backgroundPositionX: "center",
        }}
       
      />
      <ModalContent
        justifyContent={"center"}
        alignItems={"center"}
        m={0}
        borderRadius={"24px"}
        w="404px"
        paddingBottom={"40px"}
        bg={"#1F2128"}
        mt={"140px !important"}
        position={'fixed'}
      
      >
        <Flex flexDir={"column"} alignItems={"center"}>
          <Flex w={"100%"} justifyContent={"flex-end"} pt={"14px"} pr={"14px"}>
            <CloseButton onClick={() => setModalOpen(false)} />
          </Flex>
          {currentStep === 0 && (
            <Box mb={"40.7px"}>
              <Image
                src={LOGO_IMAGE}
                alt={"LOGO_IMAGE"}
                height={46}
                width={47}
              />
            </Box>
          )}
          <Text mb={"40px"} fontSize={"24px"} fontWeight={600}>
            {steps[currentStep].stepTitle}
          </Text>
          <Flex ml={"39px"} mr={"41px"} flexDir={"column"}>
            {steps[currentStep].stepDescription.map((text: string) => {
              return currentStep !== 5 ? (
                <Text
                  textAlign={currentStep === 0 ? "center" : "left"}
                  mb={"40px"}
                >
                  {text}
                </Text>
              ) : (
                <Text mb={"40px"} textAlign={"left"}>
                  To get a more in-depth guide on how to use Tokamak Bridge, you
                  can find a link to our{" "}
                  <span
                    style={{ color: "#007AFF", textDecoration: "underline" }}
                  >
                    user guide
                  </span>{" "}
                  under the “More” tab in the menu.
                </Text>
              );
            })}
          </Flex>

          <Flex
            pl={"39px"}
            pr={"41px"}
            w="100%"
            justifyContent={"center"}
            alignItems={"center"}
          >
            {currentStep !== 0 ? (
              <Text
                color={"#FFF"}
                opacity={0.5}
                cursor={"pointer"}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </Text>
            ) : (
              <Text></Text>
            )}
            <Flex
              flexDir={"row"}
              ml={"87px"}
              mr={currentStep === 5 ? "60px" : "95px"}
            >
              {steps.map((step: any, index: number) => {
                return (
                  <Flex
                    h="5px"
                    w={"5px"}
                    mr={index === 5 ? "0px" : "7px"}
                    borderRadius={"50%"}
                    bg={index === currentStep ? "#4e4f54" : "#D9D9D9"}
                    onClick={() => setCurrentStep(index)}
                    cursor={"pointer"}
                  />
                );
              })}
            </Flex>
            {currentStep !== 5 ? (
              <Text
                cursor={"pointer"}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
              </Text>
            ) : (
              <Text cursor={"pointer"} onClick={() => setModalOpen(false)}>
                All Done!
              </Text>
            )}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
