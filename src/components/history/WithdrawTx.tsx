import { Flex, Text, Button } from "@chakra-ui/react";
import Image from "next/image";
import TokenPairTx from "./TokenPairTx";
import StatusTx from "./StatusTx";


export default function WithdrawTx() {
  return (
    <Flex
      h={"100%"}
      w="100%"
      borderRadius={"8px"}
      border={"1px solid #313442"}
      bg={"#15161D"}
      p='12px'
      flexDir={'column'}
      rowGap={'8px'}
    >
        <Flex justifyContent={'space-between'} w='100%'>
            <Text fontSize={'14px'} fontWeight={600}>Withdraw</Text>
            <Button w='57px' h='24px' bg='#323442' fontSize={'12px'} _hover={{}} _focus={{}} _active={{}}>Claim</Button>
        </Flex>
        <TokenPairTx inAmount="23.435"/>
        <StatusTx completed={true}/>
        <StatusTx completed={false}/>
    </Flex>
  );
}
