import { useState, useEffect, useMemo } from "react";
import { Flex, Box, Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import AddIcon from "assets/icons/addIcon.svg";
import GasImg from "assets/icons/gasStation.svg";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInOutNetwork } from "@/hooks/network";
import { actionMode, confirmWithdrawStatus } from "@/recoil/bridgeSwap/atom";

const DivisionLine = () => {
  return <Box w={"100%"} h={"1px"} bgColor={"#2E313A"} my={"14px"}></Box>;
};

const Title = (props: {
  isExpanded: boolean;
  setIsExpended: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { isExpanded, setIsExpended } = props;
  const { inNetwork, outNetwork } = useInOutNetwork();
  const arrowControl = useAnimation();

  useEffect(() => {
    if (isExpanded) {
      arrowControl.start({ rotate: 180 });
    } else {
      arrowControl.start({ rotate: 360 });
    }
  }, [isExpanded]);
  return (
    <Flex
      w={"100%"}
      justifyContent={"space-between"}
      cursor={"pointer"}
      onClick={() => setIsExpended(!isExpanded)}
      fontSize={14}
    >
      <Flex alignItems={"center"} columnGap={"7.5px"}>
        <Text>1 USDC</Text>
        <Box w={"10px"} h={"9px"}>
          <Image src={AddIcon} alt={"arrow"} />
        </Box>
        <Text>0.0064 ETH ($1.000)</Text>
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
};

const Content = (props: { isExpanded: boolean }) => {
  const { isExpanded } = props;

  if (isExpanded) {
    return (
      <>
        <Flex flexDir={"column"}>
          <DivisionLine></DivisionLine>
          <Flex flexDir={"column"} flex={1}>
            <Flex rowGap={"10px"} justifyContent={"space-between"}>
              <Text fontSize={14} fontWeight={"semibold"}>
                Liquidity to be removed
              </Text>
              <Text fontSize={14}>$4.33</Text>
            </Flex>
            <Flex rowGap={"10px"} justifyContent={"space-between"}>
              <Text>LYDA</Text>
              <Text>$4.33</Text>
            </Flex>
            <Flex rowGap={"10px"} justifyContent={"space-between"}>
              <Text>USDC</Text>
              <Text>$4.33</Text>
            </Flex>
          </Flex>
          <DivisionLine />
        </Flex>
        <Flex flexDir={"column"} flex={1}>
          <Flex rowGap={"10px"} justifyContent={"space-between"}>
            <Text fontSize={14} fontWeight={"semibold"}>
              Fees Earned
            </Text>
            <Text fontSize={14}>$4.33</Text>
          </Flex>
          <Flex rowGap={"10px"} justifyContent={"space-between"}>
            <Text>LYDA</Text>
            <Text>$4.33</Text>
          </Flex>
          <Flex rowGap={"10px"} justifyContent={"space-between"}>
            <Text>USDC</Text>
            <Text>$4.33</Text>
          </Flex>
        </Flex>
      </>
    );
  }
  return null;
};

export default function RemoveTxnDetail() {
  const [isExpanded, setIsExpended] = useState<boolean>(false);

  return (
    <Flex
      w={"100%"}
      minH={"48px"}
      bg={"#1f2128"}
      borderRadius={"8px"}
      px={"20px"}
      flexDir={"column"}
      pt={isExpanded ? "20px" : "14px"}
      pb={isExpanded ? "20px" : ""}
    >
      <Title isExpanded={isExpanded} setIsExpended={setIsExpended} />
      <Content isExpanded={isExpanded}></Content>
    </Flex>
  );
}
