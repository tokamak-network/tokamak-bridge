import { Box, Checkbox, Button, Text } from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";

type TradeConfirmationProps = {
  isChecked: boolean;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
};

export default function CTConfirmCrossTradeFooter(
  props: TradeConfirmationProps
) {
  const { isChecked, onCheckboxChange, onConfirm } = props;

  return (
    <Box>
      {/** Check Box */}
      <Box mt={"12px"}>
        <Checkbox
          isChecked={isChecked}
          onChange={onCheckboxChange}
          icon={<CheckCustomIcon />}
          sx={{
            ".chakra-checkbox__control": {
              borderWidth: "1px",
              borderColor: "#A0A3AD",
              _focus: {
                boxShadow: "none",
              },
            },
            _checked: {
              "& .chakra-checkbox__control": {
                borderColor: "#FFFFFF",
              },
            },
          }}
          colorScheme="#A0A3AD"
        >
          <Text
            color={isChecked ? "#FFFFFF" : "#A0A3AD"}
            fontWeight={600}
            fontSize={"13px"}
            lineHeight={"20px"}
            letterSpacing={"0.01em"}
          >
            Estimated Time of Arrival:{" "}
            <span style={{ color: isChecked ? "#DB00FF" : "#A0A3AD" }}>
              ~1 day
            </span>
          </Text>
        </Checkbox>
        <Text
          mt={"5px"}
          color={isChecked ? "#FFFFFF" : "#A0A3AD"}
          pl={"25px"}
          fontWeight={400}
          fontSize={"12px"}
          lineHeight={"20px"}
          letterSpacing={"0.01em"}
        >
          text will be changed
        </Text>
      </Box>
      {/** Confirm Button */}
      <Box mt={"12px"}>
        <Button
          isDisabled={!isChecked}
          onClick={onConfirm}
          sx={{
            backgroundColor: isChecked ? "#007AFF" : "#17181D",
            color: isChecked ? "#FFFFFF" : "#8E8E92",
          }}
          width="full"
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
        >
          <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
            Cross Trade
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
