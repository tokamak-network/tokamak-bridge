import ButtonComponent from "@/components/button/Button";
import { CT_Status, Status } from "@/staging/types/transaction";
import { TransactionHistory } from "@/staging/types/transaction";
import { Button, Text } from "@chakra-ui/react";
interface ActionButtonComponentProps {
  status: Status | CT_Status;
  tx: TransactionHistory;
}

const ActionButtonComponent: React.FC<ActionButtonComponentProps> = ({
  status,
  tx,
}) => {
  return (
    <Button
      borderRadius={"4px"}
      bgColor={"#007AFF !important"}
      py={"8px"}
      px={"10px"}
      maxWidth={"62px"}
      maxHeight={"22px"}
    >
      <Text
        fontSize={`12px`}
        fontWeight={600}
        lineHeight={"normal"}
        color={"white"}
      >
        {status}
      </Text>
    </Button>
  );
};

export default ActionButtonComponent;
