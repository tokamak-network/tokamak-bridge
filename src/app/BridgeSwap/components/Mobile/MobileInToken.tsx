import Image from "next/image";
import { Flex, Text } from "@chakra-ui/react";
import ETHIcon from "@/assets/tokens/eth_half_rounded.svg"
import TitanIcon from "@/assets/tokens/titan_half_rounded.svg"

import { useRecoilState, useRecoilValue } from "recoil";
import { networkStatus, tokenModalStatus } from "@/recoil/bridgeSwap/atom";
import { Field } from "@/types/swap/swap";

const MobileInToken = () => {
  const {inNetwork} = useRecoilValue(networkStatus);
  const [tokenModal, setTokenModal] = useRecoilState(tokenModalStatus);

  return (
    <Flex
      pos={"relative"}
      w={"full"}
      h={"184px"}
      border={"2px dashed #313442"}
      rounded={"9px"}
      justify={"center"}
      align={"center"}
      cursor={"pointer"}
      onClick={() => setTokenModal({...tokenModal, isOpen: "INPUT"})}
    >
      <Flex
        pos={"absolute"}
        top={"-2px"}
        right={"-2px"}
        w={"34px"}
        h={"34px"}
        borderRadius={"0px 9px 0px 9px"}
        bg={"#2E3140"}
        justify={"center"}
        align={"center"}
      >
        <Flex
          w={"28px"}
          h={"28px"}
          borderRadius={"0px 6px 0px 6px"}
        >
          <Image alt="eth" src={inNetwork?.chainId === 1 ? ETHIcon : TitanIcon}/>
        </Flex>
      </Flex>

      <Text fontSize={16} fontWeight={500}>
        Select Token
      </Text>
    </Flex>
  );
};

export default MobileInToken;
