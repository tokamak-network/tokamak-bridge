import { Box, Text, Tooltip } from "@chakra-ui/react";
import { ReactNode, useState } from "react";

export default function FwCustomTooltip(props: {
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
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Tooltip
      p={0}
      defaultIsOpen={false}
      isOpen={isOpen}
      zIndex={10000}
      flex={1}
      label={
        <Box
          w={"100%"}
          bgColor={"#383A49"}
          borderRadius={"4px"}
          fontWeight={400}
          color={"#fff"}
          pos={"relative"}
          {...props.style}
        >
          <Text fontWeight={400} fontSize={"11px"} lineHeight={"16.5px"}>
            {props.tooltipLabel}
          </Text>
          <Box
            pos={"absolute"}
            left={"50%"}
            w={"5px"}
            h={"5px"}
            top={"34px"}
            bgColor={"#383a49"}
            transform={"matrix(0.71, -0.71, -0.71, -0.71, 0, 0)"}
          ></Box>
        </Box>
      }
      placement='top'
    >
      <Box
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {props.content}
      </Box>
    </Tooltip>
  );
}
