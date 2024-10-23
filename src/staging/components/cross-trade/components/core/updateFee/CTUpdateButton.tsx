import React, { useState } from "react";
import { Flex, Button, Text } from "@chakra-ui/react";
import { UpdateFeeButtonType } from "@/staging/components/cross-trade/types";

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: UpdateFeeButtonType;
  marginLeft?: string;
  isMobile: boolean;
}

function ToggleButton({
  isActive,
  onClick,
  label,
  marginLeft = "0",
  isMobile,
}: ToggleButtonProps) {
  const buttonStyle = {
    width: isMobile ? "100%" : "162px",
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

interface CTUpdateButtonProps {
  activeButton: UpdateFeeButtonType;
  setActiveButton: React.Dispatch<React.SetStateAction<UpdateFeeButtonType>>;
  isMobile: boolean;
}

export default function CTUpdateButton({
  activeButton,
  setActiveButton,
  isMobile,
}: CTUpdateButtonProps) {
  return (
    <Flex
      width={isMobile ? "100%" : "332px"}
      bg='#1F2128'
      border='1px solid #DB00FF'
      borderRadius='32px'
    >
      <ToggleButton
        isActive={activeButton === UpdateFeeButtonType.Update}
        onClick={() => setActiveButton(UpdateFeeButtonType.Update)}
        label={UpdateFeeButtonType.Update}
        isMobile={isMobile}
      />
      <ToggleButton
        isActive={activeButton === UpdateFeeButtonType.CancelRequest}
        onClick={() => setActiveButton(UpdateFeeButtonType.CancelRequest)}
        label={UpdateFeeButtonType.CancelRequest}
        marginLeft='8px'
        isMobile={isMobile}
      />
    </Flex>
  );
}
