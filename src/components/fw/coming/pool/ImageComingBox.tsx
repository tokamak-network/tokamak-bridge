import Image from "next/image";
import { Box } from "@chakra-ui/react";
import FwComingCrossMobile from "@/assets/image/BridgeSwap/fw/fwComingCrossMobile.png";
import FwComingCross from "@/assets/image/BridgeSwap/fw/fwComingCross.png";
import useMediaView from "@/hooks/mediaView/useMediaView";

interface ImageBoxProp {
  isMobile: boolean;
}

export default function ImageComingBox(props: ImageBoxProp) {
  const { isMobile } = props;
  const { poolTabletView } = useMediaView();
  const boxWidth = isMobile ? undefined : poolTabletView ? "536px" : "672px";
  const boxGraWidth = isMobile ? "100vw" : poolTabletView ? "536px" : "672px";
  const boxGraHeight = isMobile ? "60vh" : poolTabletView ? "534px" : "548px";

  return (
    <Box
      position='relative'
      overflow='hidden'
      borderRadius={"16px"}
      width={boxWidth}
      height={isMobile ? undefined : "548px"}
    >
      <Box zIndex={1}>
        <Image
          src={isMobile ? FwComingCrossMobile : FwComingCross}
          alt='FwComingCrossMobile'
          style={{
            width: boxWidth,
            height: isMobile ? undefined : "548px",
          }}
        />
      </Box>
      <Box
        position='absolute'
        top={"58%"}
        width={isMobile ? "100vw" : "672px"}
        height={isMobile ? "60vh" : "548px"}
        bgImage='linear-gradient(180deg, rgba(23, 24, 29, 0.00) -18.91%, #17181D 100%)'
        bgPos='-0.488px -410px'
        bgSize='100.132% 231.41%'
        bgRepeat='no-repeat'
        backdropFilter='auto'
        backdropBlur='2.5px'
        zIndex={2}
      />
      <Box
        position='absolute'
        top={"75%"}
        width={boxGraWidth}
        height={boxGraHeight}
        bgImage={
          "linear-gradient(180deg, rgba(23, 24, 29, 0.00) -18.91%, #17181D 100%)"
        }
        backdropFilter='auto'
        backdropBlur='1.5px'
        opacity={0.5}
        zIndex={3}
      />
      <Box
        position='absolute'
        top={isMobile ? "65%" : "95%"}
        left={"50%"}
        width={boxGraWidth}
        height={boxGraHeight}
        transform='translate(-50%, -50%) rotate(87.874deg)'
        bgImage='conic-gradient(from 0deg at 56.11% 59.69%, #267BEB 0deg, #50AF95 48.75000178813934deg, #EA62DC 93.74999642372131deg, #000 140.625deg, #A40000 183.75000715255737deg, #DCFF04 230.625deg, #4361EE 271.8749928474426deg, #DB00FF 315deg, #8000FF 360deg)'
        opacity={0.25}
        filter='blur(110px)'
        zIndex={4}
      />
    </Box>
  );
}
