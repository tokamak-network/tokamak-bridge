import { Tooltip } from "@/staging/components/common/Tooltip";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import React from "react";

interface ButtonComponentProps {
  content: string;
  toolTip?: string;
  disabled?: boolean;
  onClick?: () => void;
  fontSize?: number;
  pendingStatus?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = (props) => {
  const { content, toolTip, disabled, onClick, fontSize, pendingStatus } =
    props;
  return (
    <Button
      width={"100%"}
      height={"100%"}
      borderRadius={"8px"}
      bgColor={disabled ? "#17181D !important" : "#007AFF !important"}
      isDisabled={disabled}
      onClick={onClick}
      opacity={"1 !important"}
      py={"12px"}
      cursor={"pointer !important"}
    >
      {!pendingStatus ? (
        <Flex gap={"2px"} alignItems={"center"}>
          <Text
            fontSize={`${fontSize ?? 16}px`}
            fontWeight={600}
            lineHeight={"normal"}
            color={disabled ? "#8E8E92" : "white"}
          >
            {content}
          </Text>
          {toolTip && (
            <Tooltip
              tooltipLabel={toolTip}
              type={disabled ? "grey" : "white"}
            />
          )}
        </Flex>
      ) : (
        <Spinner
          w={"20px"}
          h={"20px"}
          maxW={"20px"}
          maxH={"20px"}
          color={"#007AFF"}
        />
      )}
    </Button>
  );
};

export default ButtonComponent;
