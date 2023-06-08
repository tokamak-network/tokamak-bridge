import { Flex, Box, Text, Button, Input } from "@chakra-ui/react";

interface NumberInputProps {
  titleText: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function PriceInput(props: NumberInputProps) {
  const { titleText, value, onChange, min, max, step } = props;

  const handleIncrement = () => {
    const incrementedValue = value + (step || 1);
    if (max === undefined || incrementedValue <= max) {
      onChange(incrementedValue);
    }
  };

  const handleDecrement = () => {
    const decrementedValue = value - (step || 1);
    if (min === undefined || decrementedValue >= min) {
      onChange(decrementedValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    onChange(inputValue);
  };

  return (
    <Box
      bg="#1F2128"
      w="186px"
      h="109px"
      pt="10px"
      pb="13px"
      px="12px"
      borderRadius={"12px"}
      mb={"10px"}
    >
      <Flex flexDir="column">
        <Text fontSize={"12px"}>{titleText}</Text>
        <Flex alignItems="center" my={"8px"}>
          <Button
            bg="#15161D"
            onClick={handleDecrement}
            _hover={{ bgColor: "#15161D" }}
            mr={"7px"}
          >
            -
          </Button>
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            variant="unstyled"
            style={{ textAlign: "center" }}
          />
          <Button
            bg="#15161D"
            onClick={handleIncrement}
            _hover={{ bgColor: "#15161D" }}
            ml={"7px"}
          >
            +
          </Button>
        </Flex>
        <Text fontSize={"12px"}>USDC per ETH</Text>
      </Flex>
    </Box>
  );
}
