import { usePoolMint } from "@/hooks/pool/usePoolContract";
import { Button } from "@chakra-ui/react";
import { useMemo } from "react";
import usePreview from "@/hooks/modal/usePreviewModal";
import { useRecoilState } from "recoil";
import { previewModalStatus, poolModalStatus } from "@/recoil/modal/atom";

type Page = "Add" | "Remove" | "Increase";

export default function ActionButton(props: {
  actionName: string;
  page: Page;
}) {
  const { actionName, page } = props;
  const [poolModal, setPoolModal] = useRecoilState(poolModalStatus);

  const buttonName = useMemo(() => {
    return "Preview";
  }, []);

  const { mintPosition } = usePoolMint();
  const {
    isOpen,

    onClosePreviewModal,
    setPreviewModalStatus,
  } = usePreview();

  const handleAction = () => {
    setPreviewModalStatus(true);
    switch (page) {
      case "Add":
        return setPoolModal("collectFee");
      case "Remove":
        return setPoolModal("removeLiquidity");
      case "Increase":
        return setPoolModal("increaseLiquidity");
      default:
        return setPoolModal("increaseLiquidity");
    }

    
  };
  return (
    <Button
      w={"100%"}
      h={"48px"}
      color={"#fff"}
      bgColor={"#007AFF"}
      borderRadius={"8px"}
      _hover={{}}
      _active={{}}
      mt={"auto"}
      onClick={handleAction}
    >
      {actionName}
    </Button>
  );
}
