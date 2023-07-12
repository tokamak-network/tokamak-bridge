import TokenCard from "@/components/card/TokenCard";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import TOKEN_PAIR_PLUS_ICON from "assets/icons/tokenPairPlus.svg";
import Title from "./components/Title";
import TokenInput from "@/components/input/TokenInput";
import { useGetAmountForLiquidity } from "@/hooks/pool/useGetAmountForLiquidity";

export default function SelectPair() {
  const { inToken, inTokenInfo, outTokenInfo } = useInOutTokens();
  const { onOpenInToken, onOpenOutToken } = useTokenModal();

  const { amountForToken0, amountForToken1 } = useGetAmountForLiquidity({
    inTokenInput: true,
  });

  return (
    <Flex flexDir={"column"}>
      <Title title="Select Pair" />
      <Flex columnGap={"6px"}>
        <Flex flexDir={"column"} rowGap={"16px"}>
          <Box
            className="card-empty"
            display={"flex"}
            flexDir={"column"}
            w={"186px"}
            h={"242px"}
            onClick={() => onOpenInToken()}
          >
            {inTokenInfo ? (
              <TokenCard
                w={186}
                h={242}
                tokenInfo={inTokenInfo}
                hasInput={true}
                inNetwork={true}
              />
            ) : (
              <SearchToken />
            )}
          </Box>
          <Box w={"186px"}>
            <TokenInput inToken={true} />
          </Box>
        </Flex>

        <Image
          src={TOKEN_PAIR_PLUS_ICON}
          alt={"TOKEN_PAIR_PLUS_ICON"}
          style={{ marginBottom: "65px" }}
        />
        <Flex flexDir={"column"} rowGap={"16px"}>
          <Box
            className="card-empty"
            display={"flex"}
            flexDir={"column"}
            w={"186px"}
            h={"242px"}
            onClick={() => onOpenOutToken()}
          >
            {outTokenInfo ? (
              <TokenCard
                w={186}
                h={242}
                tokenInfo={outTokenInfo}
                hasInput={true}
                inNetwork={true}
              />
            ) : (
              <SearchToken onClick={() => onOpenOutToken()} />
            )}
          </Box>
          <Box w={"186px"}>
            <TokenInput inToken={false} hasMaxButton={true} />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
