import {
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    useToast,
    Input,
    Text,
    Link,
    InputRightElement,
    InputGroup,
  } from "@chakra-ui/react";
  import { useRecoilState } from "recoil";
  import { searchTxStatus } from "@/recoil/userHistory/searchTx";
  import Image from "next/image";
  import ICON_SEARCH from "assets/icons/searchGray.svg";

export default function SearchComponent (props: {tab: string}) {
    const [searchTxString, setSearchTxString] = useRecoilState(searchTxStatus);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value === "") {
        return setSearchTxString(null);
      } else {
        return setSearchTxString({ id: value });
      }
    };

    return (
      <Flex
        ml="8px"
        w="100%"
        h={"40px"}
        bgColor={"#15161D"}
        borderRadius={"6px"}
      >
        <InputGroup>
          <Input
            pl="20px"
            _active={{}}
            _hover={{}}
            _focus={{ boxShadow: "none !important" }}
            border={"none"}
            fontSize={14}
            fontWeight={500}
            onChange={onChange}
            placeholder={
              props.tab === "Balance" ? "Token contract address" : "Transaction ID"
            }
            _placeholder={{ color: "#8E8E92" }}
          ></Input>
          <InputRightElement mr={"6px"}>
            <Flex height={"20px"} width={"20px"}>
              <Image src={ICON_SEARCH} alt="ICON_SEARCH" />
            </Flex>
          </InputRightElement>
        </InputGroup>
      </Flex>
    );
}