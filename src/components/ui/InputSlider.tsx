import React, { ChangeEvent, useCallback } from "react";
import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";

interface InputSliderProps {
  value: number;
  onChange: (value: number | number[]) => void; // Update the type of onChange
  step?: number;
  min?: number;
  max?: number;
  size?: number;
}

const InputSlider: React.FC<InputSliderProps> = ({
  value,
  onChange,
  min = 0,
  step = 1,
  max = 100,
  size = 28,
  ...rest
}) => {
  const changeCallback = useCallback(
    (newValue: number | number[]) => {
      if (typeof newValue === "number") {
        onChange(newValue);
      }
    },
    [onChange]
  );

  return (
    <Slider
      size="sm"
      defaultValue={value}
      onChange={changeCallback}
      min={min}
      max={max}
      step={step}
      {...rest}
    >
      <SliderTrack>
        <SliderFilledTrack bgGradient="linear(to-r, accentAction, accentAction)" />
      </SliderTrack>
      <SliderThumb boxSize={size} bg="accentAction" boxShadow="base" />
    </Slider>
  );
};

export default InputSlider;
