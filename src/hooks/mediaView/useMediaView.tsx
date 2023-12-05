"use client";
import { useMediaQuery } from "@chakra-ui/react";

const useMediaView = (viewPort?: number) => {
  
  const [pcView] = useMediaQuery("(min-width: 1200px)");
  const [mobileView] = useMediaQuery("(max-width: 799px)");  
  const [customMaxView] = useMediaQuery(`"(max-width: ${viewPort}px)"`);

  return {
    pcView,
    mobileView,
    customMaxView,
  };
};

export default useMediaView;
