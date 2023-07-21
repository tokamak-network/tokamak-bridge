import { Button, Flex, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { poolModalStatus } from "@/recoil/modal/atom";

const ActionButton = (props: { step: string }) => {
  const { step } = props;
  const [, setPoolModal] = useRecoilState(poolModalStatus);

  const handleAction = () => {
    return setPoolModal("removeLiquidity");
  };

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
        _disabled={{}}
        onClick={handleAction}
      >
        <Text>{step === "step" ? "Preview" : "Remove"}</Text>
      </Button>
    </Flex>
  );
};

export default ActionButton;
