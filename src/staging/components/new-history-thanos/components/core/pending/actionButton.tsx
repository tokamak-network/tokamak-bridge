import ButtonComponent from "@/components/button/Button";
import { txPendingStatus } from "@/recoil/global/transaction";
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
}

const ActionButtonComponent: React.FC<ActionButtonComponentProps> = ({
  status,
  tx,
}) => {
  const { handleWithdrawTxAction } = useWithdrawAction();
  const { chain } = useNetwork();
  const buttonContent = getBridgeActionButtonContent(tx, chain?.id);
  const [pendingStatus, setTxPending] = useRecoilState(txPendingStatus);
  const disabled = pendingStatus;
  return (
    <Button
      borderRadius={"4px"}
      bgColor={disabled ? "#17181D !important" : "#007AFF !important"}
      py={"8px"}
      px={"10px"}
      maxWidth={"62px"}
      maxHeight={"22px"}
      isDisabled={disabled}
      onClick={() => {
        handleWithdrawTxAction(tx as WithdrawTransactionHistory);
      }}
    >
      {!pendingStatus ? (
        <Text
          fontSize={`12px`}
          fontWeight={600}
          lineHeight={"normal"}
          color={"white"}
        >
          {buttonContent}
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
