import FwCustomTooltip from "@/components/fw/components/FwCustomTooltip";
import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import { CSSProperties } from "react";
import QUESTION_ICON from "assets/icons/fw/tip_fw.svg";
import QUESTION_ICON_WHITE from "assets/icons/fw/tip_fw_white.svg";

export function FwTooltip(props: {
  tooltipLabel: string;
  style?: CSSProperties;
  type?: "grey" | "white";
}) {
  const { tooltipLabel, style, type = "grey" } = props;

  return (
    <Box style={style}>
      <FwCustomTooltip
        content={
          <Flex>
            {type === "grey" ? (
              <Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />
            ) : (
              <Image src={QUESTION_ICON_WHITE} alt={"QUESTION_ICON_WHITE"} />
            )}
          </Flex>
        }
        tooltipLabel={tooltipLabel}
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
