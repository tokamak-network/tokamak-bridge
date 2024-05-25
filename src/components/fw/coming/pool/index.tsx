import Image from "next/image";
import { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";

import YourPools from "@/pools/YourPools";
import useMediaView from "@/hooks/mediaView/useMediaView";
import ScrolltoTopButton from "@/componenets/fw/coming/pool/ScrolltoTopButton";
import ImageBox from "@/componenets/fw/coming/pool/ImageBox";

export default function ComingPool() {
  enum PoolButtonType {
    Coming = "Coming Pool",
    Active = "Active Pool",
  }

  interface PoolComingButtonProps {
    type: PoolButtonType;
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }

  const { mobileView } = useMediaView();
  const dynamicWidth = mobileView ? "90%" : "654px";

  const [activeButton, setActiveButton] = useState<PoolButtonType>(
    PoolButtonType.Coming
  );

  const PoolComingButton = ({
    type,
    isActive,
    onClick,
    children,
  }: PoolComingButtonProps) => (
    <Button
      ml={mobileView ? "0" : type === PoolButtonType.Active ? "16px" : "0"}
      mt={mobileView ? (type === PoolButtonType.Active ? "12px" : "0") : "0"}
      w={mobileView ? "full" : "auto"}
      px={"16px"}
      py={"8px"}
      borderRadius={"8px"}
      border={isActive ? "1px solid #DB00FF" : ""}
      bg={"#17181D"}
      _active={{}}
      _hover={{}}
      onClick={onClick}
    >
      <Text
        fontWeight={500}
        fontSize={"14px"}
        lineHeight={"22px"}
        color={isActive ? "#DB00FF" : "#FFFFFF"}
      >
        {children}
      </Text>
    </Button>
  );

  return (
    <Flex
      pt={mobileView ? "80px" : "134px"}
      justifyContent={"center"}
      h={"100%"}
      w={"100%"}
    >
      <Box w='full'>
        <Flex
          w={"100%"}
          flexDirection='column'
          justifyContent={"center"}
          alignItems='center'
        >
          <Box width={dynamicWidth}>
            <Text
              fontSize={mobileView ? "20px" : "30px"}
              fontWeight={500}
              lineHeight={mobileView ? "30px" : "44px"}
              textAlign={mobileView ? "center" : undefined}
            >
              Generate & multiply income
            </Text>
            <Text
              fontSize={mobileView ? "20px" : "30px"}
              fontWeight={500}
              lineHeight={mobileView ? "30px" : "44px"}
              textAlign={mobileView ? "center" : undefined}
            >
              by providing liquidity
            </Text>
          </Box>
          <Flex
            mt={mobileView ? "24px" : "32px"}
            width={dynamicWidth}
            direction={mobileView ? "column" : "row"}
          >
            <PoolComingButton
              type={PoolButtonType.Coming}
              isActive={PoolButtonType.Coming === activeButton}
              onClick={() => setActiveButton(PoolButtonType.Coming)}
            >
              Cross Trade Bridge Pool
            </PoolComingButton>
            <PoolComingButton
              type={PoolButtonType.Active}
              isActive={PoolButtonType.Active === activeButton}
              onClick={() => setActiveButton(PoolButtonType.Active)}
            >
              Uniswap v3 Pool
            </PoolComingButton>
          </Flex>
        </Flex>
        <Flex
          bg={"#17181D"}
          py={mobileView ? "24px" : "32px"}
          mt={mobileView ? "14px" : "16px"}
          w={"100%"}
          flexDirection='column'
          justifyContent={"center"}
          alignItems='center'
        >
          <Box width={dynamicWidth}>
            <Box pb={mobileView ? "16px" : "24px"}>
              <Text
                fontWeight={500}
                fontSize={mobileView ? "20px" : "30px"}
                lineHeight={mobileView ? "30px" : "45px"}
                color={"#FFFFFF"}
                textAlign={mobileView ? "center" : undefined}
              >
                {PoolButtonType.Coming === activeButton
                  ? "Cross Trade Bridge Pool"
                  : "Uniswap V3 pool"}
              </Text>
              <Text
                fontWeight={400}
                fontSize={mobileView ? "12px" : "14px"}
                lineHeight={mobileView ? "18px" : "21px"}
                color={"#A0A3AD"}
                mt={"6px"}
                textAlign={mobileView ? "center" : undefined}
              >
                {PoolButtonType.Coming === activeButton
                  ? "Provide liquidity for cross trade, which helps users move tokens between layers and earn fees."
                  : "Add liquidity to a pool, and earn a swap fee based on the trading volume."}
              </Text>
            </Box>
            {PoolButtonType.Coming === activeButton ? (
              <Flex justifyContent='center' width='full'>
                <ImageBox isMobile={mobileView} />
              </Flex>
            ) : (
              <Flex justifyContent='center' width='full'>
                {mobileView ? (
                  <ImageBox isMobile={mobileView} isPool={true} />
                ) : (
                  <YourPools />
                )}
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>
      {!mobileView && <ScrolltoTopButton />}
    </Flex>
  );
}
