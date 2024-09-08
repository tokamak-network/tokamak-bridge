import { TransactionHistory } from "@/staging/types/transaction";
import React from "react";
import { getBridgeActionButtonContent, isActionDisabled } from "../../../utils";
import ButtonComponent from "@/components/button/Button";
import { Box } from "@chakra-ui/react";

interface BridgeActionButtonComponentProps {
  tx: TransactionHistory;
  isConfirmed: boolean;
  onClick?: () => void;
  toolTip?: string;
}

const BridgeActionButtonComponent: React.FC<
  BridgeActionButtonComponentProps
> = ({ isConfirmed, onClick, toolTip, tx }) => {
  const buttonContent = getBridgeActionButtonContent(tx);
  const isDisabled = !isConfirmed || isActionDisabled(tx.status);
  return (
    <Box>
      {buttonContent ? (
        <ButtonComponent
          content={buttonContent}
          onClick={onClick}
          disabled={isDisabled}
          toolTip={toolTip}
        />
      ) : null}
    </Box>
  );
};

export default BridgeActionButtonComponent;
