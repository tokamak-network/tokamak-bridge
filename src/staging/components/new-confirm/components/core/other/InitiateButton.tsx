import React, { useState } from "react";
import { Box, Checkbox, Button, Text } from "@chakra-ui/react";
import CheckCustomIcon from "@/staging/components/common/CheckCustomIcon";
import { Tooltip } from "@/staging/components/common/Tooltip";
import useFxOptionModal from "@/staging/components/cross-trade/hooks/useCTOptionModal";
interface InitiateButtonProps {
  onCloseDepositWithdrawConfirmModal: () => void;
  onClick: () => void;
  isConfirmed: boolean;
  isApproved: boolean;
}

export default function InitiateButton(props: InitiateButtonProps) {
  const {
    onCloseDepositWithdrawConfirmModal,
    onClick,
    isConfirmed,
    isApproved,
  } = props;
  const { onCloseCTOptionModal } = useFxOptionModal();

  return (
    <Box>
      <Button
        isDisabled={!isConfirmed || !isApproved}
        onClick={() => {
          onClick();
          onCloseDepositWithdrawConfirmModal();
          onCloseCTOptionModal();
        }}
        sx={{
          color: isConfirmed && isApproved ? "#FFFFFF" : "#8E8E92",
        }}
        width="full"
        height={"48px"}
        borderRadius={"8px"}
        _hover={{}}
        opacity={"1 !important"}
        cursor={"pointer !important"}
        bgColor={isConfirmed && isApproved ? "#007AFF !important" : "#17181D !important"}
      >
        <Text fontWeight={600} fontSize={"16px"} lineHeight={"24px"}>
          Initiate
        </Text>
        <Tooltip
          tooltipLabel={"text will be changed"}
          style={{ marginLeft: "2px" }}
          type={isConfirmed && isApproved ? "white" : "grey"}
        />
      </Button>
    </Box>
  );
}
