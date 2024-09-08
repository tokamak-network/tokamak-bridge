import { Tooltip } from "@/staging/components/common/Tooltip";
import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

interface ButtonComponentProps {
  content: string;
  toolTip?: string;
  disabled?: boolean;
  onClick?: () => void;
}

const ButtonComponent: React.FC<ButtonComponentProps> = (props) => {
  const { content, toolTip, disabled, onClick } = props;
  return (
    <Button
      width={"100%"}
      height={"100%"}
      borderRadius={"8px"}
      bgColor={disabled ? "#17181D !important" : "#007AFF !important"}
      disabled={disabled}
      onClick={onClick}
      py={"12px"}
    >
      <Flex gap={"2px"} alignItems={"center"}>
        <Text
          fontSize={"16px"}
          fontWeight={600}
          lineHeight={"normal"}
          color={disabled ? "#8E8E92" : "white"}
        >
          {content}
        </Text>
        {toolTip && (
          <Tooltip tooltipLabel={toolTip} type={disabled ? "grey" : "white"} />
        )}
      </Flex>
    </Button>
  );
};

export default ButtonComponent;
