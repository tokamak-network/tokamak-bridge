import { Overlay_Index } from "@/types/style/overlayIndex";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Link,
} from "@chakra-ui/react";
import Network from "./Network";
import Account from "./Account";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import github from "assets/icons/header/github.svg";
import linkedIn from "assets/icons/header/linkedin.svg";
import telegram from "assets/icons/header/telegram.svg";
import discord from "assets/icons/header/discord.svg";
import kakao from "assets/icons/header/kakao.svg";
import twitter from "assets/icons/header/Twitter.svg";
import medium from "assets/icons/header/medium.svg";
import userguide from "assets/icons/header/userGuide.svg";
import arrow from "assets/icons/header/smallArrow.svg";
import lightbulb from "assets/icons/header/Lightbulb.svg";
import userGuideHover from "assets/icons/header/userGuideHover.svg";
import lightbulbHover from "assets/icons/header/LightbulbHover.svg";
import mediumHover from "assets/icons/header/mediumHover.svg";
import twitterHover from "assets/icons/header/TwitterHover.svg";
import kakaoHover from "assets/icons/header/kakaoHover.svg";
import discordHover from "assets/icons/header/discordHover.svg";
import telegramHover from "assets/icons/header/telegramHover.svg";
import linkedInHover from "assets/icons/header/linkedinHover.svg";
import githubHover from "assets/icons/header/githubHover.svg";
import AccountModal from "../modal/AccountModal";
const menuList = [
  {
    title: "BRIDGE & SWAP",
    link: "/",
  },
  {
    title: "POOLS",
    link: "/pools",
  },
];

const HeaderMenu = (props: {
  title: string;
  link: string;
  menuState: boolean;
}) => {
  const { title, link, menuState } = props;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Center
      fontSize={16}
      cursor={"pointer"}
      borderBottom={
        !menuState && pathname.split("/")[1] === link.replaceAll("/", "")
          ? "3px solid #007AFF"
          : ""
      }
      onClick={() => router.push(link)}
    >
      <Text>{title}</Text>
    </Center>
  );
};

const CustomMenuItem = (props: {
  link: string;
  title: string;
  icon: any;
  hoverIcon: any;
}) => {
  const { link, title, icon, hoverIcon } = props;
  const [hover, setHover] = useState(false);
  return (
    <MenuItem
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      target="_blank"
      as={"a"}
      href={link}
      h={"18px"}
      marginBottom={"16px"}
      padding={"0px"}
      // border={'1px solid red'}
      bg="#0F0F12"
      _focus={{ background: "0F0F12" }}
      _hover={{ bg: "none", color: "#2a72e5" }}
    >
      <Flex mr="9px">
        <Image src={hover ? hoverIcon : icon} alt="icon" />
      </Flex>
      <Text
        fontSize={
          title === "User Guide" || title === "Get Help" ? "14px" : "12px"
        }
      >
        {title}
      </Text>
    </MenuItem>
  );
};

export default function Header() {
  const [menuState, setMenuState] = useState(false);
  const wrapperRef = useRef(null);

  const menuLinks = [
    {
      title: "Medium",
      link: "https://medium.com/onther-tech",
      icon: medium,
      hoverIcon: mediumHover,
    },
    {
      title: "Twitter",
      link: "https://twitter.com/tokamak_network",
      icon: twitter,
      hoverIcon: twitterHover,
    },
    {
      title: "Kakaotalk",
      link: "https://open.kakao.com/o/g2zlglHd",
      icon: kakao,
      hoverIcon: kakaoHover,
    },
    {
      title: "Discord",
      link: "https://discord.com/invite/J4chV2zuAK",
      icon: discord,
      hoverIcon: discordHover,
    },
    {
      title: "Telegram",
      link: "https://t.me/tokamak_network",
      icon: telegram,
      hoverIcon: telegramHover,
    },
    {
      title: "LinkedIn",
      link: "https://www.linkedin.com/company/tokamaknetwork/",
      icon: linkedIn,
      hoverIcon: linkedInHover,
    },
    {
      title: "Github",
      link: "https://github.com/tokamak-network",
      icon: github,
      hoverIcon: githubHover,
    },
  ];

  const handleMenuButtonhover = (event: any) => {
    event.preventDefault();
    setMenuState(true);
  };

  const handleMenuButtonClick = (event: any) => {
    event.preventDefault();

    !menuState && setMenuState(!menuState);
  };



  return (
    <Flex
      minW={"100%"}
      zIndex={Overlay_Index.Header}
      justifyContent={"space-between"}
      alignItems={"flex-start"}
      mt={"22px"}
      px={"40px"}
      pos={"absolute"}
    >
      <Flex columnGap={"35px"} height={"48px"} alignItems={"center"}>
        <Box>
          <Image src={LOGO_IMAGE} alt={"LOGO_IMAGE"} />
        </Box>
        <Flex columnGap={"30px"}>
          {menuList.map((menuInfo) => (
            <HeaderMenu
              key={menuInfo.title}
              {...menuInfo}
              menuState={menuState}
            ></HeaderMenu>
          ))}

          <Menu
            onClose={() => {
              setMenuState(false);
            }}
            isOpen={menuState}
          >
            <MenuButton
              as={Center}
              fontSize={16}
              cursor={"pointer"}
              onMouseEnter={handleMenuButtonhover}
              // onMouseLeave={()=> setHoverOn(false)}
              onMouseDown={handleMenuButtonClick}
              borderBottom={menuState ? "3px solid #007AFF" : ""}
              onClick={handleMenuButtonClick}
              display={"flex"}
              flexDir={"row"}
            >
              <Flex>
                <Text>MORE</Text>
                <Flex
                  marginLeft={"4px"}
                  height={"24px"}
                  // width={"24px"}
                  transform={menuState === true ? "rotate(180deg)" : ""}
                >
                  <Image src={arrow} alt="icon_arrow" />
                </Flex>
              </Flex>
            </MenuButton>
            <MenuList
              onMouseLeave={() => setMenuState(false)}
              bg="#0F0F12"
              mt={"17px"}
              border={"1px solid #313442"}
              style={{
                minWidth: "117px",
                paddingTop: "16px",
                paddingBottom: "0px",
                paddingLeft: "16px",
                paddingRight: "16px",
              }}
            >
              <CustomMenuItem
                link="https://tokamaknetwork.gitbook.io/home/02-service-guide/Tokamak-Bridge"
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
              <Flex w="100%" alignItems={"center"} mb={"16px"}>
                <Flex w="24px" h="1px" bg={"#757893"} mr="10px"></Flex>
                <Text color={"#757893"} fontSize={"12px"}>
                  COMMUNITY
                </Text>
                <Flex w="24px" h="1px" bg={"#757893"} ml="10px"></Flex>
              </Flex>
              {menuLinks.map((link: any) => {
                return (
                  <CustomMenuItem
                    link={link.link}
                    title={link.title}
                    icon={link.icon}
                    hoverIcon={link.hoverIcon}
                  />
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex columnGap={"6px"}>
        <Network />
        <Flex flexDir={"column"} alignItems={"flex-end"}>
          <Account />
          <AccountModal />
        </Flex>

        {/* <UserMenu /> */}
      </Flex>
    </Flex>
  );
}
