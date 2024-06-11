import React from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";

interface ConditionalBoxProps {
  type: "wait" | "timer";
}

export default function ConditionalBox(props: ConditionalBoxProps) {
  const { type } = props;

  if (type === "wait") {
    return (
      <Box w={"305.5px"} h={"28px"} mt='3px' mb='21px' py='3px' bg='#15161D'>
        <Flex alignItems='center'>
          <Text
            fontWeight={400}
            fontSize='11px'
            lineHeight='18px'
            color='#59628D'
          >
            {"Wait 7 days"}
          </Text>
        </Flex>
      </Box>
    );
  } else if (type === "timer") {
    return (
      <Box
        w={"305.5px"}
        h={"28px"}
        mt='3px'
        mb='21px'
        pl='12px'
        pr='210px'
        py='3px'
        borderRadius='4px'
        bg='#1F2128'
      >
        <Flex alignItems='center'>
          <Text fontWeight={600} fontSize='11px' lineHeight='22px'>
            84 : 00 : 00
          </Text>
          <Flex w='18px' h='18px' ml='6px' justifyContent='center'>
            <Image src={GoogleCalendar} alt='GoogleCalendar' />
          </Flex>
        </Flex>
      </Box>
    );
  }
  return null; // return null if the type does not match any condition
}
