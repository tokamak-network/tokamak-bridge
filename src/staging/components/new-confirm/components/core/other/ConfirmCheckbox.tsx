import React from "react";
import { Box, Checkbox, Button, Text } from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
import { Action, StandardHistory } from "@/staging/types/transaction";
interface ConfirmCheckboxComponentProps {
  isChecked: boolean;
  onClickCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  transactionData: StandardHistory;
}

export default function ConfirmCheckboxComponent(
  props: ConfirmCheckboxComponentProps
) {
  const { onClickCheckbox, isChecked, transactionData } = props;

  return (
    <Box>
      <Checkbox
        mt={"6px"}
        isChecked={isChecked}
        onChange={onClickCheckbox}
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
          fontWeight={400}
          fontSize={"12px"}
          lineHeight={"20px"}
          letterSpacing={"0.01em"}
        >
          {`${
            transactionData.action === Action.Withdraw
              ? `I understand that I have to send a transaction on Ethereum to "Claim" my withdraw after 7 days.`
              : "Text will be changed."
          }`}
        </Text>
      </Checkbox>
    </Box>
  );
}
