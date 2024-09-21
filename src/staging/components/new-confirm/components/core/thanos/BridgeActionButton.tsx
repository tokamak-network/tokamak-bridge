import { TransactionHistory } from "@/staging/types/transaction";
import React from "react";
import { getBridgeActionButtonContent, isActionDisabled } from "../../../utils";
import ButtonComponent from "@/components/button/Button";
import { Box } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { txPendingStatus } from "@/recoil/global/transaction";
import { useNetwork } from "wagmi";

interface BridgeActionButtonComponentProps {
  tx: TransactionHistory;
  isConfirmed: boolean;
  onClick?: () => void;
  toolTip?: string;
  disabled?: boolean;
}

const BridgeActionButtonComponent: React.FC<
  BridgeActionButtonComponentProps
> = ({ isConfirmed, onClick, toolTip, tx, disabled }) => {
  const { chain } = useNetwork();
  const buttonContent = getBridgeActionButtonContent(tx);
  const isDisabled = !isConfirmed || isActionDisabled(tx.status);
  const [pendingStatus, setTxPending] = useRecoilState(txPendingStatus);
  return (
    <Box>
      {buttonContent ? (
        <ButtonComponent
          content={buttonContent}
          onClick={onClick}
          disabled={isDisabled || pendingStatus || disabled}
          toolTip={toolTip}
          pendingStatus={pendingStatus}
        />
      ) : null}
    </Box>
  );
};

export default BridgeActionButtonComponent;
