import GetHelp from "@/components/ui/GetHelp";
import { Box, Flex, Text } from "@chakra-ui/react";
import GoogleCalendar from "@/assets/icons/newHistory/googleCalendar.svg";
import { Image } from "@chakra-ui/next-js";

interface CountDownComponentProps {
  time: string;
  isCountDown: boolean;
  handleCalendarButtonClick?: () => void;
}

export const CountDownComponent: React.FC<CountDownComponentProps> = ({
  time,
  isCountDown,
  handleCalendarButtonClick,
}) => {
  return (
    <Flex alignItems="center" gap={"2px"} justifyContent={"space-between"}>
      <Text
        fontSize={"11px"}
        fontWeight={600}
        lineHeight={"22px"}
        color={!isCountDown ? "#DD3A44" : "#FFFFFF"}
        cursor={"pointer"}
        textAlign={"right"}
      >
        {time}
      </Text>
      {!isCountDown && <GetHelp />}
      {handleCalendarButtonClick && isCountDown && (
        <Box ml={"4px"} onClick={handleCalendarButtonClick}>
          <Image
            src={GoogleCalendar}
            alt="Google Calendar icon"
            cursor={"pointer"}
          />
        </Box>
      )}
    </Flex>
  );
};
