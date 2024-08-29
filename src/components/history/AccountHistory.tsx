import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  Box,
  Button,
} from "@chakra-ui/react";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useMemo, useEffect } from "react";
import DrawerCloseIcon from "assets/icons/accountHistory/drawerClose.svg";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import AccountContainer from "./AccountContainer";
import useMediaView from "@/hooks/mediaView/useMediaView";
import Account from "../header/Account";
import { confirmWithdrawStats } from "@/recoil/modal/atom";
import AccountHistoryNew from "@/staging/components/new-history/components/core";
import {
  selectedTab,
  selectedTransactionCategory,
} from "@/recoil/history/transaction";
import { Action, CT_ACTION, HISTORY_SORT } from "@/staging/types/transaction";
import { useHistoryTab } from "@/staging/hooks/useHistoryTab";

export default function AccountHistory() {
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const [withdrawStatus] = useRecoilState(confirmWithdrawStats);
  const { address } = useAccount();
  const { mobileView } = useMediaView();
  const [, setSelectedTab] = useRecoilState(selectedTab);
  const { isOnOfficialStandard, isOnCrossTrade } = useHistoryTab();
  const [_selectedTransactionCategory, setSelectedTransactionCategory] =
    useRecoilState(selectedTransactionCategory);

  useEffect(() => {
    if (address === undefined) {
      setIsOpen(false);
    }
  }, [address]);

  const subCategoryButtons = useMemo(() => {
    if (!isOnOfficialStandard) {
      const isRequest = _selectedTransactionCategory === CT_ACTION.REQUEST;
      return (
        <Flex mt={"16px"} mb={"12px"} columnGap={"8px"}>
          <Button
            w={"77px"}
            h={"32px"}
            textAlign={"center"}
            fontSize={13}
            fontWeight={400}
            color={isRequest ? "none" : "#A0A3AD"}
            bg={isRequest ? "#007AFF" : "#15161D"}
            border={isRequest ? "none" : "1px solid #313442"}
            lineHeight={"32px"}
            _hover={{}}
            _active={{}}
            onClick={() => setSelectedTransactionCategory(CT_ACTION.REQUEST)}
          >
            Request
          </Button>
          <Button
            w={"73px"}
            h={"32px"}
            textAlign={"center"}
            fontSize={13}
            fontWeight={400}
            color={!isRequest ? "none" : "#A0A3AD"}
            bg={!isRequest ? "#007AFF" : "#15161D"}
            border={!isRequest ? "none" : "1px solid #313442"}
            lineHeight={"32px"}
            _hover={{}}
            _active={{}}
            onClick={() => setSelectedTransactionCategory(CT_ACTION.PROVIDE)}
          >
            Provide
          </Button>
        </Flex>
      );
    }
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
          bg={isDeposit ? "#007AFF" : "#15161D"}
          border={isDeposit ? "none" : "1px solid #313442"}
          lineHeight={"32px"}
          _hover={{}}
          _active={{}}
          onClick={() => setSelectedTransactionCategory(Action.Deposit)}
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
          bg={!isDeposit ? "#007AFF" : "#15161D"}
          border={!isDeposit ? "none" : "1px solid #313442"}
          lineHeight={"32px"}
          _hover={{}}
          _active={{}}
          onClick={() => setSelectedTransactionCategory(Action.Withdraw)}
        >
          Withdraw
        </Button>
      </Flex>
    );
  }, [isOnOfficialStandard, _selectedTransactionCategory]);

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
              py={isOnOfficialStandard ? "9px" : "10px"}
              cursor={"pointer"}
              color={isOnOfficialStandard ? "#007AFF" : "#565B72"}
              borderBottomColor={isOnOfficialStandard ? "#007AFF" : "#313442"}
              borderBottomWidth={isOnOfficialStandard ? "2px" : "1px"}
              onClick={() => {
                setSelectedTransactionCategory(Action.Deposit);
                setSelectedTab(HISTORY_SORT.STANDARD);
              }}
            >
              Standard
            </Box>
            <Box
              w={"50%"}
              textAlign={"center"}
              fontSize={14}
              fontWeight={600}
              py={isOnCrossTrade ? "9px" : "10px"}
              cursor={"pointer"}
              color={isOnCrossTrade ? "#007AFF" : "#565B72"}
              borderBottomColor={isOnCrossTrade ? "#007AFF" : "#313442"}
              borderBottomWidth={isOnCrossTrade ? "2px" : "1px"}
              onClick={() => {
                setSelectedTransactionCategory(CT_ACTION.REQUEST);
                setSelectedTab(HISTORY_SORT.CROSS_TRADE);
              }}
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
