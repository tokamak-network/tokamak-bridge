import Image from "next/image";
import { useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import YourPools from "@/pools/YourPools";
import useMediaView from "@/hooks/mediaView/useMediaView";
import ScrolltoTopButton from "@/staging/components/cross-trade/components/ScrolltoTopButton";
import ImagePoolBox from "@/staging/components/cross-trade/components/core/coming/pool/ImagePoolBox";
import CTMain from "@/staging/components/cross-trade/components/core/main/CTMain";
import { ATOM_pool_page, ButtonType_Pools } from "@/recoil/pool/pages";
import { useRecoilState } from "recoil";

interface CrossTradeButtonProps {
  type: ButtonType_Pools;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function CrossTrade() {
  const { poolTabletView, poolMobileView, mobileView } = useMediaView();
  const dynamicWidth = poolMobileView
    ? "90%"
    : poolTabletView
    ? "536px"
    : "672px";

  const [activeButton, setActiveButton] =
    useRecoilState<ButtonType_Pools>(ATOM_pool_page);

  const CrossTradeButton = ({
    type,
    isActive,
    onClick,
    children,
  }: CrossTradeButtonProps) => (
    <Button
      ml={
        poolMobileView
          ? "0"
          : type === ButtonType_Pools.UNISWAP_POOL
          ? "16px"
          : "0"
      }
      mt={
        poolMobileView
          ? type === ButtonType_Pools.UNISWAP_POOL
            ? "12px"
            : "0"
          : "0"
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
      <Box w='full'>
        <Flex
          w={"100%"}
          flexDirection='column'
          justifyContent={"center"}
          alignItems='center'
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
            <CrossTradeButton
              type={ButtonType_Pools.CROSS_TRADE}
              isActive={ButtonType_Pools.CROSS_TRADE === activeButton}
              onClick={() => setActiveButton(ButtonType_Pools.CROSS_TRADE)}
            >
              Cross Trade Bridge Pool
            </CrossTradeButton>
            <CrossTradeButton
              type={ButtonType_Pools.UNISWAP_POOL}
              isActive={ButtonType_Pools.UNISWAP_POOL === activeButton}
              onClick={() => setActiveButton(ButtonType_Pools.UNISWAP_POOL)}
            >
              Uniswap v3 Pool
            </CrossTradeButton>
          </Flex>
        </Flex>
        <Flex
          bg={"#17181D"}
          pt={poolMobileView ? "24px" : "32px"}
          mt={poolMobileView ? "14px" : "16px"}
          w={"100%"}
          flexDirection='column'
          justifyContent={"flex-start"}
          alignItems='center'
          h={mobileView ? "85%" : "90%"}
        >
          <Box width={dynamicWidth}>
            <Box
              pb={poolMobileView ? "16px" : "24px"}
              top={0}
              position={"sticky"}
              bgColor={"#17181D"}
              w={"100%"}
              zIndex={1000}
            >
              <Text
                fontWeight={500}
                fontSize={poolMobileView ? "20px" : "30px"}
                lineHeight={poolMobileView ? "30px" : "45px"}
                color={"#FFFFFF"}
                textAlign={poolMobileView ? "center" : undefined}
              >
                {ButtonType_Pools.CROSS_TRADE === activeButton
                  ? "Cross Trade Bridge Pool"
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
                {ButtonType_Pools.CROSS_TRADE === activeButton
                  ? "Provide liquidity for cross trade, which helps users move tokens between layers and earn fees."
                  : "Add liquidity to a pool, and earn a swap fee based on the trading volume."}
              </Text>
            </Box>
            {ButtonType_Pools.CROSS_TRADE === activeButton ? (
              <Flex width='full' justifyContent={"center"}>
                <CTMain />
              </Flex>
            ) : (
              <Flex width='full' justifyContent={"center"}>
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
