import { Box, VStack, Circle } from "@chakra-ui/react";

export default function Timeline() {
  return (
    <VStack mt={"6px"} spacing={0} align='center'>
      <Circle size='8px' bg='#007AFF' />
      <Box
        w={"0.5px"}
        height='82px'
        border={"0.5px solid #007AFF"}
        opacity={"0.4"}
      />
      <Circle size='8px' bg='#007AFF' />
      <Box w={"0.5px"} height='82px' border={"0.5px dashed #007AFF"} />
      <Circle size='8px' bg='#A0A3AD' />
    </VStack>
  );
}
