import ButtonComponent from "@/components/button/Button";
import { txPendingStatus } from "@/recoil/global/transaction";
import { pendingTransactionHashes } from "@/recoil/modal/atom";
import { useWithdrawAction } from "@/staging/components/new-confirm/hooks/useWithdrawAction";
import { getBridgeActionButtonContent } from "@/staging/components/new-confirm/utils";
import {
  CT_Status,
  Status,
  WithdrawTransactionHistory,
} from "@/staging/types/transaction";
import { TransactionHistory } from "@/staging/types/transaction";
import { Button, Spinner, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { useNetwork } from "wagmi";
interface ActionButtonComponentProps {
  status: Status | CT_Status;
  tx: TransactionHistory;
  openModal: () => void
}

const ActionButtonComponent: React.FC<ActionButtonComponentProps> = ({
  status,
  tx,
  openModal
}) => {
  const { handleWithdrawTxAction } = useWithdrawAction();
  const [pendingTxHashes, setPendingTxHashes] = useRecoilState(
    pendingTransactionHashes
  );
  const pendingStatus = pendingTxHashes.includes(
    (tx as WithdrawTransactionHistory).transactionHashes.initialTransactionHash
  );
  const disabled = pendingStatus;
  return (
    <Button
      borderRadius={"4px"}
      bgColor={disabled ? "#0F0F12 !important" : "#007AFF !important"}
      py={"8px"}
      px={"10px"}
      maxWidth={"60px"}
      minWidth={"60px"}
      maxHeight={"22px"}
      isDisabled={disabled}
      onClick={openModal}
      opacity={"1 !important"}
    >
      {!pendingStatus ? (
        <Text
          fontSize={`11px`}
          fontWeight={600}
          lineHeight={"normal"}
          color={"white"}
        >
          {status}
        </Text>
      ) : (
        <Spinner
          w={"15px"}
          h={"15px"}
          maxW={"15px"}
          maxH={"15px"}
          color={"#007AFF"}
        />
      )}
    </Button>
  );
};

export default ActionButtonComponent;
