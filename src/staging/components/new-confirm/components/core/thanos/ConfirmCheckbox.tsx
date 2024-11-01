import React from "react";
import { Box, Checkbox, Button, Text } from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
interface ConfirmCheckboxComponentProps {
  isChecked: boolean;
  onClickCheckbox: (e: React.ChangeEvent<HTMLInputElement>) => void;
  content: string;
}

export default function ConfirmCheckboxComponent(
  props: ConfirmCheckboxComponentProps
) {
  const { onClickCheckbox, isChecked, content } = props;

  return (
    <Box>
      <Checkbox
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
          {content}
        </Text>
      </Checkbox>
    </Box>
  );
}
