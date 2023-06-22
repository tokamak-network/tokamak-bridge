import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Input,
  Text,
} from "@chakra-ui/react";
import MetamaskIcon from "assets/icons/metamaskAccount.svg";
import Image from "next/image";
import { useAccount } from "wagmi";
import CopyIcon from "assets/icons/copy-icon.svg";
import BookmarkIcon from "assets/icons/bookmark.svg";
import PowerIcon from "assets/icons/power.svg";
import { CSSProperties, useCallback, useMemo, useState } from "react";
import { TokenInfo, supportedTokens } from "@/types/token/supportedToken";
import { timeStamp } from "console";
import { TokenSymbol } from "../image/TokenSymbol";
import commafy from "@/utils/trim/commafy";
import { convertNumber } from "@/utils/trim/convertNumber";
import ArrowIcon from "assets/icons/arrow.svg";
import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { format, fromUnixTime } from "date-fns";
import DrawerCloseIcon from "assets/icons/drawerClose.svg";
import { useRecoilState } from "recoil";
import { accountDrawerStatus } from "@/recoil/modal/atom";

const AccountComponent = () => {
  const { address } = useAccount();
  return (
    <Flex
      justifyContent={"space-between"}
      w={"632px"}
      minH={"64px"}
      maxH={"64px"}
      bg={
        "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), #007AFF;"
      }
      border={"3px solid #007AFF"}
      borderRadius={"16px"}
      px={"24px"}
    >
      <Flex alignItems={"center"} columnGap={"8px"}>
        <Image src={MetamaskIcon} alt={"MetamaskIcon"} />
        <Text fontSize={15} fontWeight={500} color={"#1f2128"}>
          {address}
        </Text>
        <Image src={CopyIcon} alt={"CopyIcon"} style={{ cursor: "pointer" }} />
      </Flex>
      <Flex columnGap={"8px"}>
        <Image
          src={BookmarkIcon}
          alt={"CopyIcon"}
          style={{ cursor: "pointer" }}
        />
        <Image src={PowerIcon} alt={"CopyIcon"} style={{ cursor: "pointer" }} />
      </Flex>
    </Flex>
  );
};

type SelectedHistoryNetworks = "All" | "Ethereum" | "Tokamak Network";
export type TransactionDetailsProp = {
  status: "Completed" | "Failed";
  isPending?: boolean;
  timeStamp: number;
  pendingLeftTimeStamp?: number;
  type: "Swap" | "Wrap" | "Unwrap" | "Deposit" | "Withdraw";
  token: {
    tokenInfo: TokenInfo;
    amount: bigint;
    otherTokenInfo?: TokenInfo;
    otherAmount?: bigint;
  };
  inNetwork: SupportedChainProperties;
  outNetwork?: SupportedChainProperties;
};

const DetailWrapper = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <Flex h={"100%"} alignItems={"center"} style={style}>
      {children}
    </Flex>
  );
};

const Status = (props: TransactionDetailsProp) => {
  const { status, isPending } = props;

  const statusColor = useMemo(() => {
    switch (status) {
      case "Failed":
        return "#DD3A44";
      case "Completed":
        return "#03D187";
      default:
        return "";
    }
  }, [status]);

  return (
    <DetailWrapper style={{ minWidth: "107px", maxWidth: "107px" }}>
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        rowGap={"16px"}
        fontSize={11}
        fontWeight={600}
      >
        <Flex alignItems={"center"} columnGap={"6px"}>
          <Box
            w={"6px"}
            h={"6px"}
            bgColor={statusColor}
            borderRadius={"16px"}
          ></Box>
          <Text>{status}</Text>
        </Flex>
        {isPending && (
          <Flex alignItems={"center"} columnGap={"6px"}>
            <Box
              w={"6px"}
              h={"6px"}
              bgColor={"#8497DB"}
              borderRadius={"16px"}
            ></Box>
            <Text>{"Pending"}</Text>
          </Flex>
        )}
      </Flex>
    </DetailWrapper>
  );
};

