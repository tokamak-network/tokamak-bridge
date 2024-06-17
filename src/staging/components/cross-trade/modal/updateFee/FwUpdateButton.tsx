import React, { useState } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { UpdateFeeButtonType } from "@/staging/components/cross-trade/types";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: UpdateFeeButtonType;
  marginLeft?: string;
}

function ToggleButton({
  isActive,
  onClick,
  label,
  marginLeft = "0",
}: ToggleButtonProps) {
  const buttonStyle = {
    width: "162px",
    height: "32px",
    bg: isActive ? "#DB00FF" : "transparent",
    borderRadius: "16px",
    padding: "6px 56.5px",
    ml: marginLeft,
    _hover: { bg: isActive ? "#DB00FF" : "#1F2128" },
  };

  return (
    <Button {...buttonStyle} _active={{}} onClick={onClick}>
      <Text
        color={isActive ? "#FFFFFF" : "#A0A3AD"}
        fontSize='12px'
        fontWeight={400}
        lineHeight={"18px"}
      >
        {label}
      </Text>
    </Button>
  );
}

interface FwUpdateButtonProps {
  activeButton: UpdateFeeButtonType;
  setActiveButton: React.Dispatch<React.SetStateAction<UpdateFeeButtonType>>;
}

export default function FwUpdateButton({
  activeButton,
  setActiveButton,
}: FwUpdateButtonProps) {
  return (
    <Flex
      width='332px'
      bg='#1F2128'
      border='1px solid #DB00FF'
      borderRadius='32px'
    >
      <ToggleButton
        isActive={activeButton === UpdateFeeButtonType.Update}
        onClick={() => setActiveButton(UpdateFeeButtonType.Update)}
        label={UpdateFeeButtonType.Update}
      />
      <ToggleButton
        isActive={activeButton === UpdateFeeButtonType.Refund}
        onClick={() => setActiveButton(UpdateFeeButtonType.Refund)}
        label={UpdateFeeButtonType.Refund}
        marginLeft='8px'
      />
    </Flex>
  );
}
