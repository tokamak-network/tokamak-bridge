import { SupportedTokenName, TokenInfo } from "types/token/supportedToken";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import NetworkDropdown from "../dropdown/Index";
import { TokenSymbol } from "../image/TokenSymbol";
import { useMemo } from "react";
import { useRecoilState } from "recoil";
import { SelectedInTokenStatus } from "@/recoil/bridgeSwap/atom";
import { ethers } from "ethers";

type TokenCardProps = {
  tokenInfo: TokenInfo;
  w?: string | number;
  h?: string | number;
  hasInput: boolean;
  inNetwork: boolean;
  style?: {};
};

const TopLine = () => {
  return (
    <Box
      pos={"absolute"}
      w={"400px"}
      h={"4.63px"}
      top={"-17px"}
      left={"-30px"}
      bg={"rgba(255, 255, 255, 0.5)"}
      transform={"rotate(-30deg)"}
    ></Box>
  );
};

const TokenTitle = (props: { tokenName: String }) => {
  return (
    <Text w={"60px"} fontSize={18} fontWeight={700} color={"#222222"}>
      {props.tokenName.toUpperCase()}
    </Text>
  );
};

const TokenInput = () => {
  const [selectedInToken, setSelectedInToken] = useRecoilState(
    SelectedInTokenStatus
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedAmount = ethers.parseUnits(value, "ether");
    if (selectedInToken) {
      setSelectedInToken({ ...selectedInToken, amountBN: parsedAmount });
    }
  };

  return (
    <Input
      w={"100%"}
      h={"35px"}
      border={{}}
      _focus={{ borderColor: "none", boxShadow: "none !important" }}
      _active={{}}
      p={0}
      onChange={onChange}
      fontSize={28}
      line-height={"35px"}
    />
  );
};

export default function TokenCard(props: TokenCardProps) {
  const { tokenInfo, w, h, hasInput, inNetwork, style } = props;
  const tokenColorCode = useMemo(() => {
    switch (tokenInfo?.tokenName) {
      case "ETH":
        return "#222222";
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
      default:
        return "#9e9e9e";
    }
  }, [tokenInfo]);

  return (
    <Flex
      w={typeof w === "string" ? w : `${w ?? 208}px`}
      height={typeof h === "string" ? h : `${h ?? 270}px`}
      bg={`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), ${tokenColorCode};`}
      opacity={0.85}
      border={`3px solid ${tokenColorCode} `}
      borderRadius={"16px"}
      pos={"relative"}
      pt={"15px"}
      pb={"32px"}
      overflow={"hidden"}
      flexDir={"column"}
      justifyContent={"space-between"}
      px={"16px"}
      cursor={"pointer"}
      {...style}
    >
      <TopLine />
      <Flex justifyContent={"space-between"} alignItems={"center"} w={"100%"}>
        <TokenTitle tokenName={tokenInfo?.tokenName ?? "TOKEN"} />
        {hasInput && <NetworkDropdown inNetwork={inNetwork} />}
      </Flex>
      <Flex
        // pt={"25px"}
        // pb={"37px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TokenSymbol tokenType={tokenInfo?.tokenName} />
      </Flex>
      <Flex flexDir={"column"} rowGap={"13px"}>
        <Flex fontSize={11} h={"8px"} color={"#222222"} columnGap={"2px"}>
          <Text fontWeight={400}>Blaance : </Text>
          <Text fontWeight={700}>0</Text>
        </Flex>
        <Flex justifyContent={"space-between"}>
          <Flex
            color={"#222222"}
            fontSize={28}
            fontWeight={700}
            w={hasInput ? "110px" : "100%"}
            h={"20px"}
          >
            {hasInput ? (
              <TokenInput />
            ) : (
              <Text w={"100%"} h={"100%"}>
                5000.00
              </Text>
            )}
          </Flex>
          {hasInput && (
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
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
