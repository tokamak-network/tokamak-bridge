import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";

interface MobileSearchInputProps {
  searchValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function MobileSearchInput({
  searchValue,
  onChange,
}: MobileSearchInputProps) {
  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        children={<SearchIcon color="gray.300" />}
      />
      <Input
        type="text"
        value={searchValue}
        placeholder="Search token name or address"
        border="none"
        _focus={{ borderColor: "none" }}
        bg="blackAlpha.500"
        color="white"
        onChange={onChange}
      />
    </InputGroup>
  );
}
