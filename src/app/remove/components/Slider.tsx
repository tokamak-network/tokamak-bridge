import { useState } from "react";
import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Input,
} from "@chakra-ui/react";

interface PercentageSliderProps {
  sliderValue: number;
  onSliderValueChange: (value: number) => void;
}

function PercentageSlider(props: PercentageSliderProps) {
  const { sliderValue, onSliderValueChange } = props;
  const [inputValue, setInputValue] = useState<string>(`${sliderValue}%`);

  const handleButtonClick = (percentage: number) => {
    onSliderValueChange(percentage);
    setInputValue(`${percentage}%`);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    const parsedValue = parseInt(value.replace("%", ""), 10);
    if (!isNaN(parsedValue)) {
      onSliderValueChange(parsedValue);
    }
  };

  const handleSliderChange = (value: number) => {
    onSliderValueChange(value);
    setInputValue(`${value}%`);
  };

  return (
    <Box>
      <Flex justifyContent="flex-start">
        <Input
          w="135px"
          h="63px"
          p="5px"
          fontSize="42px"
          fontWeight="bold"
          color="#A0A3AD"
          border="none"
          mt={4}
          value={inputValue}
          onChange={handleInputChange}
          paddingRight="30px"
        />
        <Box position="absolute" right="10px" top="27px">
          %
        </Box>
        <Flex w="200px" alignItems="center" ml="25px">
          <Button
            w="48px"
            h="32px"
            bgColor="#1F2128"
            color="#A0A3AD"
            mr="8px"
            px="12px"
            py="7px"
            fontSize={12}
            _hover={{ border: "1px solid #007AFF" }}
            _active={{}}
            onClick={() => handleButtonClick(25)}
          >
            25%
          </Button>
          <Button
            w="48px"
            h="32px"
            bgColor="#1F2128"
            color="#A0A3AD"
            mr="8px"
            px="12px"
            py="7px"
            fontSize={12}
            _hover={{ border: "1px solid #007AFF" }}
            _active={{}}
            onClick={() => handleButtonClick(50)}
          >
            50%
          </Button>
          <Button
            w="48px"
            h="32px"
            bgColor="#1F2128"
            color="#A0A3AD"
            mr="8px"
            px="12px"
            py="7px"
            fontSize={12}
            _hover={{ border: "1px solid #007AFF" }}
            _active={{}}
            onClick={() => handleButtonClick(75)}
          >
            75%
          </Button>
          <Button
            w="48px"
            h="32px"
            bgColor="#1F2128"
            color="#A0A3AD"
            px="12px"
            py="7px"
            fontSize={12}
            _hover={{ border: "1px solid #007AFF" }}
            _active={{}}
            onClick={() => handleButtonClick(100)}
          >
            Max
          </Button>
        </Flex>
      </Flex>
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        position="absolute"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </Box>
  );
}

export default PercentageSlider;
