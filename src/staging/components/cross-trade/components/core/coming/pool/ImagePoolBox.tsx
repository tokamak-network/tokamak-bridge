import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";

import PoolComing from "@/assets/image/BridgeSwap/ct/poolComing.png";
import PoolComingTablet from "@/assets/image/BridgeSwap/ct/poolComingTablet.png";

interface ImageBoxProp {
  isMobile: boolean;
  isPool?: boolean;
}

export default function ImagePoolBox(props: ImageBoxProp) {
  const { isMobile } = props;

  return (
    <Box
      position='relative'
      overflow='hidden'
      border={"1px solid #313442"}
      borderRadius={"16px"}
      width={isMobile ? undefined : "536px"}
      height={isMobile ? "85vh" : "549px"}
    >
      <Box zIndex={1}>
        <Image
          src={isMobile ? PoolComing : PoolComingTablet}
          alt='CTComingCrossMobile'
          style={{
            width: isMobile ? undefined : "536px",
            height: isMobile
              ? "85vh"
              : "549px" /** %단위로 잡아서 진행해 본다. */,
            objectPosition: "top",
            objectFit: "cover",
          }}
        />
      </Box>
      <Box
        position='absolute'
        top={0}
        left={0}
        width='100%'
        height='100%'
        bg={"#17181D"}
        opacity={0.9}
        zIndex={2} // Ensure this is below the text layer
      />
      <Box
        width={isMobile ? "181px" : "100%"}
        position='absolute'
        top='50%'
        left='50%'
        transform='translate(-50%, -50%)'
        zIndex={3} // Ensure this is above the overlay but below the text
        textAlign='center'
      >
        <Text
          fontSize='16px'
          fontWeight='500'
          color='#FFFFFF'
          lineHeight={"24px"}
        >
          Uniswap v3 pool is available from 1024 px
        </Text>
      </Box>
    </Box>
  );
}
