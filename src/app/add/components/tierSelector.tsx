import { Box, Button, Flex } from "@chakra-ui/react";

export default function TierSelector() {
  const values = ["0.01%", "0.05%", "0.3%", "1%"];

  const handleClick = (value: any) => {
    // Handle the click event for the button with the given value
    console.log("Button clicked:", value);
  };

  return (
    <Box w={"408px"} h={"64px"} padding="12px" borderRadius="8px" bg="#1F2128">
      <Flex justifyContent="space-between">
        {values.map((value, index) => (
          <Button
            key={index}
            width="90px"
            height="40px"
            border="1px solid #313442"
            borderRadius="8px"
            paddingTop="7px"
            paddingBottom="6px"
            textAlign="center"
            marginRight={index !== values.length - 1 ? "8px" : "0"}
            onClick={handleClick}
            variant={"outline"}
            _hover={{
              backgroundColor: "transparent",
              borderColor: "#007AFF",
            }}
          >
            {value}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
