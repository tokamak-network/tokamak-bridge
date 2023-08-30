import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  useToast,
  Input,
  Text,
  Link,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import MetamaskIcon from "assets/icons/metamaskAccount.svg";
import Image from "next/image";
import { useAccount } from "wagmi";
import CopyIcon from "assets/icons/accountHistory/copy.png";
import {
  CSSProperties,
  useCallback,
  useMemo,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import DrawerCloseIcon from "assets/icons/accountHistory/drawerClose.svg";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { trimAddress } from "@/utils/trim";
import copy from "copy-to-clipboard";
import userguide from "assets/icons/header/userGuide.svg";
import off from "assets/icons/header/off.svg";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import ActivityContainer from "./ActivityContainer";
import BalanceContainer from "./BalanceContainer";
import NetworkSelector from "./NetworkSelector";
import { tData } from "@/types/activity/history";
import SearchComponent from "./SearchComponent";
import AccountContainer from "./AccountContainer";
type ChainName = "MAINNET" | "GOERLI" | "TITAN" | "DARIUS" | undefined;

type SelectOption = {
  chainId: number;
  chainName: ChainName;
  networkImage: any;
};

export default function AccountHistory(props: { tData: tData }) {
  const {tData} = props
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const { address } = useAccount();
  const toast = useToast();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [tab, setTab] = useState("Activity");
  const [selectedNetwork, setSelectedNetwork] = useState<SelectOption>({
    chainId: 0,
    chainName: undefined,
    networkImage: undefined,
  });


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
          _hover={{ color: "#A0A3AD" }}
          // onClick={() => setTab("Activity")}
        >
          Bridge History
        </Text>
      </Flex>
    );
  };

  
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => {}}>
      <DrawerOverlay className="modalOverlayDrawer" bg={"none"} />
      <DrawerContent
        pt="12px"
        px="12px"
        pb="0px"
        minW={"360px"}
        maxW={"360px"}
        bgColor={"#1F2128"}
        // rowGap={"24px"}
        pos={"relative"}
      >
        <Flex
          pos={"absolute"}
          w={"40px"}
          h={"40px"}
          border={"1px solid #313442"}
          borderRadius={"8px"}
          bgColor={"transparent"}
          left={"-57px"}
          justifyContent={"center"}
          cursor={"pointer"}
          onClick={() => setIsOpen(false)}
        >
          <Image src={DrawerCloseIcon} alt={"DrawerCloseIcon"}></Image>
        </Flex>
        <AccountContainer />
        <TabContainer setTab={setTab} tab={tab} />
        <Flex>
          <NetworkSelector height="40px" setNetwork={setSelectedNetwork} />
          <SearchComponent tab={tab}/>
        </Flex>
        <Flex mt="12px">
          {/* {tab === "Balance" ? (
            <BalanceContainer network={selectedNetwork} />
          ) : (
            <ActivityContainer network={selectedNetwork} />
          )} */}
          <ActivityContainer network={selectedNetwork} tData={tData} />
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}
