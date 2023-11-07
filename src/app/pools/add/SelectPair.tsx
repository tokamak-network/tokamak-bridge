import TokenCard from "@/components/card/TokenCard";
import SearchToken from "@/components/search/SearchToken";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import TOKEN_PAIR_PLUS_ICON from "assets/icons/tokenPairPlus.svg";
import Title from "./components/Title";
import { InputContainer } from "./components/InputContainer";
import { useAddLiquidityCondition } from "@/hooks/pool/useAddLiquidityCondition";
import { useInitialize } from "@/hooks/pool/useInitialize";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { ATOM_addInverted } from "@/recoil/pool/positions";

export default function SelectPair() {
  const { inTokenInfo, outTokenInfo } = useInOutTokens();
  const { onOpenInToken, onOpenOutToken } = useTokenModal();
  const { secondStepPassed } = useAddLiquidityCondition();
  const { initialzePoolValues } = useInitialize();
  const [inverted, setInvert] = useRecoilState(ATOM_addInverted);

  useEffect(() => {
    initialzePoolValues();
    setInvert(false);
  }, []);

  return (
    <Flex flexDir={"column"}>
      <Title title="Select Pair" />
      <Flex
        columnGap={"6px"}
        // flexDir={inverted ? "row-reverse" : "row"}
      >
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
                type={"small"}
                symbolSize={{ w: 86, h: 86 }}
              />
            ) : (
              <SearchToken />
            )}
          </Box>
          {inTokenInfo && (
            <InputContainer inToken={true} isDisabled={!secondStepPassed} />
          )}
        </Flex>

        <Image
          src={TOKEN_PAIR_PLUS_ICON}
          alt={"TOKEN_PAIR_PLUS_ICON"}
          style={{
            marginBottom:
              inTokenInfo === null && outTokenInfo === null ? "0px" : "61px",
          }}
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
                type={"small"}
                symbolSize={{ w: 86, h: 86 }}
              />
            ) : (
              <SearchToken onClick={() => onOpenOutToken()} />
            )}
          </Box>
          {outTokenInfo && (
            <InputContainer inToken={false} isDisabled={!secondStepPassed} />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
