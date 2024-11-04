import React, { useState } from "react";
import { Box, Checkbox, Button, Text, Flex } from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
import { CustomTooltipWithQuestion } from "@/components/tooltip/CustomTooltip";
interface ConfirmInitiateFooterProps {
  onCloseDepositWithdrawConfirmModal: () => void;
  onClick: () => void;
}

export default function ConfirmInitiateFooter(
  props: ConfirmInitiateFooterProps
) {
  const { onCloseDepositWithdrawConfirmModal, onClick } = props;
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const { onCloseCTOptionModal } = useFxOptionModal();
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setIsChecked(e.target.checked);

  return (
    <Box>
      {/** Check Box */}
      <Box>
        <Flex columnGap={"12px"}>
          <Checkbox
            isChecked={isChecked}
            onChange={handleCheckboxChange}
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
          ></Checkbox>
          <Text
            color={isChecked ? "#FFFFFF" : "#A0A3AD"}
            fontWeight={400}
            fontSize={"12px"}
            lineHeight={"20px"}
            letterSpacing={"0.01em"}
          >
            I understand that I have to send a transaction <br /> on Ethereum to
            "Claim" my withdraw after 7 days.
          </Text>
        </Flex>
      </Box>
      {/** Confirm Button */}
      <Box mt={"12px"}>
        <Button
          isDisabled={!isChecked}
          onClick={() => {
            onClick();
            onCloseDepositWithdrawConfirmModal();
            onCloseCTOptionModal();
          }}
          sx={{
            backgroundColor: isChecked ? "#007AFF" : "#17181D",
            color: isChecked ? "#FFFFFF" : "#8E8E92",
          }}
          width="full"
          height={"48px"}
          borderRadius={"8px"}
          _hover={{}}
          opacity={"1 !important"}
          cursor={"pointer !important"}
        >
          <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
            Initiate
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
