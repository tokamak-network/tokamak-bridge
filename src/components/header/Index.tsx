import { Overlay_Index } from "@/types/style/overlayIndex";
import { Box, Center, Flex, Text } from "@chakra-ui/layout";
import Network from "./Network";
import Account from "./Account";
import UserMenu from "./UserMenu";
import { usePathname } from "next/navigation";

const menuList = [
  {
    title: "BRIDGE & SWAP",
    link: "/",
  },
  {
    title: "POOLS",
    link: "",
  },
];

const HeaderMenu = (props: { title: string; link: string }) => {
  const { title, link } = props;
  const pathname = usePathname();

  return (
    <Center
      fontSize={16}
      cursor={"pointer"}
      borderBottom={pathname === link ? "3px solid #007AFF" : ""}
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
          <Box
            w={"36px"}
            h={"36px"}
            bgColor={"#2A72E5"}
            borderRadius={"100%"}
          />
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
