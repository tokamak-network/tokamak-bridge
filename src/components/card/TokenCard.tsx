import { Box, Flex, Text } from "@chakra-ui/react";

const TopLine = () => {
  return (
    <Box
      pos={"absolute"}
      w={"208px"}
      h={"4.63px"}
      left={"0%"}
      bg={"rgba(255, 255, 255, 0.5)"}
      transform={"rotate(-30deg)"}
    ></Box>
  );
};

const TokenTitle = (props: { tokenName: string }) => {
  return (
    <Text
      w={"60px"}
      h={"13px"}
      fontSize={18}
      fontWeight={700}
      color={"#222222"}
    >
      {props.tokenName.toUpperCase()}
    </Text>
  );
};

export default function TokenCard() {
  return (
    <Flex
      w={"208px"}
      height={"270px"}
      bg={
        "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), #9E9E9E;"
      }
      opacity={0.85}
      border={"3px solid #9E9E9E"}
      borderRadius={"16px"}
      pos={"relative"}
      pt={"24px"}
      pl={"16px"}
      overflow={"hidden"}
    >
      <TopLine />
      <TokenTitle tokenName="TOKEN" />
    </Flex>
  );
}
