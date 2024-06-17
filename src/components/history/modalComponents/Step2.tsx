import React, { useState, useEffect, useRef } from "react";
import { differenceInSeconds, format } from "date-fns";
import { Flex, Text, Tooltip } from "@chakra-ui/react";
import Image from "next/image";
import useConnectedNetwork from "@/hooks/network";
import { confirmWithdrawData } from "@/recoil/modal/atom";
import { useRecoilState, useRecoilValue } from "recoil";
import CustomTooltip from "@/components/tooltip/CustomTooltip";
import QuestionIcon from "assets/icons/questionGray.svg";

function Step2(props: { progress: string; timeStamp?: number; check: any }) {
  const withdraw = useRecoilValue(confirmWithdrawData);
  const durationRef = useRef("0");
  const { timeStamp, check } = props;
  const [duration, setDuration] = useState("0");
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const tx = withdraw.modalData;

  useEffect(() => {
    if (timeStamp) {
      const getDuration = setInterval(() => {
        const startDate = new Date(timeStamp * 1000);
        const currentTime = new Date();
        const elapsedTimeInSeconds = differenceInSeconds(
          currentTime,
          startDate
        );
        const formattedTime = format(
          new Date(elapsedTimeInSeconds * 1000),
          "mm:ss"
        );
        durationRef.current = formattedTime;

        setDuration(formattedTime);
      }, 1000);
      return () => clearInterval(getDuration);
    }
  }, []);

  return (
    <Flex
      h="36px"
      justifyContent={"space-between"}
      alignItems={"center"}
      // border={"1px solid red"}
      w="100%"
    >
      <Flex alignItems={"center"}>
        <Image src={check.check} alt="check" />
        <Text ml="8px" mr={"4px"} fontSize={"14px"} color={check.color}>
          Wait up to {isConnectedToMainNetwork ? "6" : "2"}{" "}
          {isConnectedToMainNetwork ? "hours" : "mins"}
        </Text>
        <CustomTooltip
          content={<Image src={QuestionIcon} alt={"QuestionIcon"}></Image>}
          tooltipLabel={
            <Flex flexDir={"column"} justifyContent={"center"} h={"100%"}>
              <span>L2 state roots are rolled up at least every 6 hours.</span>
              <span>It may take less than 6 hours.</span>
            </Flex>
        }
          style={{
            tooltipLineHeight: "normal",
            height: "45px",
          }}
        ></CustomTooltip>
      </Flex>
      {props.progress !== "done" && (
        <Flex>
          <Text mr="6px" fontSize={"14px"} color={check.color}>
            {tx ? duration : isConnectedToMainNetwork ? "~ 6 hours" : "2 min"}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

export default React.memo(Step2);
