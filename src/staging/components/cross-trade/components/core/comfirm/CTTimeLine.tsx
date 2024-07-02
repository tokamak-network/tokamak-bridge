import { Box, VStack, Circle } from "@chakra-ui/react";
import React, { useMemo } from "react";

const CTTimeline = ({ lineType }: { lineType: number }) => {
  //dash type
  const dashedBackgroundImagePink =
    "linear-gradient(to bottom, #DB00FF 33%, rgba(255,255,255,0) 0%)";

  const RenderTimeline = useMemo(() => {
    return (
      <>
        {Array.from({ length: lineType }, (_, index) => {
          if (index === 0) {
            return <Circle key={index} size="8px" bg="#DB00FF" />;
          }
          return (
            <>
              {index + 1 !== lineType ? (
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

  // const renderTimeline = () => {
  //   return;
  //   switch (lineType) {
  //     case 1:
  //       return (
  //         <>
  //           <Circle size="8px" bg="#DB00FF" />
  //           <Box
  //             w={"0.5px"}
  //             height="36px"
  //             border={"0.5px solid #DB00FF"}
  //             opacity="0.4"
  //           />
  //           <Circle size="8px" bg="#DB00FF" />
  //           <Box
  //             w={"0.5px"}
  //             height="36px"
  //             border={"0.5px solid #DB00FF"}
  //             opacity="0.4"
  //           />
  //           <Circle size="8px" bg="#DB00FF" />
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
  //           <Circle size="8px" bg="#DB00FF" />
  //         </>
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <VStack mt={"6px"} spacing={0} align="center">
      {RenderTimeline}
    </VStack>
  );
};

export default CTTimeline;
