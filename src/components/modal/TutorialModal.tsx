import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Box,
  Text,
  Link,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import CloseButton from "../button/CloseButton";
import { useState, useEffect, useCallback, useRef } from "react";
import step0 from "assets/image/tutorial/step0.svg";
import step1 from "assets/image/tutorial/step1.svg";
import step2 from "assets/image/tutorial/step2.svg";
import step3 from "assets/image/tutorial/step3.svg";
import step4 from "assets/image/tutorial/step4.svg";
import step5 from "assets/image/tutorial/step5.svg";
import { useLocalStorage } from "@/hooks/storage/useLocalStorage";
import { motion } from "framer-motion";

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
      "For example: Ethereum > Ethereum",
    ],
  },
  {
    stepTitle: "Set up Deposit",
    stepDescription: [
      "In order to perform a Deposit, the left network needs to be layer 1, the right network needs to be layer 2. ",
      "For example: Ethereum > Titan",
    ],
  },
  {
    stepTitle: "Set up Withdraw",
    stepDescription: [
      "In order to perform a Withdraw, the left network needs to be layer 2, the right network needs to be layer 1. ",
      "For example: Titan > Ethereum",
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
  { bg: step0, px: "40px", size: "496px 466px", mt: "140px !important" },
  { bg: step1, px: "40px", size: "503px 463px", mt: "190px !important" },
  { bg: step2, px: "15px", size: "496px 519px", mt: "140px !important" },
  { bg: step3, px: "15px", size: "496px 519px", mt: "140px !important" },
  { bg: step4, px: "15px", size: "496px 519px", mt: "140px !important" },
  { bg: step0, px: "15px", size: "496px 463px", mt: "127px !important" },
];

type Size = {
  top: number ;
  left: number;
  bottom: number;
  right:number
};

export default function TutorialModal() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [, setModalOpen] = useState(true);
  const [size, setSize] = useState<Size>({
    top: 0,
  left: 0,
  bottom: 0,
  right:0,
  });
  const [storedValue, setValue] = useLocalStorage("tutorial", false);
  const closeModal = useCallback(() => {
    setValue(true);
    setModalOpen(false);
  }, []);
  const constraintsRef = useRef<HTMLDivElement | null>(null);

  const isOpen = storedValue === false;

  useEffect(() => {
    const getHeightWidth = () => {
      if (constraintsRef) {

        const height = constraintsRef?.current?.offsetHeight
        const width = constraintsRef?.current?.offsetWidth        
        setSize({
          top: (Number(height)/-2)+180,
          left: (Number(width)/-2)+202,
          right: Number(width)/2-202,
          bottom: Number(height)/2-180,
        });
      }
    };

    getHeightWidth();
    const handleResize = () => {
      getHeightWidth();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [constraintsRef?.current, setSize]);
  
  return (
    <Modal onClose={() => {}} isOpen={isOpen} >
      <ModalOverlay
        bg={"rgba(0, 0, 0, 0)"}
        mt={bgs[currentStep].px}
        ml={"-1px"}
        backgroundImage={currentStep !== 5 ? bgs[currentStep].bg.src : ""}
        backgroundRepeat={"no-repeat"}
        backgroundSize={bgs[currentStep].size}
        css={{
          backgroundPositionY: ["center"],
          backgroundPositionX: "center",
        }}
        ref={constraintsRef}
      />

      <ModalContent
      top={'30%'}
        as={motion.div}
        drag
        dragElastic={{top: 0, bottom: 0.3}}
        // dragTransition={{ bounceStiffness: 100, bounceDamping: 1000 }}
        dragConstraints={size}
        dragMomentum={false}
        justifyContent={"center"}
        alignItems={"center"}
      
        borderRadius={"24px"}
        w="404px"
        paddingBottom={"40px"}
        bg={"#1F2128"}
      
        position={"fixed"}>
        <Flex flexDir={"column"} alignItems={"center"}>
          <Flex w={"100%"} justifyContent={"flex-end"} pt={"14px"} pr={"14px"}>
            <CloseButton onClick={closeModal} />
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
            {steps[currentStep].stepDescription.map(
              (text: string, index: number) => {
                return currentStep !== 5 ? (
                  <Text
                    key={index}
                    textAlign={currentStep === 0 ? "center" : "left"}
                    mb={"40px"}>
                    {text}
                  </Text>
                ) : (
                  <Text mb={"16px"} textAlign={"left"} key={text}>
                    To get a more in-depth guide on how to use Tokamak Bridge,
                    you can find a link to our{" "}
                    <Link
                      style={{
                        color: "#007AFF",
                        textDecoration: "underline",
                      }}
                      href="https://tokamaknetwork.gitbook.io/home/02-service-guide/tokamak-bridge"
                      isExternal>
                      user guide
                    </Link>{" "}
                    under the “More” tab in the menu. You can also request help
                    from our team by filling out this google{" "}
                    <Link
                      style={{
                        color: "#007AFF",
                        textDecoration: "underline",
                      }}
                      href="https://docs.google.com/forms/u/1/d/e/1FAIpQLSfCUJjuABK0Locc3Fqwr2W5eHI-Hpj6wiiGceBr1e4q4g9nmg/viewform?usp=send_form"
                      isExternal>
                      form
                    </Link>
                  </Text>
                );
              }
            )}
          </Flex>

          <Flex
            pl={"39px"}
            pr={"41px"}
            w="100%"
            justifyContent={"center"}
            alignItems={"center"}>
            {currentStep !== 0 ? (
              <Text
                color={"#FFF"}
                opacity={0.5}
                cursor={"pointer"}
                onClick={() => setCurrentStep(currentStep - 1)}>
                Back
              </Text>
            ) : (
              <Text></Text>
            )}
            <Flex
              flexDir={"row"}
              ml={"87px"}
              mr={currentStep === 5 ? "60px" : "95px"}>
              {steps.map((step: any, index: number) => {
                return (
                  <Flex
                    key={step.stepTitle}
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
                onClick={() => setCurrentStep(currentStep + 1)}>
                Next
              </Text>
            ) : (
              <Text cursor={"pointer"} onClick={closeModal}>
                All Done!
              </Text>
            )}
          </Flex>
        </Flex>
      </ModalContent>
    </Modal>
  );
}
