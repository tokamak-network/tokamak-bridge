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
import ICON_SEARCH from "assets/icons/searchGray.svg";
import { searchTxStatus } from "@/recoil/userHistory/searchTx";

type ChainName = "MAINNET" | "GOERLI" | "TITAN" | "DARIUS" | undefined;

type SelectOption = {
  chainId: number;
  chainName: ChainName;
  networkImage: any;
};

export default function AccountHistory(props:{tData:any}) {
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
  
  const handleCopyToClipboard = () => {
    copy(address !== undefined ? address : "");

    toast({
      title: "Copied to Clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const TopLine = () => {
    return (
      <>
        <Box
          pos={"absolute"}
          w={"400px"}
          h={"100px"}
          top={"-83px"}
          left={"-100px"}
          bg={"#007AFF"}
          transform={"rotate(-30deg)"}
          opacity={0.15}
        ></Box>
        <Box
          pos={"absolute"}
          w={"400px"}
          h={"4.63px"}
          top={"15px"}
          left={"-100px"}
          bg={"rgba(255, 255, 255, 0.5)"}
          transform={"rotate(-30deg)"}
        ></Box>
        <Box
          pos={"absolute"}
          w={"400px"}
          h={"47px"}
          top={"28px"}
          left={"-100px"}
          bg={`linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%)`}
          transform={"rotate(-30deg)"}
        ></Box>
      </>
    );
  };

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
  const AccountContainer = () => {
    const { address } = useAccount();
    return (
      <Flex
        opacity={0.85}
        borderRadius={"16px"}
        css={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.80) 100%), #007AFF;",
        }}
        pos={"relative"}
        overflow={"hidden"}
      >
        <Flex
          borderRadius={"16px"}
          border={"3px solid #007AFF"}
          h="64px"
          w="336px"
          flexDir={"column"}
        >
          <TopLine />
          <Flex
            p="13px 16px 16px 13px"
            justifyContent={"space-between"}
            zIndex={1001}
          >
            <Flex alignItems={"center"}>
              <Image
                height={32}
                width={32}
                src={MetamaskIcon}
                alt={"MetamaskIcon"}
              />
              <Text
                fontSize={15}
                ml="8px"
                mr="4px"
                fontWeight={500}
                color={"#222"}
              >
                {trimAddress({ address: address, firstChar: 6 })}
              </Text>
              <Flex
                onClick={() => {
                  handleCopyToClipboard();
                }}
              >
                <Image
                  height={14}
                  width={14}
                  src={CopyIcon}
                  alt={"CopyIcon"}
                  style={{ cursor: "pointer" }}
                />
              </Flex>
            </Flex>
            <Flex columnGap={"8px"}>
              <Flex
                as={Link}
                href="https://tokamaknetwork.gitbook.io/home/02-service-guide/tokamak-bridge"
                target="_blank"
                cursor={"pointer"}
                w="32px"
                h="32px"
                bg="#5D6978"
                borderRadius={"8px"}
                justifyContent={"center"}
              >
                <Image src={userguide} alt="userguide" height={16} width={16} />
              </Flex>
              <Flex
                onClick={() => {
                  connetAndDisconntWallet();
                  setIsOpen(false);
                }}
                cursor={"pointer"}
                w="32px"
                h="32px"
                bg="#5D6978"
                borderRadius={"8px"}
                justifyContent={"center"}
              >
                <Image src={off} alt="off" height={16} width={16} />
              </Flex>
            </Flex>
          </Flex>
          {/* <Flex flexDir={"column"} pl="16px">
            <Text color={"#5D6978"} fontSize={"14px"} zIndex={1001}>
              Balance
            </Text>
            <Text
              color={"#222"}
              fontSize={"32px"}
              lineHeight={"normal"}
              zIndex={1001}
              mt="-3px"
              fontWeight={600}
            >
              $410.55
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
    );
  };

  const SearchComponent = () => {
    const [searchTxString, setSearchTxString] = useRecoilState(searchTxStatus);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value === "") {
        return setSearchTxString(null);
      } else {
        return setSearchTxString({ id: value });
      }
    };
    return (
      <Flex
        ml="8px"
        w="100%"
        h={"40px"}
        bgColor={"#15161D"}
        borderRadius={"6px"}
      >
        <InputGroup>
          <Input
            pl="20px"
            _active={{}}
            _hover={{}}
            _focus={{ boxShadow: "none !important" }}
            border={"none"}
            fontSize={14}
            fontWeight={500}
            onChange={onChange}
            placeholder={
              tab === "Balance" ? "Token contract address" : "Transaction ID"
            }
            _placeholder={{ color: "#8E8E92" }}
          ></Input>
          <InputRightElement mr={"6px"}>
            <Flex height={"20px"} width={"20px"}>
              <Image src={ICON_SEARCH} alt="ICON_SEARCH" />
            </Flex>
          </InputRightElement>
        </InputGroup>
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
          <SearchComponent />
        </Flex>
        <Flex mt="12px">
          {/* {tab === "Balance" ? (
            <BalanceContainer network={selectedNetwork} />
          ) : (
            <ActivityContainer network={selectedNetwork} />
          )} */}
          <ActivityContainer network={selectedNetwork} tData={props.tData}/>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
}
