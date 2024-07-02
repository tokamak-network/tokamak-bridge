import {
  CT_PROVIDE,
  CT_REQUEST,
  CT_REQUEST_CANCEL,
  HISTORY_TRANSACTION_STATUS,
  Status,
} from "@/staging/types/transaction";
import { Box, VStack, Circle } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { isFinalStatus } from "../../../utils/getStatus";

const CTTimeline = ({
  lineType,
  status,
}: {
  lineType: number;
  status: HISTORY_TRANSACTION_STATUS;
}) => {
  //dash type
  const dashedBackgroundImagePink =
    "linear-gradient(to bottom, #DB00FF 33%, rgba(255,255,255,0) 0%)";

  const isFinalStep = isFinalStatus(status);

  const RenderTimeline = useMemo(() => {
    return (
      <>
        {Array.from({ length: lineType }, (_, index) => {
          if (index === 0) {
            return <Circle key={index} size="8px" bg="#DB00FF" />;
          }
          return (
            <>
              {index + 1 !== lineType || isFinalStep ? (
                <Box
                  w={"0.5px"}
                  height="36px"
                  border={"0.5px solid #DB00FF"}
                  opacity="0.4"
                />
              ) : (
                <Box
                  w={"1px"}
                  height="36px"
                  style={{
                    backgroundImage: dashedBackgroundImagePink,
                    backgroundPosition: "bottom",
                    backgroundSize: "6px 5px",
                    backgroundRepeat: "repeat-y",
                  }}
                />
              )}
              <Circle size="8px" bg="#DB00FF" />
            </>
          );
        })}
      </>
    );
  }, [lineType]);

  <Box
    w={"1px"}
    height="36px"
    style={{
      backgroundImage: dashedBackgroundImagePink,
      backgroundPosition: "bottom",
      backgroundSize: "6px 5px",
      backgroundRepeat: "repeat-y",
    }}
  />;

  return (
    <VStack mt={"6px"} spacing={0} align="center">
      {RenderTimeline}
    </VStack>
  );
};

export default CTTimeline;
