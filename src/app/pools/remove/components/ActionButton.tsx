import { Button, Flex, Text } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { T_PoolModal, poolModalStatus } from "@/recoil/modal/atom";
import { removeAmount } from "@/recoil/pool/setPoolPosition";

const ActionButton = () => {
  const [, setPoolModal] = useRecoilState(poolModalStatus);
  const amountPercentage = useRecoilValue(removeAmount);
  const handleAction = () => {
    return setPoolModal("removeLiquidity");
  };

  const btnIsDisabled = amountPercentage === 0;

  return (
    <Flex w={"100%"}>
      <Button
        w={"100%"}
        h={"48px"}
        borderRadius={"8px"}
        bg={"#007AFF"}
        fontSize={16}
        fontWeight={600}
        _hover={{}}
        _active={{}}
        _disabled={{ bgColor: "#17181D", color: "#8E8E92" }}
        onClick={handleAction}
        isDisabled={btnIsDisabled}
      >
        <Text>{btnIsDisabled ? "Enter a percent" : "Preview"}</Text>
      </Button>
    </Flex>
  );
};

export default ActionButton;
