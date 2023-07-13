import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import Image from "next/image";
import Calendar from 'assets/icons/Google_Calendar_icon.svg'
import { confirmWithdraw } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { atcb_action } from "add-to-calendar-button";

export default function StatusTx(props: { completed: boolean }) {
  const { completed } = props;
    const [modalOpen, setModalOpen] = useRecoilState(confirmWithdraw)
    const config:Object = {
        name: " Test the Add to Calendar Button",
        description: "Check out the maybe easiest way to include Add to Calendar Buttons to your web projects:[br]→ [url]https://add-to-calendar-button.com/",
        startDate: "2023-07-16",
        startTime: "10:15",
        endTime: "23:30",
        options: ["Google"] ,
        timeZone: "currentBrowser"
      };
  
      
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
            <Flex ml={'5px'} onClick={() =>  atcb_action(config)} cursor={'pointer'}>
                <Image src={Calendar} alt="google calendar" />
                </Flex>
        </Flex>
      )}
    </Flex>
  );
}
