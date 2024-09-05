import { Overlay_Index } from "@/types/style/overlayIndex";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
} from "@chakra-ui/react";
import Network from "./Network";
import Account from "./Account";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mobileMenuStatus, actionMethodStatus } from "@/recoil/modal/atom";
import github from "assets/icons/header/github.svg";
import linkedIn from "assets/icons/header/linkedin.svg";
import telegram from "assets/icons/header/telegram.svg";
import discord from "assets/icons/header/discord.svg";
import twitter from "assets/icons/header/Twitter.svg";
import medium from "assets/icons/header/medium.svg";
import userguide from "assets/icons/header/userGuide.svg";
import arrow from "assets/icons/header/smallArrow.svg";
import lightbulb from "assets/icons/header/Lightbulb.svg";
import userGuideHover from "assets/icons/header/userGuideHover.svg";
import lightbulbHover from "assets/icons/header/LightbulbHover.svg";
import mediumHover from "assets/icons/header/mediumHover.svg";
import twitterHover from "assets/icons/header/TwitterHover.svg";
import discordHover from "assets/icons/header/discordHover.svg";
import telegramHover from "assets/icons/header/telegramHover.svg";
import linkedInHover from "assets/icons/header/linkedinHover.svg";
import githubHover from "assets/icons/header/githubHover.svg";
import hamburger from "assets/icons/header/hamburger.svg";
import big_hamburger from "assets/icons/header/big_hamburger.svg";
import { useRecoilState } from "recoil";
import useMediaView from "@/hooks/mediaView/useMediaView";
import useConnectedNetwork from "@/hooks/network";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";
import { useAccount } from "wagmi";
import WARNING_ICON from "assets/icons/pool/unsupportedNetworkWarning.svg";
import { useGetMode } from "@/hooks/mode/useGetMode";

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
  const { initializeTokenPair } = useInOutTokens();

  return (
    <Center
      fontSize={16}
      cursor={"pointer"}
      borderBottom={
        !menuState &&
        pathname &&
        pathname.split("/")[1] === link.replaceAll("/", "")
          ? "3px solid #007AFF"
          : ""
      }
      onClick={() => {
        router.push(link);
        initializeTokenPair();
      }}
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

export const menuLinks = [
  {
    title: "Medium",
    link: "https://medium.com/tokamak-network",
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

export default function Header() {
  const [menuState, setMenuState] = useState(false);
  const [isMobileMenu, setMobileMenuOpen] = useRecoilState(mobileMenuStatus);
  const [actionModalStatus, setActionMethod] =
    useRecoilState(actionMethodStatus);
  const { headerMobileView: mobileView } = useMediaView();
  const [menuView] = useMediaQuery("(min-width: 680px)");

  const { isConnected } = useAccount();
  const { isSupportedChain } = useConnectedNetwork();
  const router = useRouter();
  const { mode } = useGetMode();

  const handleMenuButtonhover = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    setMenuState(true);
  };

  const handleMenuButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    !menuState && setMenuState(!menuState);
  };

  return (
    <Flex
      minW={"100%"}
      zIndex={
        actionModalStatus && mobileView && !isMobileMenu
          ? Overlay_Index.AlwaysTop
          : Overlay_Index.Header
      }
      justifyContent={"space-between"}
      alignItems={{ base: "center", lg: "flex-start" }}
      mt={{ base: "16px", lg: "22px" }}
      px={{ base: "12px", lg: "40px" }}
      pos={"absolute"}
    >
      <Flex columnGap={"35px"} height={"48px"} alignItems={"center"}>
        <Box
          onClick={() => {
            if (mode == "Pool") {
              router.push("/");
            }

            mobileView ? setActionMethod(true) : "";
          }}
          cursor={"pointer"}
        >
          <Image
            width={mobileView ? 28 : 36}
            src={LOGO_IMAGE}
            alt={"LOGO_IMAGE"}
          />
        </Box>
        <Flex columnGap={"30px"} display={menuView ? "flex" : "none"}>
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
                link="https://docs.tokamak.network/home/02-service-guide/tokamak-bridge"
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
                    key={link.title}
                  />
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex columnGap={{ base: "8px", lg: "6px" }}>
        {!mobileView && <Network />}
        {/** 네트워크가 연결되었지만 지원되지 않았을 때  */}
        {mobileView && isConnected && !isSupportedChain && (
          <Flex
            bgColor={"#1F2128"}
            w={"32px"}
            h={"32px"}
            alignItems={"center"}
            justifyContent={"space-between"}
            px={"4px"}
            borderRadius={"8px"}
          >
            <Image
              src={WARNING_ICON}
              alt={"WARNING_ICON"}
              style={{ width: "34px", height: "34px" }}
            />
          </Flex>
        )}
        <Flex flexDir={"column"} alignItems={"flex-end"}>
          <Account />
          {/* <AccountModal /> */}
        </Flex>

        {!menuView && (
          <Flex
            w={!mobileView ? "48px" : "32px"}
            h={!mobileView ? "48px" : "32px"}
            justify={"center"}
            align={"center"}
            borderRadius={8}
            border={"1px solid #313442"}
            cursor={"pointer"}
            onClick={() => {
              // setActionMethod(false);
              setMobileMenuOpen(true);
            }}
          >
            <Image
              alt="hamburger"
              src={!mobileView ? big_hamburger : hamburger}
            />
          </Flex>
        )}

        {/* <UserMenu /> */}
      </Flex>
    </Flex>
  );
}
