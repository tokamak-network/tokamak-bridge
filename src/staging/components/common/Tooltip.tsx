import CTCustomTooltip from "@/staging/components/cross-trade/components/CTCustomTooltip";
import { Flex, Box } from "@chakra-ui/react";
import Image from "next/image";
import { CSSProperties } from "react";
import QUESTION_ICON from "assets/icons/ct/tip_ct.svg";
import QUESTION_ICON_WHITE from "assets/icons/ct/tip_ct_white.svg";
import QUESTION_ICON_BLUE from "assets/icons/ct/tip_ct_blue.svg";

export function Tooltip(props: {
  tooltipLabel: string;
  style?: CSSProperties;
  type?: "grey" | "white" | "blue";
}) {
  const { tooltipLabel, style, type = "grey" } = props;

  return (
    <Box style={style}>
      <CTCustomTooltip
        content={
          <Flex>
            {type === "grey" ? (
              <Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />
            ) : type === "blue" ? (
              <Image src={QUESTION_ICON_BLUE} alt={"QUESTION_ICON_BLUE"} />
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
