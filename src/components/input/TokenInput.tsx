import useTokenModal from "@/hooks/modal/useTokenModal";
import {
  selectedInTokenStatus,
  selectedOutTokenStatus,
} from "@/recoil/bridgeSwap/atom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRecoilState } from "recoil";

export default function TokenInput(props: { style?: {} }) {
  const { style } = props;
  const { isInTokenOpen } = useTokenModal();
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    selectedInTokenStatus
  );
  const [selectedOutToken, setSelectedOutToken] = useRecoilState(
    selectedOutTokenStatus
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //This token is inToken
    if (isInTokenOpen && selectedInToken) {
      const value: string = e.target.value;
      if (value === "") {
        return setSelectedInToken({
          ...selectedInToken,
          amountBN: null,
        });
      }
      const parsedAmount = ethers.parseUnits(value, selectedInToken.decimals);
      return setSelectedInToken({ ...selectedInToken, amountBN: parsedAmount });
    }
    //This token is outToken
    if (!isInTokenOpen && selectedOutToken) {
      const value: string = e.target.value;
      if (value === "") {
        return setSelectedOutToken({
          ...selectedOutToken,
          amountBN: null,
        });
      }
      const parsedAmount = ethers.parseUnits(value, selectedOutToken.decimals);
      return setSelectedOutToken({
        ...selectedOutToken,
        amountBN: parsedAmount,
      });
    }
  };

  return (
    <Flex flexDir={"column"} rowGap={"16px"} {...style}>
      <Flex justifyContent={"space-between"}>
        <Input
          w={"153px"}
          h={"25px"}
          m={0}
          p={0}
          border={{}}
          _active={{}}
          _focus={{}}
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
