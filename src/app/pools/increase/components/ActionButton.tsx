import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import usePreview from "@/hooks/modal/usePreviewModal";
import { useRecoilState } from "recoil";
import { previewModalStatus, poolModalStatus } from "@/recoil/modal/atom";

const ActionButton  = (props:{step: string}) => {
const {step } = props;
const {
    isOpen,
    onClosePreviewModal,
    setPreviewModalStatus,
  } = usePreview();
  const [poolModal, setPoolModal] = useRecoilState(poolModalStatus);

  const handleAction = () => {
    setPreviewModalStatus(true);
    return setPoolModal("increaseLiquidity")
  }

    return (
        <Flex w={"100%"}>
        <Button
          w={"100%"}
          h={"48px"}
          borderRadius={"8px"}
          bg={ "#007AFF"}
          fontSize={16}
          fontWeight={600}
          _hover={{}}
          _active={{}}
          _disabled={{}}
          onClick={handleAction}
        //   onClick={() => write?.()}
        //   isDisabled={isLoading}
        >
         <Text>
            {step === 'step'?  'Preview' : 'Increase'}
            </Text>
        </Button>
      </Flex>
    )
}

export default ActionButton