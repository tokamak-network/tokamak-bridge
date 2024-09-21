import {
  StandardHistory,
  TransactionHistory,
} from "@/staging/types/transaction";
import React from "react";
import { getBridgeActionButtonContent, isActionDisabled } from "../../../utils";
import ButtonComponent from "@/components/button/Button";
import { Box } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { txPendingStatus } from "@/recoil/global/transaction";
import { useNetwork } from "wagmi";
import { pendingTransactionHashes } from "@/recoil/modal/atom";

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
  const [pendingTxHashes, setPendingTxHashes] = useRecoilState(
    pendingTransactionHashes
  );
  const pendingStatus = pendingTxHashes.includes(
    (tx as StandardHistory).transactionHashes.initialTransactionHash
  );
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
