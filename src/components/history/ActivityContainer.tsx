import { Flex, Text } from "@chakra-ui/react";
import WithdrawTx from "./WithdrawTx";
import DepositTx from "./DepositTx";
export default function ActivityContainer () {
    return (
        <Flex flexDir={'column'} rowGap={'8px'}>
        
            <WithdrawTx></WithdrawTx>
          <DepositTx/>
        </Flex>

    )
}