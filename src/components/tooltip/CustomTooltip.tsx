import { Box, Text, Tooltip } from "@chakra-ui/react";

export default function CustomTooltip(props: { content: string }) {
  return (
    <Tooltip
      label={
        <Box
          flex={1}
          w={"126px"}
          h={"28px"}
          bgColor={"#383A49"}
          borderRadius={"4px"}
          alignItems={"center"}
          justifyContent={"center"}
          fontSize={11}
          fontWeight={400}
          color={"#fff"}
          pos={"relative"}
        >
          <Text
            w={"100%"}
            h={"100%"}
            lineHeight={"28px"}
            textAlign={"center"}
            verticalAlign={"center"}
          >
            0.00221110000002 ETH
          </Text>
          <Box
            pos={"absolute"}
            left={"50%"}
            w={"5px"}
            h={"5px"}
            bgColor={"#383a49"}
            transform={"matrix(0.71, -0.71, -0.71, -0.71, 0, 0)"}
          ></Box>
        </Box>
      }
      placement="top"
    >
      {props.content}
    </Tooltip>
  );
}
