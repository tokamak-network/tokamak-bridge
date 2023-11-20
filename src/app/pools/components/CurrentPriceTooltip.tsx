import CustomTooltip from "@/components/tooltip/CustomTooltip";
import { Flex } from "@chakra-ui/react";
import Image from "next/image";
import { CSSProperties } from "react";
import QUESTION_ICON from "assets/icons/questionGray.svg";

export function CurrentPriceTooltip(props: { style?: CSSProperties }) {
  return (
    <CustomTooltip
      content={
        <Flex style={props.style}>
          <Image src={QUESTION_ICON} alt={"QUESTION_ICON"} />
        </Flex>
      }
      tooltipLabel={
        "The input amount can be automatically updated based on the current price."
      }
      style={{
        maxW: "245px",
        height: "48px",
        px: "8px",
        py: "10px",
        tooltipLineHeight: "14px",
      }}
    />
  );
}
