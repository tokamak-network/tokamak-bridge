import { useInOutNetwork } from "@/hooks/network";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import ArrowImg from "assets/icons/arrow.svg";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import CustomTooltip from "@/components/tooltip/customTooltip";

type DetailInfo = {
  title: string;
  content: string;
  tooltip?: boolean;
  dollorPrice?: string;
  gasFee?: {
    l1Gas: string;
    l2Gas: string;
  };
};

const DivisionLine = () => {
  return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"14px"}></Box>;
};

const DetailRow = (props: DetailInfo) => {
  const { gasFee, tooltip, title, content } = props;
  return (
    <Flex flexDir={"column"}>
      <Flex justifyContent={"space-between"} fontSize={14} h={"16px"}>
        <Text fontWeight={300}>{title}</Text>
        <Text fontWeight={500}>
          {tooltip ? <CustomTooltip content={content} /> : content}
        </Text>
      </Flex>
      {gasFee && (
        <Flex
          w={"448px"}
          h={"54px"}
          bgColor={"#15161D"}
          flexDir={"column"}
          fontSize={14}
          justifyContent={"center"}
          mt={"9px"}
          px={"16px"}
          borderRadius={"8px"}
        >
          <Flex justifyContent={"space-between"}>
            <Text>L1 gas fee</Text>
            <Text>{gasFee.l1Gas}</Text>
          </Flex>
          <Flex justifyContent={"space-between"}>
            <Text>L2 gas fee</Text>
            <Text>{gasFee.l2Gas}</Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const propsData: DetailInfo[] = [
  {
    title: "Amount to Deposit",
    content: "~0.0022 ETH",
  },
  {
    title: "Estimated gas fees",
    content: "~0.0022 ETH",
    gasFee: {
      l1Gas: "0.0022 ETH",
      l2Gas: "0.0022 ETH",
    },
  },
  {
    title: "Time to Deposit",
    content: "~20 minutes",
  },
];

const Content = (props: { isExpanded: boolean }) => {
  const { isExpanded } = props;

  if (isExpanded) {
    return (
      <Flex>
        <Box flex={1} flexDir={"column"}>
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
        fontSize={14}
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
      h={isExpanded ? "212px" : "48px"}
      bg={"#17181D"}
      borderRadius={"8px"}
      px={"20px"}
      flexDir={"column"}
      pt={isExpanded ? "20px" : "14px"}
    >
      <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
      <Content isExpanded={isExpanded}></Content>
    </Flex>
  );
}