const Time = (props: TransactionDetailsProp) => {
  const { timeStamp, isPending, pendingLeftTimeStamp } = props;
  const convertTimeStamp = (param: number) => {
    const formmatedDate = format(fromUnixTime(param), "yyyy.MM.dd/hh:mm b (z)");
    return {
      highlited: formmatedDate.split("/")[0],
      noHighlighted: formmatedDate.split("/")[1],
    };
  };
  const { highlited, noHighlighted } = convertTimeStamp(timeStamp);
  return (
    <DetailWrapper
      style={{
        minWidth: "200px",
        maxWidth: "200px",
        rowGap: "16px",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Flex alignItems={"center"} columnGap={"6px"}>
        <Text>{highlited}</Text>
        <Text color={"#A0A3AD"}>{noHighlighted}</Text>
      </Flex>
      {isPending && (
        <Flex alignItems={"center"} columnGap={"6px"}>
          <Text color={"#8497DB"}>{"3 Days 2 Hours Left"}</Text>
        </Flex>
      )}
    </DetailWrapper>
  );
};

const Type = (props: TransactionDetailsProp) => {
  const { status, type } = props;

  const statusColor = useMemo(() => {
    switch (status) {
      case "Failed":
        return "#DD3A44";
      default:
        return "#fff";
    }
  }, [status]);

  return (
    <DetailWrapper style={{ minWidth: "103px", maxWidth: "103px" }}>
      <Text color={statusColor}>{type} </Text>
    </DetailWrapper>
  );
};

const TokenSymbolImage = (props: TransactionDetailsProp) => {
  const { token, inNetwork, outNetwork } = props;
  const parsedAmount = convertNumber(token.amount, token.tokenInfo.decimals);
  const parsedOtherAmount =
    token.otherTokenInfo && token.otherAmount
      ? convertNumber(token.otherAmount, token.otherTokenInfo?.decimals)
      : null;

  const tokenAmount =
    String(parsedAmount).length > 9
      ? `${commafy(String(parsedAmount))}....`
      : commafy(String(parsedAmount));
  const otherTokenAmount =
    parsedOtherAmount && String(parsedOtherAmount).length > 9
      ? `${commafy(String(parsedOtherAmount))}....`
      : commafy(String(parsedOtherAmount));

  return (
    <DetailWrapper style={{ columnGap: "9.7px" }}>
      <Flex flexDir={"column"} rowGap={"12px"} w={"92px"} alignItems={"center"}>
        <Flex position={"relative"}>
          <TokenSymbol w={40} h={40} tokenType={token.tokenInfo["tokenName"]} />
          <Box
            w={"16px"}
            h={"16px"}
            pos={"absolute"}
            bgColor={inNetwork.nativeToken === "TON" ? "#fff" : "#383736"}
            borderRadius={"2px"}
            border={"2px solid #1F2128"}
            bottom={"-2px"}
            right={"-2px"}
          >
            <TokenSymbol tokenType={inNetwork.nativeToken} />
          </Box>
        </Flex>
        <Text>
          {tokenAmount} {token.tokenInfo.tokenName}
        </Text>
      </Flex>
      {token.otherTokenInfo && (
        <Image
          src={ArrowIcon}
          alt={"arrow"}
          style={{ width: "16px", height: "16px" }}
        />
      )}
      {token.otherTokenInfo && outNetwork && (
        <Flex
          flexDir={"column"}
          rowGap={"12px"}
          w={"92px"}
          alignItems={"center"}
        >
          <Flex position={"relative"}>
            <TokenSymbol
              w={40}
              h={40}
              tokenType={token.otherTokenInfo.tokenName}
            />
            <Box
              w={"16px"}
              h={"16px"}
              pos={"absolute"}
              bgColor={inNetwork.nativeToken === "TON" ? "#fff" : "#383736"}
              borderRadius={"2px"}
              border={"2px solid #1F2128"}
              bottom={"-2px"}
              right={"-2px"}
            >
              <TokenSymbol tokenType={outNetwork.nativeToken} />
            </Box>
          </Flex>
          <Text>
            {otherTokenAmount} {token.otherTokenInfo.tokenName}
          </Text>
        </Flex>
      )}
    </DetailWrapper>
  );
};

const TrasactionDetails = () => {
  const dummyData: TransactionDetailsProp[] = [
    {
      status: "Failed",
      type: "Deposit",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
      },
      timeStamp: 1684977021,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      isPending: true,
      type: "Withdraw",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
    {
      status: "Completed",
      type: "Swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
      inNetwork: supportedChain[0],
    },
  ];
  return (
    <Flex
      overflowY={"auto"}
      css={{
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "::-webkit-scrollbar-track": {
          background: "transparent",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#343741",
          borderRadius: "3px",
        },
      }}
    >
      <Flex fontSize={12} fontWeight={400} flexDir={"column"}>
        {dummyData.map((data) => {
          return (
            <Flex
              minH={"92px"}
              maxH={"92px"}
              borderBottom={"1px solid #2E313A"}
            >
              <Status {...data} />
              <Time {...data} />
              <Type {...data} />
              <TokenSymbolImage {...data} />
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

const HistoryTable = () => {
  const [selectedNetwork, setSelectedNetwork] =
    useState<SelectedHistoryNetworks>("All");

  const onClick = useCallback(
    (param: SelectedHistoryNetworks) => {
      setSelectedNetwork(param);
    },
    [selectedNetwork]
  );

  return (
    <Flex flexDir={"column"} overflow={"hidden"}>
      <Text fontSize={24} fontWeight={600} mb={"16px"}>
        Transactions
      </Text>
      <Flex
        h={"44px"}
        lineHeight={"44px"}
        verticalAlign={"center"}
        textAlign={"center"}
        cursor={"pointer"}
        borderBottom={"1px solid #2E313A"}
        mb={"12px"}
      >
        <Text
          w={"88px"}
          borderBottom={selectedNetwork === "All" ? "4px solid #2A72E5" : ""}
          onClick={() => onClick("All")}
        >
          ALL
        </Text>
        <Text
          w={"180px"}
          borderBottom={
            selectedNetwork === "Ethereum" ? "4px solid #2A72E5" : ""
          }
          onClick={() => onClick("Ethereum")}
        >
          Ethereum Mainnet
        </Text>
        <Text
          w={"178px"}
          borderBottom={
            selectedNetwork === "Tokamak Network" ? "4px solid #2A72E5" : ""
          }
          onClick={() => onClick("Tokamak Network")}
        >
          Tokamak Network
        </Text>
      </Flex>
      <Flex h={"42px"} bgColor={"#0F0F12"} borderRadius={"8px"} mr={"24px"}>
        <Input
          _active={{}}
          _hover={{}}
          _focus={{ boxShadow: "none !important" }}
          border={"none"}
          fontSize={14}
          fontWeight={500}
          placeholder="Search for a full or partial L1 tx ID"
          _placeholder={{ color: "#8E8E92" }}
        ></Input>
      </Flex>
      <Flex
        h={"32px"}
        mt={"12px"}
        fontSize={11}
        color={"#A0A3AD"}
        fontWeight={500}
        lineHeight={"32px"}
        verticalAlign={"center"}
        borderBottom={"1px solid #2E313A"}
      >
        <Text w={"107px"}>Status</Text>
        <Text w={"200px"}>Time</Text>
        <Text w={"103px"}>Type</Text>
        <Text w={"222px"}>Amount</Text>
      </Flex>
      <TrasactionDetails />
    </Flex>
  );
};

export default function HistoryDrawer() {
  const [isOpen, setIsOpen] = useRecoilState(accountDrawerStatus);
  
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={() => {}}>
      <DrawerOverlay zIndex={1001} className="modalOverlayDrawer" bg={"none"} />
      <DrawerContent
        pt={"24px"}
        pl={"24px"}
        minW={"680px"}
        maxW={"680px"}
        bgColor={"#1F2128"}
        rowGap={"24px"}
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

        <AccountComponent />
        <HistoryTable />
      </DrawerContent>
    </Drawer>
  );
}
