import { Box, Flex } from "@chakra-ui/react";

export default function TierSelector() {
  const values = ["0.01%", "0.05%", "0.3%", "1%"];

  return (
    <Box w={"408px"} h={"64px"} padding="12px" borderRadius="8px" bg="#1F2128">
      <Flex justifyContent="space-between">
        {values.map((value, index) => (
          <Box
            key={index}
            width="90px"
            height="40px"
            border="1px solid #313442"
            borderRadius="8px"
            paddingTop="7px"
            paddingBottom="6px"
            textAlign="center"
            marginRight={index !== values.length - 1 ? "8px" : "0"}
          >
            {value}
          </Box>
        ))}
      </Flex>
    </Box>
  );
}
