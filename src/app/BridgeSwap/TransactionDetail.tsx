import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  useAccordionContext,
} from "@chakra-ui/react";

const AccodionItem = () => {
  //index === 0 means isOpened
  //index === -1 means isClosed
  const { index } = useAccordionContext();

  return (
    <AccordionItem borderColor={"#1F2128"}>
      <AccordionButton>
        <Box
          as="span"
          flex="1"
          textAlign="left"
          fontSize={16}
          fontWeight={"semibold"}
        >
          Transaction Details
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel w={"100%"} bg={"#1F2128"}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </AccordionPanel>
    </AccordionItem>
  );
};

export default function TransactionDetail() {
  return (
    <Flex w={"100%"} h={"48px"} bg={"#1F2128"} borderRadius={"8px"}>
      <Accordion allowToggle w={"100%"}>
        <AccodionItem />
      </Accordion>
    </Flex>
  );
}
