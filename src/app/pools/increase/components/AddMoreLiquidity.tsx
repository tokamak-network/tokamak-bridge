import { Flex, Box,Text } from "@chakra-ui/react";
import Title from "../../add/components/Title";
import useGetIncreaseLiquidity from "@/hooks/pool/useIncreaseLiquidity";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import TokenCard from "@/components/card/TokenCard";
import add from "assets/icons/addIcon.svg";
import Image from "next/image";
import TokenInput from "@/components/input/TokenInput";
export default function AddMoreLiquidity() {
  const { liquidityInfo } = useGetIncreaseLiquidity();
  const { inToken, inTokenInfo, outTokenInfo } = useInOutTokens();

  return (
    <Flex  flexDir={"column"} pl="20px" justifyContent={'flex-start'}>
      <Title title="Add more liquidity" />
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Flex flexDir={"column"}>
          <TokenCard
            w={186}
            h={"242px"}
            tokenInfo={liquidityInfo.token0}
            hasInput={true}
            inNetwork={true}
          />
          <Flex w={"186px"} mt="16px">
            <TokenInput inToken={true} hasMaxButton={true}  style={{paddingBottom: '7px'}} />
          </Flex>
          <Text color='#fff' opacity={0.8} fontSize={'13px'}>$0.00</Text>
        </Flex>

        <Flex mx="6px" h={"24px"} w="24px" justifyContent={"center"} mt={'-61px'}>
          <Image src={add} alt="add" />
        </Flex>
        <Flex flexDir={"column"}>
          <TokenCard
            w={186}
            h={"242px"}
            tokenInfo={liquidityInfo.token1}
            hasInput={true}
            inNetwork={true}
          />
          <Flex w={"186px"} mt="16px">
            <TokenInput inToken={true} hasMaxButton={true}  style={{paddingBottom: '7px'}}/>
          </Flex>
          <Text color='#fff' opacity={0.8} fontSize={'13px'}>$0.00</Text>
        </Flex>
      </Flex>
    </Flex>
  );
}
