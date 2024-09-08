import { ProgressStatus } from "@/staging/types/transaction";
import { Box, VStack, Circle, Progress, Flex } from "@chakra-ui/react";
import React from "react";

interface TimelineComponentProps {
  pointCount: number;
  currentIndex: number;
  completedIndex: number;
}

const TimeLineComponent: React.FC<TimelineComponentProps> = (props) => {
  const { pointCount, completedIndex, currentIndex } = props;
  const dashedBackgroundImageGray =
    "linear-gradient(to bottom, #313442 33%, rgba(255,255,255,0) 0%)";
  const dashedBackgroundImageBlue =
    "linear-gradient(to bottom, #007AFF 33%, rgba(255,255,255,0) 0%)";
  let currentHeight = 0;
  return (
    <Box position={"relative"}>
      {Array.from({ length: pointCount }, (_, index) => {
        const pointStatus: ProgressStatus =
          index <= completedIndex ? ProgressStatus.Done : ProgressStatus.Todo;
        const lineStatus: ProgressStatus =
          index < completedIndex
            ? ProgressStatus.Done
            : index < currentIndex
            ? ProgressStatus.Doing
            : ProgressStatus.Todo;
        const lineHeight = lineStatus === ProgressStatus.Done ? 62 : 90;
        return (
          <Flex flexDir={"column"}>
            <Flex
              zIndex={2}
              width={"20px"}
              height={"20px"}
              justifyContent={"left"}
              alignItems={"center"}
              mb={`${index < pointCount - 1 ? lineHeight - 20 : 0}px`}
            >
              <Circle
                size="8px"
                bg={pointStatus === ProgressStatus.Done ? "#007AFF" : "#A0A3AD"}
              />
            </Flex>
            {index < pointCount - 1 && (
              <Box
                zIndex={1}
                mt={"10px"}
                ml={"3.7px"}
                position={"absolute"}
                w={"0.6px"}
                height={`${lineHeight}px`}
                border={
                  lineStatus === ProgressStatus.Done
                    ? "0.5px solid #007AFF"
                    : undefined
                }
                opacity={lineStatus === ProgressStatus.Done ? 0.4 : undefined}
                style={
                  lineStatus !== ProgressStatus.Done
                    ? {
                        backgroundImage:
                          lineStatus === ProgressStatus.Todo
                            ? dashedBackgroundImageGray
                            : lineStatus === ProgressStatus.Doing
                            ? dashedBackgroundImageBlue
                            : undefined,
                        backgroundPosition: "bottom",
                        backgroundSize: "5px 5px",
                        backgroundRepeat: "repeat-y",
                      }
                    : undefined
                }
              />
            )}
          </Flex>
        );
      })}
    </Box>
  );
};

export default TimeLineComponent;
