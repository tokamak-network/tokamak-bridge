import { Flex, Box, Text, Button, Input } from "@chakra-ui/react";

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function PriceInput(props: NumberInputProps) {
  const { value, onChange, min, max, step } = props;

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

  return (
    <Box bg="#1F2128" w="186px" h="109px" p="10px" borderRadius={"12px"}>
      <Flex flexDir="column">
        <Text>Min price</Text>
        <Flex alignItems="center">
          <Button
            bg="#15161D"
            onClick={handleDecrement}
            _hover={{ bgColor: "#15161D" }}
          >
            -
          </Button>
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            step={step}
          />
          <Button
            bg="#15161D"
            onClick={handleIncrement}
            _hover={{ bgColor: "#15161D" }}
          >
            +
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
