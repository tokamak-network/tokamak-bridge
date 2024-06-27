import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import Refresh from "@/assets/icons/newHistory/refresh.svg";
import RefreshBlue from "@/assets/icons/newHistory/refresh-blue.svg";
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
import { confirmWithdrawStats } from "@/recoil/modal/atom";
import AccountHistoryNew from "@/staging/components/new-history/components/core";
import {
  selectedTab,
  selectedTransactionCategory,
} from "@/recoil/history/transaction";

export default function AccountHistory() {
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const [withdrawStatus] = useRecoilState(confirmWithdrawStats);
  const { address } = useAccount();
  const { mobileView } = useMediaView();
  const [_selectedTab, setSelectedTab] = useRecoilState(selectedTab);
  const [_selectedTransactionCategory, setSelectedTransactionCategory] =
    useRecoilState(selectedTransactionCategory);

  useEffect(() => {
    if (address === undefined) {
      setIsOpen(false);
    }
  }, [address]);

  const subCategoryButtons = useMemo(() => {
    if (_selectedTab === "CorssTrade") return null;
    const isDeposit = _selectedTransactionCategory === "Deposit";
    return (
      <Flex mt={"16px"} mb={"12px"} columnGap={"8px"}>
        <Button
          w={"74px"}
          h={"32px"}
          textAlign={"center"}
          fontSize={13}
          fontWeight={400}
          color={isDeposit ? "none" : "#A0A3AD"}
          bg={isDeposit ? "#007AFF" : "none"}
          border={isDeposit ? "none" : "1px solid #313442"}
          lineHeight={"32px"}
          _hover={{}}
          _active={{}}
          onClick={() => setSelectedTransactionCategory("Deposit")}
        >
          Deposit
        </Button>
        <Button
          w={"87px"}
          h={"32px"}
          textAlign={"center"}
          fontSize={13}
          fontWeight={400}
          color={!isDeposit ? "none" : "#A0A3AD"}
          bg={!isDeposit ? "#007AFF" : "none"}
          border={!isDeposit ? "none" : "1px solid #313442"}
          lineHeight={"32px"}
          _hover={{}}
          _active={{}}
          onClick={() => setSelectedTransactionCategory("Withdraw")}
        >
          Withdraw
        </Button>
      </Flex>
    );
  }, [_selectedTab, _selectedTransactionCategory]);

  return (
    <Drawer
      isOpen={isOpen && address !== undefined}
      placement="right"
      onClose={() => {
        setIsOpen(false);
      }}
      variant="clickThrough"
      trapFocus={false}
      useInert={true}
    >
      <DrawerOverlay
        bg={{ base: "#000000F0", lg: "none" }}
        onClick={() => (mobileView ? setIsOpen(false) : "")}
      />

      {mobileView && !withdrawStatus.isOpen && (
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
      >
        <Flex direction="column" height="100%" overflow="hidden">
          {!mobileView && <AccountContainer />}
          <Flex
            w={"336px"}
            h={"40px"}
            alignItems={"center"}
            justifyContent={"center"}
            mt={"16px"}
          >
            <Box
              w={"50%"}
              textAlign={"center"}
              fontSize={14}
              fontWeight={600}
              py={"10px"}
              cursor={"pointer"}
              color={
                _selectedTab === "OfficialStandard" ? "#007AFF" : "#565B72"
              }
              borderBottom={
                _selectedTab === "OfficialStandard"
                  ? "1px solid #007AFF"
                  : "1px solid #1F2128"
              }
              onClick={() => setSelectedTab("OfficialStandard")}
            >
              Official Standard
            </Box>
            <Box
              w={"50%"}
              textAlign={"center"}
              fontSize={14}
              fontWeight={600}
              py={"10px"}
              cursor={"pointer"}
              color={_selectedTab === "CorssTrade" ? "#007AFF" : "#565B72"}
              borderBottom={
                _selectedTab === "CorssTrade"
                  ? "1px solid #007AFF"
                  : "1px solid #1F2128"
              }
              onClick={() => setSelectedTab("CorssTrade")}
            >
              Cross Trade
            </Box>
          </Flex>
          {subCategoryButtons}
          <Flex mt={{ base: "0px", lg: "12px" }} flex="1" overflow="hidden">
            <Box
              flex="1"
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#343741",
                  borderRadius: "3px",
                },
              }}
              mr="-6px"
            >
              <AccountHistoryNew />
            </Box>
          </Flex>
        </Flex>

        {/**
         * Drawer Footer
         */}
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
