import { Flex, Box, Text, Button, Divider } from "@chakra-ui/react";
import TokenNetwork from "@/components/ui/TokenNetwork";

interface NumberInputProps {
  titleText?: string;
  value: number;
  onClickAdd: () => void;
  onClickRemove: () => void;
  onChange: (value: any) => void;
}

export default function LiquidityInfo(props: NumberInputProps) {
  const { titleText, value, onClickAdd, onClickRemove, onChange } = props;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    onChange(inputValue);
  };

  return (
    <Box
      bg="#1F2128"
      w="384px"
      h="230px"
      py="20px"
      px="16px"
      borderRadius={"12px"}
      mb={"16px"}
      mt={"20px"}
      alignItems="center"
    >
      <Flex flexDir="column" alignItems={"center"}>
        <Flex>
          <Flex flexDir={"column"} alignItems={"center"} mr={"35px"}>
            <Text color="#A0A3AD" mb={"17px"}>
              Remove
            </Text>
            <Button
              bg="#15161D"
              onClick={onClickAdd}
              _hover={{ bgColor: "#15161D" }}
              mr={"7px"}
            >
              -
            </Button>
          </Flex>
          <Flex flexDir={"column"} alignItems={"center"} mr={"35px"}>
            <Text fontSize={"16px"} mb={"17px"} as="b">
              Liquidity
            </Text>
            <Text fontSize={"38px"} as="b">
              $4.30
            </Text>
          </Flex>
          <Flex flexDir={"column"} alignItems={"center"}>
            <Text color="#A0A3AD" mb={"20px"}>
              Increase
            </Text>
            <Button
              bg="#15161D"
              onClick={onClickRemove}
              _hover={{ bgColor: "#15161D" }}
              ml={"7px"}
            >
              +
            </Button>
          </Flex>
        </Flex>
        <Divider style={{ border: "1px solid #313442" }} />
        <Flex flexDir={"column"} textAlign={"center"} justifyItems={"center"}>
          <Flex py="16px" justifyContent="space-between">
            <Flex justifyContent="start" mr={"118px"}>
              <TokenNetwork tokenType="LYDA" network="Ethereum" />
              <Text ml="12px" color="#A0A3AD">
                LYDA
              </Text>
            </Flex>
            <Flex justifyContent="end">
              <Text color="#A0A3AD" fontSize="18px">
                0.001403
              </Text>
              <Flex bgColor={"#15161D"} borderRadius={8} padding={1} ml={2}>
                <Text fontSize={"12px"} as="b">
                  {"30%"}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between">
            <Flex justifyContent="start" mr={"118px"}>
              <TokenNetwork tokenType="LYDA" network="Ethereum" />
              <Text ml="12px" color="#A0A3AD" fontSize={"13px"}>
                LYDA
              </Text>
            </Flex>
            <Flex justifyContent="end">
              <Text color="#A0A3AD" fontSize="18px">
                0.001403
              </Text>
              <Flex bgColor={"#15161D"} borderRadius={8} padding={1} ml={2}>
                <Text fontSize={"12px"} as="b">
                  {"30%"}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
