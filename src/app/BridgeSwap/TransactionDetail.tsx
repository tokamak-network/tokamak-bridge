import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  useAccordionContext,
  Text,
} from "@chakra-ui/react";

export type transactionType = "SWAP" | "DEPOSIT" | "WITHDRAW";

const DivisionLine = () => {
  return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"16px"}></Box>;
};

const DetailRow = (props: { title: string; content: string }) => {
  return (
    <Flex justifyContent={"space-between"} fontSize={14} h={"10px"}>
      <Text fontWeight={300}>{props.title}</Text>
      <Text fontWeight={500}>{props.content}</Text>
    </Flex>
  );
};

const AccodionItem = () => {
  //index === 0 means isOpened
  //index === -1 means isClosed
  const { index } = useAccordionContext();
  const isExpended = index === 0;

  const propsData = [
    {
      title: "Expected output",
      content: "178.29USDC",
    },
    {
      title: "Price impact",
      content: "0.02%",
    },
    {
      title: "Minimum received after slippage (0.1%)",
      content: "178.29 USDC",
    },
    {
      title: "Estimated gas fees",
      content: "178.29USD",
    },
    {
      title: "Estimated gas fees",
      content: "178.29USD",
    },
  ];

  return (
    <AccordionItem
      borderColor={"#1F2128"}
      bgColor={"#1F2128"}
      h={isExpended ? "230px" : "100%"}
      px={"24px"}
      pb={isExpended ? "20px" : 0}
    >
      <AccordionButton minH={"48px"} p={0}>
        <Box
          as="span"
          flex="1"
          textAlign="left"
          fontSize={16}
          fontWeight={500}
          opacity={isExpended ? 1 : 0.5}
          rowGap={"14px"}
        >
          Transaction Details
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel w={"100%"} bgColor={"#1F2128"} p={0} h={"100%"}>
        <Box flex={1} flexDir={"column"}>
          <Flex fontSize={16} fontWeight={500}>
            <Text>1 USDC</Text>
            <Text>=</Text>
            <Text>0.00064 ETH</Text>
          </Flex>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} rowGap={"10px"}>
            {propsData.map((data) => (
              <DetailRow {...data}></DetailRow>
            ))}
          </Flex>
        </Box>
      </AccordionPanel>
    </AccordionItem>
  );
};

export default function TransactionDetail() {
  return (
    <Flex w={"100%"} minH={"48px"} bg={"#1F2128"} borderRadius={"8px"}>
      <Accordion allowToggle w={"100%"} h={"100%"} bg={"#17181D"}>
        <AccodionItem />
      </Accordion>
    </Flex>
  );
}
