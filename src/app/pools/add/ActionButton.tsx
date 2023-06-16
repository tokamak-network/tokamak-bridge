import { Button } from "@chakra-ui/react";
import { useMemo } from "react";

export default function ActionButton() {
  const buttonName = useMemo(() => {
    return "Invalid pair";
  }, []);

  return (
    <Button
      w={"100%"}
      h={"48px"}
      color={"#8E8E92"}
      bgColor={"#17181D"}
      borderRadius={"8px"}
      _hover={{}}
      _active={{}}
      mt={"auto"}
    >
      {buttonName}
    </Button>
  );
}
