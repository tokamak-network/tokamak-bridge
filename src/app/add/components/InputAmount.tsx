import {
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  border,
} from "@chakra-ui/react";
import { useState } from "react";

type InputAmountProps = {
  inToken: string;
  outToken: string;
};

const InputAmount = (props: InputAmountProps) => {
  const { inToken, outToken } = props;
  const [amount, setAmount] = useState(0);

  const handleChange = (e: any) => {
    const value = parseFloat(e.target.value); // Convert input value to a number
    setAmount(value);
  };

  return (
    <InputGroup
      width="384px"
      border="1px solid #313442"
      borderRadius={"8px"}
      justifyItems={"center"}
      mt={"12px"}
      mb={"20px"}
    >
      <Input
        value={amount}
        onChange={handleChange}
        type="number"
        placeholder="Enter a number"
        min={0}
        _hover={{ border: "none" }}
        _focus={{ border: "none" }}
        _active={{ border: "none" }}
        border={"none"}
      />
      <InputRightAddon background="none" border="none" cursor={"default"}>
        <Text textAlign="right">
          {inToken} per {outToken}
        </Text>
      </InputRightAddon>
    </InputGroup>
  );
};

export default InputAmount;
