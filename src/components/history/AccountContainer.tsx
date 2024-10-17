import { Box, Flex, useToast, Text, Link } from "@chakra-ui/react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { trimAddress } from "@/utils/trim";
import MetamaskIcon from "assets/icons/metamaskAccount.svg";
import userguide from "assets/icons/header/userGuide.svg";
import off from "assets/icons/header/off.svg";
import useConnectWallet from "@/hooks/account/useConnectWallet";
import CopyIcon from "assets/icons/accountHistory/copy.png";
import copy from "copy-to-clipboard";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";

export default function AccountContainer() {
  const toast = useToast();
  const { connetAndDisconntWallet } = useConnectWallet();
  const [, setIsOpen] = useRecoilState(accountDrawerStatus);
  const { address } = useAccount();

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
  const handleCopyToClipboard = () => {
    copy(address !== undefined ? address : "");

    toast({
      title: "Copied to Clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <Flex mt={"12px"}>
      <Flex
        opacity={0.85}
        borderRadius={"16px"}
        css={{
          background:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), linear-gradient(0deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.80) 100%), #007AFF;",
        }}
        pos={"relative"}
        overflow={"hidden"}
        w={"100%"}
      >
        <Flex
          borderRadius={"16px"}
          border={"3px solid #007AFF"}
          h="64px"
          w={{ base: "100%", lg: "336px" }}
          flexDir={"column"}
        >
          <TopLine />
          <Flex
            p="13px 16px 16px 13px"
            justifyContent={"space-between"}
            zIndex={1001}
            w={"100%"}
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
                href="https://docs.tokamak.network/home/02-service-guide/tokamak-bridge/wallet"
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
    </Flex>
  );
}
