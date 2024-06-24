import Image from "next/image";
import { Flex, Text } from "@chakra-ui/react";
import { atcb_action } from "add-to-calendar-button";
import CalendarIcon from "assets/icons/Google_Calendar_icon.svg";

const CalendarComponent = ({ config }: { config: Object }) => {
  return (
    <Flex
      flexDir={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      cursor={"pointer"}
      w="100%"
      h={{ base: "fit-content", lg: "43px" }}
      onClick={() => atcb_action(config)}
    >
      <Flex
        w="196px"
        h="36px"
        borderRadius={"8px"}
        border={"1px solid #A0A3AD"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Text fontSize={"12px"} mr="8px">
          Remind me to claim
        </Text>
        <Flex height={"16px"} w="16px" p="0px">
          <Image src={CalendarIcon} alt="calendar" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default CalendarComponent;
