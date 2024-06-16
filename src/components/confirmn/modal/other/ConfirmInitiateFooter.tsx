import React, { useState } from "react";
import { Box, Checkbox, Button, Text } from "@chakra-ui/react";
import FwCheckCustomIcon from "@/components/fw/components/FwCheckCustomIcon";
import { FwTooltip } from "@/components/fw/components/FwTooltip";

interface ConfirmInitiateFooterProps {
  onCloseDepositWithdrawConfirmModal: () => void;
  onClick: () => void;
}

export default function ConfirmInitiateFooter(
  props: ConfirmInitiateFooterProps
) {
  const { onCloseDepositWithdrawConfirmModal, onClick } = props;
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  return (
    <Box>
      {/** Check Box */}
      <Box>
        <Text
          color={isChecked ? "#FFFFFF" : "#A0A3AD"}
          fontWeight={600}
          fontSize={"13px"}
          lineHeight={"20px"}
          letterSpacing={"0.01em"}
        >
          Estimated Time of Arrival:{" "}
          <span style={{ color: isChecked ? "#FFFFFF" : "#A0A3AD" }}>
            ~1 day
          </span>
        </Text>

        <Checkbox
          mt={"6px"}
          isChecked={isChecked}
          onChange={handleCheckboxChange}
          icon={<FwCheckCustomIcon />}
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
          colorScheme='#A0A3AD'
        >
          <Text
            color={isChecked ? "#FFFFFF" : "#A0A3AD"}
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"20px"}
            letterSpacing={"0.01em"}
          >
            text will be changed
          </Text>
        </Checkbox>
      </Box>
      {/** Confirm Button */}
      <Box mt={"12px"}>
        <Button
          isDisabled={!isChecked}
          onClick={() => {
            onClick();
            onCloseDepositWithdrawConfirmModal();
          }}
          sx={{
            backgroundColor: isChecked ? "#007AFF" : "#17181D",
            color: isChecked ? "#FFFFFF" : "#8E8E92",
          }}
          width='full'
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
        >
          <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
            Initiate
          </Text>
          <FwTooltip
            tooltipLabel={"text will be changed"}
            style={{ marginLeft: "2px" }}
            type={isChecked ? "white" : "grey"}
          />
        </Button>
      </Box>
    </Box>
  );
}
