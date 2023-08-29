import { Flex, Box, Text } from "@chakra-ui/react";
import RemoveInactiveIcon from "@/assets/icons/pool/removeInactiveIcon.svg";
import RemoveIcon from "@/assets/icons/pool/removeIconBlue.svg";
import IncreaseIcon from "@/assets/icons/pool/increaseIconBlue.svg";
import Image from "next/image";
import { usePositionInfo } from "@/hooks/pool/useGetPositionIds";
import { Token } from "@uniswap/sdk-core";
import commafy from "@/utils/trim/commafy";
import { usePoolInfo } from "@/hooks/pool/usePoolInfo";
import TokenSymbolWithNetwork from "@/components/image/TokenSymbolWithNetwork";
import { usePricePair } from "@/hooks/price/usePricePair";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { smallNumberFormmater } from "@/utils/number/compareNumbers";

const TokenLiquidityData = (props: {
  token: Token;
  liquidityAmount: number | string;
  liquidityPercent: number | undefined;
}) => {
  const { token, liquidityAmount, liquidityPercent } = props;
  return (
    <Flex justifyContent="space-between" h={"32px"} alignItems={"center"}>
      <Flex justifyContent="start">
        <TokenSymbolWithNetwork
          tokenSymbol={token.symbol as string}
          chainId={token.chainId}
          symbolW={32}
          symbolH={32}
          networkSymbolH={16}
          networkSymbolW={16}
        />
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
          w={"53px"}
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

  const { ratio } = usePoolInfo();
  const { token0, token0Amount, token1, token1Amount, isClosed } = info;

  const { totalMarketPrice } = usePricePair({
    token0Name: token0.name,
    token0Amount: Number(commafy(token0Amount, 4).replaceAll(",", "")),
    token1Name: token1.name,
    token1Amount: Number(commafy(token1Amount, 4).replaceAll(",", "")),
  });

  const router = useRouter();

  const onClickToRoute = useCallback(async (remove?: boolean) => {
    return router.push(
      remove ? `/pools/remove/${info.id}` : `/pools/increase/${info.id}/`
    );
  }, []);

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
        <Flex w={"100%"} justifyContent={"space-between"} px={"10px"}>
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            rowGap={"20px"}
            pt={"2px"}
          >
            <Text color="#A0A3AD" fontSize={13}>
              Remove
            </Text>
            <Box
              onClick={() => (isClosed ? null : onClickToRoute(true))}
              cursor={isClosed ? "" : "pointer"}
            >
              <Flex
                w={"32px"}
                h={"32px"}
                bg="#15161D"
                border={isClosed ? "" : " 1px solid #007AFF"}
                borderRadius={"8px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image
                  src={isClosed ? RemoveInactiveIcon : RemoveIcon}
                  alt={"RemoveIcon"}
                />
              </Flex>
            </Box>
          </Flex>
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            rowGap={"4px"}
            mb={"4px"}
          >
            <Text fontSize={"16px"} h={"24px"}>
              Liquidity
            </Text>
            <Text fontSize={"38px"} height={"57px"}>
              {`$${
                totalMarketPrice.split(".")[0]?.length > 4
                  ? totalMarketPrice.split(".")[0]
                  : totalMarketPrice
              }`}
            </Text>
          </Flex>
          <Flex
            flexDir={"column"}
            alignItems={"center"}
            rowGap={"20px"}
            pt={"2px"}
          >
            <Text color="#A0A3AD" fontSize={13}>
              Increase
            </Text>
            <Box onClick={() => onClickToRoute(false)} cursor={"pointer"}>
              <Flex
                w={"32px"}
                h={"32px"}
                bg="#15161D"
                border={" 1px solid #007AFF"}
                borderRadius={"8px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Image src={IncreaseIcon} alt={"IncreaseLiquidity"} />
              </Flex>
            </Box>
          </Flex>
        </Flex>
        <Box w={"100%"} h={"1px"} bgColor={"#313442"} />
        <Flex
          flexDir={"column"}
          textAlign={"center"}
          justifyItems={"center"}
          w={"100%"}
          pt={"16px"}
          rowGap={"12px"}
        >
          <TokenLiquidityData
            token={info.token1}
            liquidityAmount={smallNumberFormmater(
              info.token1Amount.toString(),
              6
            )}
            liquidityPercent={100 - (ratio ?? 0)}
          />
          <TokenLiquidityData
            token={info.token0}
            liquidityAmount={smallNumberFormmater(
              info.token0Amount.toString(),
              6
            )}
            liquidityPercent={ratio}
          />
        </Flex>
      </Flex>
    </Box>
  );
}
