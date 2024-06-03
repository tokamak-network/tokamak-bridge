"use client";
import { useMediaQuery } from "@chakra-ui/react";

const useMediaView = (viewPort?: number) => {
  const [pcView] = useMediaQuery("(min-width: 1200px)");
  const [mobileView] = useMediaQuery("(max-width: 1200px)");
  const [poolTabletView] = useMediaQuery(
    "(min-width: 800px) and (max-width: 1023px)"
  );
  const [poolMobileView] = useMediaQuery("(max-width: 799px)");
  const [tabletView] = useMediaQuery("(max-width: 768px)");
  const [minorView] = useMediaQuery("(max-width: 360px)");
  const [customMaxView] = useMediaQuery(`"(max-width: ${viewPort}px)"`);

  return {
    pcView,
    mobileView,
    poolTabletView,
    poolMobileView,
    customMaxView,
    minorView,
    tabletView,
  };
};

export default useMediaView;
