import Image from "next/image";
import { useMemo } from "react";
import { Flex, Text, Box } from "@chakra-ui/react";

import { useRecoilState } from "recoil";
import { tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import TokenCard from "@/components/card/TokenCard";
import useConnectedNetwork from "@/hooks/network";

import ETHIcon from "@/assets/tokens/eth_half_rounded.svg";
import TitanIcon from "@/assets/tokens/titan_half_rounded.svg";

const MobileInToken = () => {
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);
  const { inToken } = useInOutTokens();

  const network = useConnectedNetwork();
  
  const tokenColorCode = useMemo(() => {
    switch (inToken?.tokenSymbol) {
      case "ETH":
        return "#627EEA";
      case "WETH":
        return "#393939";
      case "TON":
        return "#007AFF";
      case "WTON":
        return "#007AFF";
      case "TOS":
        return "#007AFF";
      case "DOC":
        return "#9e9e9e";
      case "AURA":
        return "#CB1000";
      case "LYDA":
        return "#4361EE";
      case "USDC":
        return "#2775CA";
      case "USDT":
        return "#50AF95";
      default:
        return "#9e9e9e";
    }
  }, [inToken]);
  
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
          hasInput={false}
          inNetwork={true}
          symbolSize={{ w: 64, h: 64 }}
          isPrice={true}
          type="small"
          isInput
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
        bg={inToken?.tokenName ? tokenColorCode : "#2E3140"}
        justify={"center"}
        align={"center"}
        zIndex={100}
      >
        <Flex w={"28px"} h={"28px"} borderRadius={"0px 6px 0px 6px"}>
          <Image
            alt="eth"
            src={network?.connectedChainId === 5050 || network?.connectedChainId === 55004 ? TitanIcon : ETHIcon}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default MobileInToken;
