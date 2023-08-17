import {
  Flex,
  Text,
  Box,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import Title from "../../add/components/Title";
import { useRecoilState } from "recoil";
import { removeAmount } from "@/recoil/pool/setPoolPosition";

const values = [25, 50, 75, 100];

export default function SelectPercentage() {
  const [amountPercentage, setAmountPercentage] = useRecoilState(removeAmount);
  const handleClick = (value: number) => {
    setAmountPercentage(value);
  };

  return (
    <Flex flexDir={"column"}>
      <Title title="Select Amount" />
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Text
          fontSize={"42px"}
          fontWeight={500}
          color={amountPercentage === 0 ? "#A0A3AD" : "#fff"}
        >
          {`${amountPercentage}%`}
        </Text>
        <Flex
          justifyContent="space-between"
          columnGap={"8px"}
          color={"#A0A3AD !important"}
        >
          {values.map((value, index) => (
            <Button
              key={`${index}_${value}`}
              width="48px"
              height="32px"
              border={amountPercentage === value ? "1px solid #007AFF" : "none"}
              borderRadius="8px"
              textAlign="center"
              fontSize={12}
              fontWeight={400}
              bg="#1F2128"
              onClick={() => handleClick(value)}
              variant={"outline"}
              _hover={{
                border: "1px solid #007AFF",
              }}
              _focus={{}}
              _active={{}}
            >
              {value === 100 ? "MAX" : `${value}%`}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Slider
        aria-label="slider-ex-4"
        value={amountPercentage}
        focusThumbOnChange={false}
        onChange={(v) => setAmountPercentage(v)}
        w={
          amountPercentage === 0 || amountPercentage === 100
            ? "350px !important"
            : "100%"
        }
        ml={amountPercentage === 0 ? "10px" : 0}
        mr={amountPercentage === 100 ? "10px" : 0}
      >
        <SliderTrack bg="#007AFF">
          <SliderFilledTrack bg="#007AFF" />
        </SliderTrack>
        <SliderThumb boxSize={6}>
          <Box color="#007AFF" css={{ background: "007AFF !important" }} />
        </SliderThumb>
      </Slider>
    </Flex>
  );
}
