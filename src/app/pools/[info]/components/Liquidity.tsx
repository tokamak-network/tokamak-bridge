import { Flex, Box, Text, Button, Divider } from "@chakra-ui/react";
// import TokenNetwork from "@/components/ui/TokenNetwork";
import Link from "next/link";
import IncreaseIcon from "@/assets/icons/addIcon.svg";
import RemoveIcon from "@/assets/icons/removeIcon.svg";
import Image from "next/image";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { Token } from "@uniswap/sdk-core";
import commafy from "@/utils/trim/commafy";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";

const TokenLiquidityData = (props: {
  token: Token;
  liquidityAmount: number | string;
  liquidityPercent: number | undefined;
}) => {
  const { token, liquidityAmount, liquidityPercent } = props;
  return (
    <Flex justifyContent="space-between" h={"32px"}>
      <Flex justifyContent="start">
        {/* <TokenNetwork tokenType="LYDA" network="Ethereum" /> */}
        <Text ml="12px" color="#A0A3AD" fontSize="18px">
          {token.symbol}
        </Text>
      </Flex>
      <Flex justifyContent="end" columnGap={"12px"}>
        <Text color="#A0A3AD" fontSize="18px" fontWeight={500}>
          {liquidityAmount}
        </Text>
        <Text
          bgColor={"#15161D"}
          borderRadius={8}
          px={"8px"}
          py={"4px"}
          fontSize={"14px"}
          fontWeight={600}
          w={"48px"}
        >
          {liquidityPercent} {"%"}
        </Text>
      </Flex>
    </Flex>
  );
};
export default function Liquidity() {
  const { info } = usePositionInfo();

  if (info === undefined) {
    return null;
  }

  const { inverted, ratio } = usePoolInfo();

  return (
    <Box
      bg="#1F2128"
      w="100%"
      py="16px"
      px="20px"
      borderRadius={"12px"}
      alignItems="center"
    >
      <Flex flexDir="column" alignItems={"center"}>
        <Flex>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"17px"}>
            <Text color="#A0A3AD">Remove</Text>
            <Link href="/remove">
              <Flex
                w={"32px"}
                h={"32px"}
                bg="#15161D"
                _hover={{ bgColor: "#15161D", border: "1px solid #007AFF" }}
                border={" 1px solid #313442"}
                borderRadius={"8px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image src={RemoveIcon} alt={"RemoveIcon"} />
              </Flex>
            </Link>
          </Flex>
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            mx={"35px"}
            rowGap={"4px"}
            mb={"4px"}
          >
            <Text fontSize={"16px"} h={"24px"}>
              Liquidity
            </Text>
            <Text fontSize={"38px"} height={"57px"}>
              $4.30
            </Text>
          </Flex>
          <Flex flexDir={"column"} alignItems={"center"} rowGap={"17px"}>
            <Text color="#A0A3AD">Increase</Text>
            <Link href="/increase">
              <Flex
                w={"32px"}
                h={"32px"}
                bg="#15161D"
                _hover={{ bgColor: "#15161D", border: "1px solid #007AFF" }}
                border={" 1px solid #313442"}
                borderRadius={"8px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image src={IncreaseIcon} alt={"IncreaseLiquidity"} />
              </Flex>
            </Link>
          </Flex>
        </Flex>
        <Divider style={{ border: "1px solid #313442" }} />
        <Flex
          flexDir={"column"}
          textAlign={"center"}
          justifyItems={"center"}
          w={"100%"}
          pt={"16px"}
          rowGap={"12px"}
        >
          <TokenLiquidityData
            token={inverted ? info.token1 : info.token0}
            liquidityAmount={commafy(
              inverted ? info.token1Amount : info.token0Amount,
              6
            )}
            liquidityPercent={
              inverted ? ratio : ratio ? 100 - ratio : undefined
            }
          />
          <TokenLiquidityData
            token={inverted ? info.token0 : info.token1}
            liquidityAmount={commafy(
              inverted ? info.token0Amount : info.token1Amount,
              6
            )}
            liquidityPercent={inverted && ratio ? 100 - ratio : ratio}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
