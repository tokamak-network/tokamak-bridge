import CTCustomTooltip from "@/staging/components/cross-trade/components/CTCustomTooltip";
import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import { CSSProperties } from "react";
import QUESTION_ICON from "assets/icons/ct/tip_ct.svg";
import QUESTION_ICON_WHITE from "assets/icons/ct/tip_ct_white.svg";
import TooltipArrow from "assets/icons/tooltipArrow.svg";

export function Tooltip(props: {
  tooltipLabel: string;
  style?: CSSProperties;
  type?: "grey" | "white";
}) {
  const { tooltipLabel, style, type = "grey" } = props;

  return (
    <Box style={style} pos={"relative"}>
      <CTCustomTooltip
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
      <Box pos={"absolute"} top={"-12px"} left={"4px"} zIndex={100}>
        <Image src={TooltipArrow} alt={"TooltipArrow"}></Image>
      </Box>
    </Box>
  );
}
