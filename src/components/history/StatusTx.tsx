import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import Calendar from 'assets/icons/Google_Calendar_icon.svg'
import { confirmWithdraw } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";

export default function StatusTx(props: { completed: boolean }) {
  const { completed } = props;
    const [modalOpen, setModalOpen] = useRecoilState(confirmWithdraw)

  return (
    <Flex justifyContent={"space-between"} h="18px" alignItems={"center"}>
      <Flex alignItems={"center"}>
        <Flex
          h="6px"
          w="6px"
          borderRadius={"50%"}
          bg={completed ? "#03D187" : "#8497DB"}
          mr="6px"
        ></Flex>
        <Text fontSize={"11px"} fontWeight={600} cursor={!completed ? 'pointer':'default'} onClick={()=> !completed && setModalOpen(true)}>
          {completed ? "Completed" : "Wait 7 Days"}
        </Text>
      </Flex>
      {completed ? (
        <Flex fontSize={"11px"}>
          <Text>2023.04.22</Text>
          <Text ml="3px" color={"#A0A3AD"}>
            04:31 PM (UTC+9)
          </Text>
        </Flex>
      ) : (
        <Flex>
            <Text fontSize={'12px'} color={'#8497DB'} >01 : 20 : 32 Left</Text>
            <Flex ml={'5px'}>
                <Image src={Calendar} alt="google calendar" />
                </Flex>
        </Flex>
      )}
    </Flex>
  );
}
