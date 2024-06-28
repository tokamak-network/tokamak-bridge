import { Text, Button, Flex } from "@chakra-ui/react";
import {
  STATUS,
  FIFTEEN_MINUTES,
  calculateInitialCountdown,
} from "@/staging/components/cross-trade/utils/getStatus";
import { useCountdown } from "@/staging/hooks/useCountdown";
import { formatTimeDisplay } from "@/staging/utils/formatTimeDisplay";

interface CTProviderProps {
  status: number;
  blockTimestamps?: number;
}

export default function CTProvider({
  status,
  blockTimestamps,
}: CTProviderProps) {
  const renderButton = () => {
    if (status === STATUS.COUNTDOWN && blockTimestamps) {
      const remainTime = calculateInitialCountdown(
        blockTimestamps,
        FIFTEEN_MINUTES
      );
      const isZeroTime = remainTime <= 0;
      const timeDisplay = isZeroTime
        ? "00 : 00"
        : useCountdown(formatTimeDisplay(remainTime));

      return (
        <Flex justifyContent={"center"}>
          <Text
            fontWeight={600}
            fontSize={"11px"}
            lineHeight={"16.5px"}
            color={"#DB00FF"}
          >
            {timeDisplay}
          </Text>
        </Flex>
      );
    }

    const isDisabled = status === STATUS.DISABLED;
    const bgColor = isDisabled ? "#23242B" : "#007AFF";
    const textColor = isDisabled ? "#A0A3AD" : "#FFFFFF";

    return (
      <Button
        w={"64px"}
        h={"28px"}
        px={"10px"}
        py={"5px"}
        justifyContent={"center"}
        gap={"8px"}
        flexShrink={0}
        borderRadius={"6px"}
        bg={bgColor}
        isDisabled={isDisabled}
        _active={{}}
        _hover={{}}
        _focus={{}}
        _disabled={{
          opacity: 1,
        }}
      >
        <Text
          fontWeight={600}
          fontSize={"11px"}
          lineHeight={"16.5px"}
          color={textColor}
        >
          Provide
        </Text>
      </Button>
    );
  };

  return <>{renderButton()}</>;
}
