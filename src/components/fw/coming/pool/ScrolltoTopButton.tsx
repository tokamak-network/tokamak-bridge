import { Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function ScrolltoTopButton() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  return showTopBtn ? (
    <Button
      w={"52px"}
      h={"39px"}
      position='fixed'
      bottom='30px'
      right='52px'
      zIndex='tooltip'
      onClick={scrollToTop}
      borderRadius='8px'
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
  ) : (
    <></>
  );
}
