import { Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ScrolltoTopButton() {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY && currentScrollY > 100) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return showTopBtn ? (
    <Button
      w={"52px"}
      h={"39px"}
      position="fixed"
      bottom="32px"
      right="32px"
      zIndex="tooltip"
      onClick={scrollToTop}
      borderRadius="8px"
      py={"8px"}
      px={"12px"}
      bg={"#007AFF"}
      _active={{}}
      _hover={{}}
    >
      <Text
        fontSize={"14px"}
        fontWeight={"600"}
        lineHeight={"21px"}
        color={"#FFFFFF"}
      >
        Top
      </Text>
    </Button>
  ) : null;
}
