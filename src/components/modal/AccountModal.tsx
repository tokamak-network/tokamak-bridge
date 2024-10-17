import { Flex, useToast, Text } from "@chakra-ui/react";
import Image from "next/image";
import { accountDrawerStatus } from "@/recoil/modal/atom";
import { useRecoilState } from "recoil";
import { useAccount, useConnect } from "wagmi";
import { trimAddress } from "@/utils/trim";
import copyIcon from "assets/icons/header/copy.svg";
import off from "assets/icons/header/off.svg";
import offHover from "assets/icons/header/offHover.svg";
import { useState, useEffect, useRef } from "react";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import copy from "copy-to-clipboard";

export default function AccountModal() {
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  const { isConnected, address } = useAccount();
  const [ishover, setIshover] = useState(false);
  const { connetAndDisconntWallet } = useConnectWallet();
  const toast = useToast();

  const wrapperRef = useRef(null);

  const handleCopyToClipboard = () => {
    copy(address !== undefined ? address : "");

    toast({
      title: "Copied to Clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      //@ts-ignore
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Flex
      mt="4px"
      h="100px"
      w="165px"
      display={isOpen && isConnected ? "flex" : "none"}
      borderRadius={"8px"}
      border={"1px solid #313442"}
      flexDir={"column"}
      px="12px"
      py="16px"
      ref={wrapperRef}
    >
      <Flex
        w="141px"
        h="36px"
        borderRadius={"8px"}
        mb="16px"
        bg={"#1F2128"}
        _hover={{ bg: "#313442" }}
        px="12px"
        py="10px"
        justifyContent={"space-between"}
        alignItems={"center"}
        cursor={"pointer"}
        onClick={() => {
          handleCopyToClipboard();
          setIsOpen(false);
        }}
      >
        <Text fontSize={"16px"} fontWeight={"bold"} mr="8px">
          {trimAddress({ address })}
        </Text>
        <Flex>
          <Image src={copyIcon} alt="copyIcon" />
        </Flex>
      </Flex>
      <Flex
        width={"115px"}
        alignItems={"center"}
        height={"16px"}
        onMouseEnter={() => setIshover(true)}
        onMouseLeave={() => setIshover(false)}
        onClick={() => connetAndDisconntWallet()}
        cursor={"pointer"}
      >
        <Flex mr="8px">
          <Image src={ishover ? offHover : off} alt="officon" />
        </Flex>
        <Text fontSize={"16px"} color={ishover ? "#007AFF" : "#fff"}>
          Disconnect
        </Text>
      </Flex>
    </Flex>
  );
}
