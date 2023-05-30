import useTokenBalance from "@/hooks/contracts/balance/useTokenBalance";
import useTokenModal from "@/hooks/modal/useTokenModal";
import { useInOutNetwork } from "@/hooks/network";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useCallback, useMemo } from "react";
import { useRecoilState } from "recoil";

export default function TokenInput(props: { inToken: boolean; style?: {} }) {
  const { inToken, style } = props;
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );
  const { inNetwork, outNetwork } = useInOutNetwork();

  const tokenAddress = useMemo(() => {
    if (inToken && selectedInToken && inNetwork) {
      return selectedInToken.address[inNetwork.chainName];
    }
    if (inToken === false && selectedOutToken && outNetwork) {
      return selectedOutToken.address[outNetwork.chainName];
    }
    return null;
  }, [inNetwork, outNetwork, selectedInToken, selectedOutToken, inToken]);

  const tokenData = useTokenBalance(tokenAddress);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //This token is inToken
    if (inToken && selectedInToken) {
      const value: string = e.target.value;
      if (value === "") {
        return setSelectedInToken({
          ...selectedInToken,
          amountBN: null,
        });
      }
      const parsedAmount = ethers.utils.parseUnits(
        value,
        selectedInToken.decimals
      );
      return setSelectedInToken({
        ...selectedInToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
      });
    }
    //This token is outToken
    if (!inToken && selectedOutToken) {
      const value: string = e.target.value;
      if (value === "") {
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: null,
        });
      }
      const parsedAmount = ethers.utils.parseUnits(
        value,
        selectedOutToken.decimals
      );
      return setSelectedOutToken({
        ...selectedOutToken,
        amountBN: parsedAmount.toBigInt(),
        parsedAmount: value,
      });
    }
  };

  const onMax = useCallback(() => {
    if (tokenData) {
      if (inToken && selectedInToken) {
        return setSelectedInToken({
          ...selectedInToken,
          amountBN: tokenData.data.balanceBN.value,
          parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
        });
      }
      if (inToken === false && selectedOutToken) {
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: tokenData.data.balanceBN.value,
          parsedAmount: tokenData.data.parsedBalanceWithoutCommafied,
        });
      }
      return console.error("a input field not founded");
    }
  }, [tokenData, inToken, selectedInToken, selectedOutToken]);

  return (
    <Flex
      flexDir={"column"}
      justifyContent={"space-between"}
      pb={"16px"}
      {...style}
    >
      <Flex justifyContent={"space-between"}>
        <Input
          w={"153px"}
          h={"27px"}
          m={0}
          p={0}
          border={{}}
          _active={{}}
          _focus={{ boxShadow: "none !important" }}
          placeholder="0"
          color={"#ffffff"}
          fontSize={28}
          fontWeight={700}
          value={String(selectedInToken?.parsedAmount)}
          onChange={onChange}
        ></Input>
        <Button
          w={"40px"}
          h={"22px"}
          bgColor={"#6a00f1"}
          fontSize={12}
          fontWeight={700}
          _hover={{}}
          _active={{}}
          mt={"3px"}
          onClick={() => onMax()}
        >
          Max
        </Button>
      </Flex>
      <Flex w={"100%"} justifyContent={"flex-start"}>
        <Text fontSize={13} fontWeight={500} color={"#ffffff"} opacity={0.8}>
          $0.00
        </Text>
      </Flex>
    </Flex>
  );
}
