import Image from "next/image";
import { Flex, Text, Box } from "@chakra-ui/react";
import ETHIcon from "@/assets/tokens/eth_half_rounded.svg";
import TitanIcon from "@/assets/tokens/titan_half_rounded.svg";

import { useRecoilState, useRecoilValue } from "recoil";
import { networkStatus, tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import TokenCard from "@/components/card/TokenCard";
import { useNetwork } from "wagmi";
import useConnectedNetwork from "@/hooks/network";

const MobileInToken = () => {
  const { inNetwork } = useRecoilValue(networkStatus);
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const { inToken } = useInOutTokens();

  const network = useConnectedNetwork();

  return (
    <Box
      pos="relative"
      w={"148px"}
      h={"184px"}
      cursor={"pointer"}
      onClick={() => setTokenModal({ ...tokenModal, isOpen: "INPUT" })}
    >
      {inToken?.tokenName ? (
        <TokenCard
          w={"100%"}
          h={"100%"}
          tokenInfo={inToken}
          hasInput={true}
          inNetwork={true}
          symbolSize={{ w: 64, h: 64 }}
        />
      ) : (
        <Flex
          pos={"relative"}
          w={"full"}
          h={"full"}
          border={"2px dashed #313442"}
          rounded={"9px"}
          justify={"center"}
          align={"center"}
        >
          <Text fontSize={16} fontWeight={500}>
            Select Token
          </Text>
        </Flex>
      )}
      <Flex
        pos={"absolute"}
        top={"0px"}
        right={"0px"}
        w={"34px"}
        h={"34px"}
        borderRadius={"0px 9px 0px 9px"}
        bg={inToken?.tokenName ? "#007AFF6F" : "#2E3140"}
        justify={"center"}
        align={"center"}
        zIndex={100}
      >
        <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
          <Image
            alt="eth"
            src={network?.connectedChainId === 1 || network?.connectedChainId === 5 ? ETHIcon : TitanIcon}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default MobileInToken;
