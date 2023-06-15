import { Flex, Box, Text, Button, Input, Tooltip } from "@chakra-ui/react";
import AddIcon from "@/assets/icons/addIcon.svg";
import RemoveIcon from "@/assets/icons/removeIcon.svg";
import Image from "next/image";
import { useState } from "react";
import tooltipIcon from "@/assets/icons/tooltip.svg";

interface NumberInputProps {
  titleText: string;
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  isInputChange?: boolean;
  toolTip?: boolean;
  toolTipLabel?: string;
  inToken: string;
  outToken: string;
  border?: boolean;
  bgColor?: string;
  mr?: string;
}

export default function PriceInput(props: NumberInputProps) {
  const {
    titleText,
    value,
    onChange,
    min,
    max,
    step,
    isInputChange,
    toolTip,
    toolTipLabel,
    inToken,
    outToken,
    border,
    bgColor,
  } = props;
  const [changeInput, setChangeInput] = useState<boolean>(false);

  const handleIncrement = () => {
    const incrementedValue = value + (step || 1);
    if (max === undefined || incrementedValue <= max) {
      onChange && onChange(incrementedValue);
    }
  };

  const handleDecrement = () => {
    const decrementedValue = value - (step || 1);
    if (min === undefined || decrementedValue >= min) {
      onChange && onChange(decrementedValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    onChange && onChange(inputValue);
  };

  return (
    <Box
      bg="#1F2128"
      w="186px"
      h="109px"
      pt={border ? "10px" : "0px"}
      pb="8px"
      px="12px"
      bgColor={bgColor ? "#1F2128" : "transparent"}
      borderRadius={"12px"}
      border={border ? "1px solid #313442" : ""}
      mb={"10px"}
      mr={"12px"}
      mt={border ? "0px" : "-7px"}
    >
      <Flex flexDir="column" justifyContent={"center"} placeContent={"center"}>
        {toolTip ? (
          <Flex justifyContent={"center"}>
            <Text fontSize={"12px"}>{titleText}</Text>
            <Tooltip label={toolTipLabel}>
              <Image src={tooltipIcon} alt={"TooltipIcon"} />
            </Tooltip>
          </Flex>
        ) : (
          <Text fontSize={"12px"}>{titleText}</Text>
        )}
        <Flex alignItems="center" my={"8px"}>
          {isInputChange === true && (
            <Button
              bg="#15161D"
              onClick={handleDecrement}
              _hover={{ bgColor: "#15161D" }}
              mr={"7px"}
            >
              <Image src={RemoveIcon} alt={"RemoveLiquidity"} />
            </Button>
          )}
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
          {isInputChange === true && (
            <Button
              bg="#15161D"
              onClick={handleIncrement}
              _hover={{ bgColor: "#15161D" }}
              ml={"7px"}
            >
              <Image src={AddIcon} alt={"IncreaseLiquidity"} />
            </Button>
          )}
        </Flex>
        <Text fontSize={"12px"}>
          {inToken} per {outToken}
        </Text>
      </Flex>
    </Box>
  );
}
