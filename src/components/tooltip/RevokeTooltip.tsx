import { Flex } from "@chakra-ui/react";
import { CustomTooltipWithQuestion } from "./CustomTooltip";
import { CSSProperties } from "react";

export function TooltipForRevoke(props: {
  style?: CSSProperties;
  isGrayIcon?: boolean;
  isBlueIcon?: boolean;
}) {
  const { style, isGrayIcon, isBlueIcon } = props;
  return (
    <Flex ml={"-5px"} style={style}>
      <CustomTooltipWithQuestion
        isGrayIcon={isGrayIcon ?? true}
        isBlueIcon={isBlueIcon}
        tooltipLabel={
          <Flex
            w={"240px"}
            h={"45px"}
            fontSize={11}
            textAlign={"center"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {
              <span>
                Approval for USDT must be revoked first <br />
                before a new amount is approved.
              </span>
            }
          </Flex>
        }
        style={{ px: "-5px", tooltipLineHeight: "15x", height: "45px" }}
      ></CustomTooltipWithQuestion>
    </Flex>
  );
}
