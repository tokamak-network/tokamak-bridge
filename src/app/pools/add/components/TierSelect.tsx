import { Box, Button, Flex } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { initialPrice, poolFeeStatus } from "@/recoil/pool/setPoolPosition";
import { FeeAmount } from "@uniswap/v3-sdk";

const values: FeeAmount[] = [
  FeeAmount.LOWEST,
  FeeAmount.LOW,
  FeeAmount.MEDIUM,
  FeeAmount.HIGH,
];

export default function TierSelector() {
  const [poolFee, setPoolFee] = useRecoilState(poolFeeStatus);
  const [, setInitialPrice] = useRecoilState(initialPrice);

  const handleClick = (value: FeeAmount) => {
    setInitialPrice("0");
    setPoolFee(value);
  };

  return (
    <Box w={"408px"} h={"64px"} padding="12px" borderRadius="8px" bg="#1F2128">
      <Flex justifyContent="space-between">
        {values.map((value, index) => (
          <Button
            key={index}
            width="90px"
            height="40px"
            border={
              poolFee === value ? "1px solid #007AFF" : "1px solid #313442"
            }
            borderRadius="8px"
            paddingTop="7px"
            paddingBottom="6px"
            textAlign="center"
            marginRight={index !== values.length - 1 ? "8px" : "0"}
            onClick={() => handleClick(value)}
            variant={"outline"}
            _hover={{
              backgroundColor: "transparent",
              borderColor: "#007AFF",
            }}
            fontWeight={400}
          >
            {value === FeeAmount.LOWEST
              ? "0.01%"
              : value === FeeAmount.LOW
              ? "0.05%"
              : value === FeeAmount.MEDIUM
              ? "0.3%"
              : "1%"}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
