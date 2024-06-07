import Image from "next/image";
import { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";

import YourPools from "@/pools/YourPools";
import useMediaView from "@/hooks/mediaView/useMediaView";
import ScrolltoTopButton from "@/componenets/fw/coming/pool/ScrolltoTopButton";
import ImageComingBox from "@/componenets/fw/coming/pool/ImageComingBox";
import ImagePoolBox from "@/componenets/fw/coming/pool/ImagePoolBox";

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

  const { poolTabletView, poolMobileView } = useMediaView();
  const dynamicWidth = poolMobileView
    ? "90%"
    : poolTabletView
    ? "536px"
    : "672px";

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
      ml={poolMobileView ? "0" : type === PoolButtonType.Active ? "16px" : "0"}
      mt={
        poolMobileView ? (type === PoolButtonType.Active ? "12px" : "0") : "0"
      }
      w={poolMobileView ? "full" : "auto"}
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
        color={isActive ? "#DB00FF" : "#8E8E92"}
      >
        {children}
      </Text>
    </Button>
  );

  return (
    <Flex
      pt={poolMobileView ? "80px" : "134px"}
      justifyContent={"center"}
      h={"100%"}
      w={"100%"}
    >
      <Box w="full">
        <Flex
          w={"100%"}
          flexDirection="column"
          justifyContent={"center"}
          alignItems="center"
        >
          <Box width={dynamicWidth}>
            <Text
              fontSize={poolMobileView ? "20px" : "30px"}
              fontWeight={500}
              lineHeight={poolMobileView ? "30px" : "44px"}
              textAlign={poolMobileView ? "center" : undefined}
            >
              Generate & multiply income
            </Text>
            <Text
              fontSize={poolMobileView ? "20px" : "30px"}
              fontWeight={500}
              lineHeight={poolMobileView ? "30px" : "44px"}
              textAlign={poolMobileView ? "center" : undefined}
            >
              by providing liquidity
            </Text>
          </Box>
          <Flex
            mt={poolMobileView ? "24px" : "32px"}
            width={dynamicWidth}
            direction={poolMobileView ? "column" : "row"}
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
          pt={poolMobileView ? "24px" : "32px"}
          mt={poolMobileView ? "14px" : "16px"}
          w={"100%"}
          flexDirection="column"
          justifyContent={"flex-start"}
          alignItems="center"
          h={"90%"}
        >
          <Box width={dynamicWidth}>
            <Box pb={poolMobileView ? "16px" : "24px"}>
              <Text
                fontWeight={500}
                fontSize={poolMobileView ? "20px" : "25px"}
                lineHeight={poolMobileView ? "30px" : "37.5px"}
                color={"#FFFFFF"}
                textAlign={poolMobileView ? "center" : undefined}
              >
                {PoolButtonType.Coming === activeButton
                  ? "Coming Soon"
                  : "Uniswap V3 pool"}
              </Text>
              <Text
                fontWeight={400}
                fontSize={poolMobileView ? "12px" : "14px"}
                lineHeight={poolMobileView ? "18px" : "21px"}
                color={"#A0A3AD"}
                mt={"6px"}
                textAlign={poolMobileView ? "center" : undefined}
              >
                {PoolButtonType.Coming === activeButton
                  ? "Cross Trade Bridge is an upcoming service that enables token trading across layers."
                  : "Add liquidity to a pool, and earn a swap fee based on the trading volume."}
              </Text>
            </Box>
            {PoolButtonType.Coming === activeButton ? (
              <Flex width="full" justifyContent={"center"}>
                <ImageComingBox isMobile={poolMobileView} />
              </Flex>
            ) : (
              <Flex width="full" justifyContent={"center"}>
                {poolMobileView ? (
                  <ImagePoolBox isMobile={true} />
                ) : poolTabletView ? (
                  <ImagePoolBox isMobile={false} />
                ) : (
                  <YourPools />
                )}
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>
      {!poolTabletView && <ScrolltoTopButton />}
    </Flex>
  );
}
