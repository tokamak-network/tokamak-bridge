import { Box, VStack, Circle } from "@chakra-ui/react";
import React from "react";

const CTTimeline = ({ lineType }: { lineType: number }) => {
  //dash type
  const dashedBackgroundImagePink =
    "linear-gradient(to bottom, #DB00FF 33%, rgba(255,255,255,0) 0%)";

  const renderTimeline = () => {
    switch (lineType) {
      case 1:
        return (
          <>
            <Circle size='8px' bg='#DB00FF' />
            <Box
              w={"0.5px"}
              height='36px'
              border={"0.5px solid #DB00FF"}
              opacity='0.4'
            />
            <Circle size='8px' bg='#DB00FF' />
            <Box
              w={"0.5px"}
              height='36px'
              border={"0.5px solid #DB00FF"}
              opacity='0.4'
            />
            <Circle size='8px' bg='#DB00FF' />
            <Box
              w={"1px"}
              height='36px'
              style={{
                backgroundImage: dashedBackgroundImagePink,
                backgroundPosition: "bottom",
                backgroundSize: "6px 5px",
                backgroundRepeat: "repeat-y",
              }}
            />
            <Circle size='8px' bg='#DB00FF' />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <VStack mt={"6px"} spacing={0} align='center'>
      {renderTimeline()}
    </VStack>
  );
};

export default CTTimeline;
