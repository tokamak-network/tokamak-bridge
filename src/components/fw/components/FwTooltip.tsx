import FwCustomTooltip from "@/componenets/fw/components/FwCustomTooltip";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import { CSSProperties } from "react";
import QUESTION_ICON from "assets/icons/fw/tip_fw.svg";

export function FwTooltip(props: {
  tooltipLabel: string;
  style?: CSSProperties;
}) {
  return (
    <FwCustomTooltip
      content={
        <Flex style={props.style} ml={"2px"}>
          <Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />
        </Flex>
      }
      tooltipLabel={props.tooltipLabel}
      style={{
        maxW: "245px",
        px: "8px",
        py: "10px",
        tooltipLineHeight: "16.5px",
      }}
    />
  );
}
