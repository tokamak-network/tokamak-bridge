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
import { useState } from "react";
import github from "assets/icons/header/github.svg";
import linkedIn from "assets/icons/header/linkedin.svg";
import telegram from "assets/icons/header/telegram.svg";
import discord from "assets/icons/header/discord.svg";
import kakao from "assets/icons/header/kakao.svg";
import twitter from "assets/icons/header/Twitter.svg";
import medium from "assets/icons/header/medium.svg";
import userguide from "assets/icons/header/userGuide.svg";
import arrow from 'assets/icons/header/smallArrow.svg'
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

const HeaderMenu = (props: { title: string; link: string }) => {
  const { title, link } = props;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Center
      fontSize={16}
      cursor={"pointer"}
      borderBottom={
        pathname.split("/")[1] === link.replaceAll("/", "")
          ? "3px solid #007AFF"
          : ""
      }
      onClick={() => router.push(link)}
    >
      <Text>{title}</Text>
    </Center>
  );
};

const CustomMenuItem = (props: { link: string; title: string; icon: any }) => {
  const { link, title, icon } = props;

  return (
    <MenuItem
      target="_blank"
      as={"a"}
      href={link}
      h={"18px"}
      marginBottom={"16px"}
      padding={"0px"}
      // border={'1px solid red'}
      bg="#0F0F12"
      _focus={{ background: "0F0F12" }}
      _hover={{ bg: "none" }}
    
    >
      <Flex mr="9px">
        <Image src={icon} alt="icon" />
      </Flex>
      <Text fontSize={title === "User Guide" ? "14px" : "12px"}>{title}</Text>
    </MenuItem>
  );
};

export default function Header() {
  const [menuState, setMenuState] = useState(false);
  const [hoverOn, setHoverOn] = useState(false);
  const menuLinks = [
    { title: "Medium", link: "", icon: medium },
    { title: "Twitter", link: "", icon: twitter },
    { title: "Kakaotalk", link: "", icon: kakao },
    { title: "Discord", link: "", icon: discord },
    { title: "Telegram", link: "", icon: telegram },
    { title: "LinkedIn", link: "", icon: linkedIn },
    { title: "Github", link: "", icon: github },
  ];
  return (
    <Flex
      minW={"100%"}
      zIndex={Overlay_Index.Header}
      justifyContent={"space-between"}
      alignItems={"center"}
      mt={"22px"}
      px={"40px"}
      pos={"absolute"}
    >
      <Flex columnGap={"35px"}>
        <Box>
          <Image src={LOGO_IMAGE} alt={"LOGO_IMAGE"} />
        </Box>
        <Flex columnGap={"30px"}>
          {menuList.map((menuInfo) => (
            <HeaderMenu key={menuInfo.title} {...menuInfo}></HeaderMenu>
          ))}

          <Menu
            onClose={() => {
              setMenuState(false);
            }}
          >
            <MenuButton
              as={Center}
              fontSize={16}
              cursor={"pointer"}
              // onMouseEnter={()=> setHoverOn(true)}
              // onMouseLeave={()=> setHoverOn(false)}
              borderBottom={menuState ? "3px solid #007AFF" : ""}
              onClick={() => {
                setMenuState(!menuState);
              }}
              display={'flex'}
              flexDir={'row'}
            >
              <Flex>
              <Text>MORE</Text>
              <Flex
              marginLeft={'4px'}
                height={"24px"}
                // width={"24px"}
                transform={menuState === true ? "" : "rotate(180deg)"}
              >
                <Image src={arrow} alt="icon_arrow" />
              </Flex>
              </Flex>
             
            </MenuButton>
            <MenuList
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
              <CustomMenuItem link="" title="User Guide" icon={userguide} />
              <Flex w="100%" alignItems={'center'} mb={'16px'}>
                <Flex w='24px' h='1px' bg={'#757893'} mr='10px'></Flex>
                <Text color={"#757893"} fontSize={"12px"}>
                  COMMUNITY
                </Text>
                <Flex w='24px' h='1px' bg={'#757893'} ml='10px'></Flex>
              </Flex>
              {menuLinks.map((link: any) => {
                return (
                  <CustomMenuItem
                    link={link.link}
                    title={link.title}
                    icon={link.icon}
                  />
                );
              })}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Flex columnGap={"6px"}>
        <Network />
        <Account />
        {/* <UserMenu /> */}
      </Flex>
    </Flex>
  );
}
