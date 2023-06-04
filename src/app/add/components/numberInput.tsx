import { useState } from "react";
import { Button, Flex, Input, Text } from "@chakra-ui/react";

export default function InputComponent() {
  const [value, setValue] = useState("0");
  const onChange = (event: any) => {
    setValue(event.target.value);
  };
  return (
    <Input
      w={"168px"}
      h={"27px"}
      m={0}
      p={0}
      border={{}}
      _active={{}}
      _focus={{ boxShadow: "none !important" }}
      placeholder="0"
      color={"#ffffff"}
      fontSize={28}
      fontWeight={700}
      onChange={onChange}
    ></Input>
  );
}
