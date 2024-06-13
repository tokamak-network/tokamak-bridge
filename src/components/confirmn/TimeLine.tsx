import { Box, VStack, Circle } from "@chakra-ui/react";
import React from "react";

const Timeline = ({ lineType }: { lineType: number }) => {
  const dashedBackgroundImageGray =
    "linear-gradient(to bottom, #A0A3AD 33%, rgba(255,255,255,0) 0%)";
  const dashedBackgroundImageBlue =
    "linear-gradient(to bottom, #007AFF 33%, rgba(255,255,255,0) 0%)";

  const renderTimeline = () => {
    switch (lineType) {
      case 0:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />
            <Box w={"0.5px"} height='82px' border={"0.5px dashed #A0A3AD"} />
            <Circle size='8px' bg='#A0A3AD' />
            <Box w={"0.5px"} height='82px' border={"0.5px dashed #A0A3AD"} />
            <Circle size='8px' bg='#A0A3AD' />
          </>
        );
      case 1:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />
            <Box
              w={"1px"}
              height='82px'
              style={{
                backgroundImage: dashedBackgroundImageBlue,
                backgroundPosition: "bottom",
                backgroundSize: "6px 5px",
                backgroundRepeat: "repeat-y",
              }}
            />
            <Circle size='8px' bg='#A0A3AD' />
            <Box
              w={"1px"}
              height='82px'
              style={{
                backgroundImage: dashedBackgroundImageGray,
                backgroundPosition: "bottom",
                backgroundSize: "5px 5px",
                backgroundRepeat: "repeat-y",
              }}
            />
            <Circle size='8px' bg='#A0A3AD' />
          </>
        );
      case 2:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />
            <Box
              w={"0.5px"}
              height='59px'
              border={"0.5px solid #007AFF"}
              opacity='0.4'
            />
            <Circle size='8px' bg='#007AFF' />
            <Box
              w={"1px"}
              height='84px'
              style={{
                backgroundImage: dashedBackgroundImageBlue,
                backgroundPosition: "bottom",
                backgroundSize: "6px 5px",
                backgroundRepeat: "repeat-y",
              }}
            />
            <Circle size='8px' bg='#A0A3AD' />
          </>
        );
      case 3:
      case 4:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />
            <Box
              w={"0.5px"}
              height='60px'
              border={"0.5px solid #007AFF"}
              opacity='0.4'
            />
            <Circle size='8px' bg='#007AFF' />
            <Box
              w={"0.5px"}
              height='60px'
              border={"0.5px solid #007AFF"}
              opacity='0.4'
            />
            <Circle size='8px' bg='#007AFF' />
          </>
        );
      case 100:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />

            <Box w={"0.5px"} height='82px' border={"0.5px dashed #A0A3AD"} />
            <Circle size='8px' bg='#A0A3AD' />
          </>
        );
      case 101:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />
            <Box
              w={"1px"}
              height='82px'
              style={{
                backgroundImage: dashedBackgroundImageBlue,
                backgroundPosition: "bottom",
                backgroundSize: "6px 5px",
                backgroundRepeat: "repeat-y",
              }}
            />
            <Circle size='8px' bg='#A0A3AD' />
          </>
        );
      case 102:
        return (
          <>
            <Circle size='8px' bg='#007AFF' />
            {/* <Box
              w={"1px"}
              height='82px'
              style={{
                backgroundImage: dashedBackgroundImageGray,
                backgroundPosition: "bottom",
                backgroundSize: "5px 5px",
                opacity:"0.4",
                backgroundRepeat: "repeat-y",
              }}
            /> */}
            <Box
              w={"0.5px"}
              height='60px'
              opacity='0.4'
              border={"0.5px solid #007AFF"}
            />
            <Circle size='8px' bg='#007AFF' />
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

export default Timeline;
