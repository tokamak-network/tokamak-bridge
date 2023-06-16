import { Overlay_Index } from "@/types/style/overlayIndex";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import Network from "./Network";
import Account from "./Account";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";
import Image from "next/image";
import LOGO_IMAGE from "assets/icons/serviceLogo.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function Header() {
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
        </Flex>
      </Flex>
      <Flex columnGap={"6px"}>
        <Network />
        <Account />
        <UserMenu />
      </Flex>
    </Flex>
  );
}
