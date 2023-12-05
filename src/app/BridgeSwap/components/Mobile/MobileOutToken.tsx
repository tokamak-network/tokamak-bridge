import Image from "next/image";
import { Box, Flex, Text } from "@chakra-ui/react";
import ETHIcon from "@/assets/tokens/eth_half_rounded.svg";
import TitanIcon from "@/assets/tokens/titan_half_rounded.svg";

import { useRecoilState, useRecoilValue } from "recoil";
import { networkStatus, tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { actionMode } from "@/recoil/bridgeSwap/atom";
import TokenCard from "@/components/card/TokenCard";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useGetMode } from "@/hooks/mode/useGetMode";

const MobileInToken = () => {
  const { outNetwork } = useRecoilValue(networkStatus);
  const { mode, swapSection } = useGetMode();
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const { outToken } = useInOutTokens();

  return (
    <Box
      pos="relative"
      w={"148px"}
      h={"184px"}
      cursor={"pointer"}
      onClick={() => swapSection && setTokenModal({ ...tokenModal, isOpen: "OUTPUT" })}
    >
      {outToken?.tokenName ? (
        <TokenCard
          w={"100%"}
          h={"100%"}
          tokenInfo={outToken}
          hasInput={true}
          inNetwork={true}
          symbolSize={{ w: 64, h: 64 }}
          isPrice
        />
      ) : (
        <Flex
          pos={"relative"}
          w={"148px"}
          h={"184px"}
          border={"2px dashed #313442"}
        rounded={"9px"}
          justify={"center"}
          align={"center"}
          rowGap={"8px"}
          flexDir={"column"}
        >
          {mode === "Deposit" ? (
            <Image alt="titan" src={TitanIcon} />
          ) : mode === "Withdraw" ? (
            <Image alt="eth" src={ETHIcon} />
          ) : (
            ""
          )}
          <Text fontSize={16} fontWeight={500}>
            {mode === "Deposit"
              ? "Titan"
              : mode === "Withdraw"
              ? "Ethereum"
              : "Select Token"}
          </Text>
        </Flex>
      )}
      {mode !== "Deposit" && mode !== "Withdraw" && (
        <Flex
          pos={"absolute"}
          top={"0px"}
          right={"0px"}
          w={"34px"}
          h={"34px"}
          borderRadius={"0px 9px 0px 9px"}
          bg={"#2E3140"}
          justify={"center"}
          align={"center"}
        >
          <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
            <Image
              alt="eth"
              src={outNetwork?.chainId === 1 || outNetwork?.chainId === 5 ? ETHIcon : TitanIcon}
            />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default MobileInToken;
