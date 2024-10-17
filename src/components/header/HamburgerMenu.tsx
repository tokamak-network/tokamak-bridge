import {
  Flex,
  Text,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Box,
  Center,
} from "@chakra-ui/react";
import Image from "next/image";
import { menuLinks } from "./Index";
import { useRecoilState } from "recoil";
import { mobileMenuStatus } from "@/recoil/modal/atom";

import userguide from "assets/icons/header/userGuide.svg";
import userGuideHover from "assets/icons/header/userGuideHover.svg";
import lightbulbHover from "assets/icons/header/LightbulbHover.svg";
import lightbulb from "assets/icons/header/Lightbulb.svg";
import LOGO from "assets/icons/header/logo-dark-hc.svg";
import { usePathname, useRouter } from "next/navigation";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

const CustomMenuItem = (props: {
  link: string;
  title: string;
  icon: any;
  hoverIcon: any;
}) => {
  const { link, title, icon } = props;
  return (
    <Flex
      align={"center"}
      target="_blank"
      as={"a"}
      href={link}
      h={"40px"}
      marginBottom={"8px"}
      padding={"8px"}
      _focus={{ background: "0F0F12" }}
      _hover={{ bg: "#313442" }}
      borderRadius={"8px"}
    >
      <Flex mr="9px">
        <Image
          width={title === "User Guide" || title === "Get Help" ? 24 : 18}
          src={icon}
          alt="icon"
        />
      </Flex>
      <Text
        fontSize={
          title === "User Guide" || title === "Get Help" ? "14px" : "12px"
        }
      >
        {title}
      </Text>
    </Flex>
  );
};

const RouterMenu = (props: { title: string; link: string }) => {
  const { title, link } = props;
  const router = useRouter();
  const { initializeTokenPair } = useInOutTokens();
  const [, setHamburgerOpen] = useRecoilState(mobileMenuStatus);

  return (
    <Flex
      alignItems={"center"}
      fontSize={16}
      h={"40px"}
      mb={"8px"}
      cursor={"pointer"}
      onClick={() => {
        router.push(link);
        initializeTokenPair();
        setHamburgerOpen(false);
      }}
    >
      <Text>{title}</Text>
    </Flex>
  );
};

const HamburgerMenu = () => {
  const [isHamburgerOpen, setHamburgerOpen] = useRecoilState(mobileMenuStatus);

  return (
    <Drawer
      isOpen={isHamburgerOpen}
      placement="right"
      onClose={() => {
        setHamburgerOpen(false);
      }}
      trapFocus={false}
      useInert={true}
    >
      <DrawerOverlay
        onClick={() => setHamburgerOpen(false)}
        sx={{
          bg: "rgba(0, 0, 0, 0.5)",
        }}
      />
      <Box
        zIndex={1400}
        pos={"fixed"}
        w={"full"}
        h={"full"}
        left={0}
        top={0}
        bg={"#000000B0"}
      >
        <DrawerContent maxW={"248px"}>
          <Flex
            w={"100%"}
            h={"100%"}
            bg={"#1F2128"}
            flexDir={"column"}
            padding={"32px 21px"}
          >
            <Image src={LOGO} alt="Logo" />
            <Box padding={"8px"} marginTop={"32px"}>
              <RouterMenu title="Bridge & Swap" link="/" />
              <RouterMenu title="Liquidity" link="/pools" />
              <CustomMenuItem
                link="https://tokamaknetwork.gitbook.io/home/02-service-guide/tokamak-bridge"
                title="User Guide"
                icon={userguide}
                hoverIcon={userGuideHover}
              />
              <CustomMenuItem
                link="https://forms.gle/GLY1PZq4BH4RqZY79"
                title="Get Help"
                icon={lightbulb}
                hoverIcon={lightbulbHover}
              />
              <Flex w="100%" alignItems={"center"} mt={"8px"} mb={"8px"}>
                <Flex w="52px" h="1px" bg={"#757893"} mr="10px"></Flex>
                <Text color={"#757893"} fontSize={"12px"}>
                  COMMUNITY
                </Text>
                <Flex w="52px" h="1px" bg={"#757893"} ml="10px"></Flex>
              </Flex>
              {menuLinks.map((link: any) => {
                return (
                  <CustomMenuItem
                    link={link.link}
                    title={link.title}
                    icon={link.icon}
                    hoverIcon={link.hoverIcon}
                    key={link.title}
                  />
                );
              })}
            </Box>
          </Flex>
        </DrawerContent>
      </Box>
    </Drawer>
  );
};

export default HamburgerMenu;
