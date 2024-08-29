import { Box, Text, Tooltip } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

export default function CTCustomTooltip(props: {
  content: string | ReactNode;
  tooltipLabel?: string | ReactNode;
  style?: {
    width?: string;
    maxW?: string;
    bgColor?: string;
    height?: string;
    px?: string;
    py?: string;
    tooltipLineHeight?: string;
  };
  contentStyle?: {
    fontWeight?: string | number;
    fontSize?: string;
    lineHeight?: string;
    color?: string;
  };
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Tooltip
      p={0}
      placement="top"
      defaultIsOpen={false}
      isOpen={isOpen}
      zIndex={10000}
      label={
        <Box
          w={"100%"}
          bgColor={"#383A49"}
          fontWeight={400}
          color={"#fff"}
          pos={"relative"}
          borderRadius={"4px"}
          {...props.style}
        >
          <Text fontWeight={400} fontSize={"12px"} lineHeight={"18px"}>
            {props.tooltipLabel}
          </Text>
          <Box
            pos={"absolute"}
            left={"50%"}
            w={"5px"}
            h={"5px"}
            top={"27.5px"}
            bgColor={"#383a49"}
            transform={"translateX(-50%) translateY(-50%) rotate(45deg)"}
          ></Box>
        </Box>
      }
    >
      <Box
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Text {...props.contentStyle}>{props.content}</Text>
      </Box>
    </Tooltip>
  );
}
