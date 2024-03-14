import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  Box,
} from "@chakra-ui/react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useMemo, useState, SetStateAction, Dispatch, useEffect } from "react";
import DrawerCloseIcon from "assets/icons/accountHistory/drawerClose.svg";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import ActivityContainer from "./ActivityContainer";
import NetworkSelector from "./NetworkSelector";
import SearchComponent from "./SearchComponent";
import AccountContainer from "./AccountContainer";
import useMediaView from "@/hooks/mediaView/useMediaView";
import Account from "../header/Account";

type ChainName = "MAINNET" | "GOERLI" | "TITAN" | "DARIUS" | undefined;

type SelectOption = {
  chainId: number;
  chainName: ChainName;
  networkImage: any;
};

export default function AccountHistory() {
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const { address } = useAccount();
  const [tab, setTab] = useState("Activity");
  const [selectedNetwork, setSelectedNetwork] = useState<SelectOption>({
    chainId: 0,
    chainName: undefined,
    networkImage: undefined,
  });
  const { mobileView } = useMediaView();

  useEffect(() => {
    if (address === undefined) {
      setIsOpen(false);
    }
  }, [address]);

  const TabContainer = (props: {
    setTab: Dispatch<SetStateAction<string>>;
    tab: string;
  }) => {
    const { setTab, tab } = props;
    return (
      <Flex columnGap={"24px"} mt="16px" mb="8px">
        {/* <Text
          cursor={"pointer"}
          color={tab === "Balance" ? "#fff" : "#5E626D"}
          _hover={{ color: "#A0A3AD" }}
          onClick={() => setTab("Balance")}
        >
          Balance
        </Text> */}
        <Text
          // cursor={"pointer"}
          // color={tab === "Activity" ? "#fff" : "#5E626D"}
          color={"#fff"}
          // _hover={{ color: "#A0A3AD" }}
          // onClick={() => setTab("Activity")}
        >
          Bridge History
        </Text>
      </Flex>
    );
  };
  const Network = useMemo(() => {
    return <NetworkSelector setNetwork={setSelectedNetwork} />;
  }, []);

  return (
    <Drawer
      isOpen={isOpen && address !== undefined}
      placement="right"
      onClose={() => {
        setIsOpen(false);
        setSelectedNetwork({
          chainId: 0,
          chainName: undefined,
          networkImage: undefined,
        });
      }}
      variant="clickThrough"
      trapFocus={false}
      useInert={true}
    >
      <DrawerOverlay
        bg={{ base: "#000000F0", lg: "none" }}
        pointerEvents={"auto"}
        onClick={() => setIsOpen(false)}
      />

      {mobileView && (
        <Box
          zIndex={10000}
          w={"fit-content"}
          h={"fit-content"}
          pos={"fixed"}
          right={"52px"}
          top={"24px"}
        >
          <Account />
        </Box>
      )}

      <DrawerContent
        px="12px"
        pb="0px"
        mt={{ base: "64px", lg: "0px" }}
        minW={{ base: "100%", lg: "360px" }}
        maxW={{ base: "100%", lg: "360px" }}
        bgColor={"#1F2128"}
        rounded={{ base: "16px 16px 0px 0px", lg: "0" }}
        // pos={"relative"}
      >
        {!mobileView && <AccountContainer />}
        <TabContainer setTab={setTab} tab={tab} />
        {!mobileView && (
          <Flex>
            {Network}
            {/* <NetworkSelector  setNetwork={setSelectedNetwork} /> */}
            <SearchComponent tab={tab} />
          </Flex>
        )}
        <Flex mt={{ base: "0px", lg: "12px" }} height={"100%"}>
          {/* {tab === "Balance" ? (
            <BalanceContainer network={selectedNetwork} />
          ) : (
            <ActivityContainer network={selectedNetwork} />
          )} */}
          <ActivityContainer network={selectedNetwork} />
        </Flex>
        <Flex
          pos={"absolute"}
          left={"-72px"}
          height={"100%"}
          bg="transparent"
          justifyContent={"center"}
          // border={"1px solid red"}
          // w={"72px"}
          _hover={{
            transform: "translate(8px)",

            bg: "rgba(31, 33, 40, 0.50)",
            zIndex: -1,
          }}
          onClick={() => {
            setIsOpen(false);
            setSelectedNetwork({
              chainId: 0,
              chainName: undefined,
              networkImage: undefined,
            });
          }}
          cursor={"pointer"}
          // transform={"translate(-7px)"}
          transition={"background 250ms ease 0s, transform 250ms ease 0s"}
        >
          <Flex
            m={"16px 20px 16px 12px"}
            w={"40px"}
            h={"40px"}
            border={"1px solid #313442"}
            borderRadius={"8px"}
            bgColor={"transparent"}
            justifyContent={"center"}
          >
            <Image src={DrawerCloseIcon} alt={"DrawerCloseIcon"}></Image>
          </Flex>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}
