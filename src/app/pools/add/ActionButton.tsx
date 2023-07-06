import { usePoolMint } from "@/hooks/pool/usePoolContract";
import { Button } from "@chakra-ui/react";
import { useMemo } from "react";
import usePreview from "@/hooks/modal/usePreviewModal";
export default function ActionButton() {
  const buttonName = useMemo(() => {
    return "Preview";
  }, []);

  const { mintPosition } = usePoolMint();
const {setPreviewModal}  = usePreview()
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
      onClick={()=>setPreviewModal(true)}
    >
      {buttonName}
    </Button>
  );
}
