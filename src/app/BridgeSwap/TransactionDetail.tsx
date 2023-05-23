import { useInOutNetwork } from "@/hooks/network";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import ArrowImg from "assets/icons/arrow.svg";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

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

const Content = (props: { isExpanded: boolean }) => {
  const { isExpanded } = props;
  if (isExpanded) {
    return (
      <Flex>
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
      </Flex>
    );
  }
  return null;
};

const Title = (props: {
  isExpanded: boolean;
  setIsExpended: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isExpanded, setIsExpended } = props;
  const { mode } = useRecoilValue(actionMode);
  const { inNetwork, outNetwork } = useInOutNetwork();
  const arrowControl = useAnimation();

  useEffect(() => {
    if (isExpanded) {
      arrowControl.start({ rotate: 180 });
    } else {
      arrowControl.start({ rotate: 360 });
    }
  }, [isExpanded]);

  if (mode === "Deposit" || mode === "Withdraw") {
    return (
      <Flex
        w={"100%"}
        justifyContent={"space-between"}
        cursor={"pointer"}
        onClick={() => setIsExpended(!isExpanded)}
      >
        <Flex alignItems={"center"} columnGap={"7.5px"}>
          <Text>{inNetwork?.chainName}</Text>
          <Box w={"10px"} h={"9px"}>
            <Image src={ArrowImg} alt={"arrow"} />
          </Box>
          <Text>{outNetwork?.chainName}</Text>
        </Flex>
        <Flex alignItems={"center"}>
          <Image src={GasImg} alt={"gasStation"} />
          <Text
            fontSize={14}
            fontWeight={400}
            color={"#A0A3AD"}
            ml={"6px"}
            mr={"13px"}
          >
            $3.18
          </Text>
          <motion.div animate={arrowControl}>
            <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
          </motion.div>
        </Flex>
      </Flex>
    );
  }
  return null;
};

export default function TransactionDetail() {
  const [isExpanded, setIsExpended] = useState<boolean>(false);

  return (
    <Flex
      w={"100%"}
      h={isExpanded ? "212px" : "42px"}
      bg={"#17181D"}
      borderRadius={"8px"}
      px={"20px"}
      flexDir={"column"}
      justifyContent={"center"}
    >
      <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
      <Content isExpanded={isExpanded}></Content>
    </Flex>
  );
}
