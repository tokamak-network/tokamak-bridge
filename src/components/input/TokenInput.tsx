import useTokenModal from "@/hooks/modal/useTokenModal";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";

export default function TokenInput(props: { inToken: boolean; style?: {} }) {
  const { inToken, style } = props;
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

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
      });
    }
  };

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
