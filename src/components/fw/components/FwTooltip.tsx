import FwCustomTooltip from "@/components/fw/components/FwCustomTooltip";
import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import { CSSProperties } from "react";
import QUESTION_ICON from "assets/icons/fw/tip_fw.svg";

export function FwTooltip(props: {
  tooltipLabel: string;
  style?: CSSProperties;
}) {
  return (
    <Box style={props.style}>
      <FwCustomTooltip
        content={
          <Flex>
            <Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />
          </Flex>
        }
        tooltipLabel={props.tooltipLabel}
        style={{
          maxW: "245px",
          px: "8px",
          py: "5px",
          tooltipLineHeight: "18px",
        }}
      />
    </Box>
  );
}
