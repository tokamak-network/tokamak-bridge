import { Box, Text, Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import QuestionIcon from "assets/icons/question.svg";
import GrayQuestionIcon from "assets/icons/questionGray.svg";

export default function CustomTooltip(props: {
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
      bg={"transparent"}
      zIndex={10000}
      label={
        <Box
          w={"100%"}
          flex={1}
          px={"8px"}
          h={"28px"}
          bgColor={"#383A49"}
          borderRadius={"4px"}
          alignItems={"center"}
          justifyContent={"center"}
          fontSize={11}
          fontWeight={400}
          color={"#fff"}
          pos={"relative"}
          {...props.style}
        >
          <Text
            w={"100%"}
            h={"100%"}
            lineHeight={props.style?.tooltipLineHeight ?? "28px"}
            textAlign={"center"}
            verticalAlign={"center"}
          >
            {props.tooltipLabel}
          </Text>
          <Box
            pos={"absolute"}
            left={"50%"}
            w={"5px"}
            h={"5px"}
            top={"25px"}
            bgColor={props?.style?.bgColor ?? "#383a49"}
            transform={"matrix(0.71, -0.71, -0.71, -0.71, 0, 0)"}
          ></Box>
        </Box>
      }
      placement="top"
    >
      <Box
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        width={"16px"}
      >
        {props.content}
      </Box>
    </Tooltip>
  );
}

export const CustomTooltipWithQuestion = (props: {
  isGrayIcon?: boolean;
  tooltipLabel: string | ReactNode;
  style?: {
    width?: string;
    maxW?: string;
    bgColor?: string;
    height?: string;
    px?: string;
    py?: string;
    tooltipLineHeight?: string;
  };
}) => {
  return (
    <CustomTooltip
      content={
        <Image
          src={props.isGrayIcon ? GrayQuestionIcon : QuestionIcon}
          alt={"QuestionIcon"}
        ></Image>
      }
      tooltipLabel={props.tooltipLabel}
      style={props.style}
    />
  );
};
