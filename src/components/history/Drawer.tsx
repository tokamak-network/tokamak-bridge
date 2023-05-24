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

const AccountComponent = () => {
  const { address } = useAccount();
  return (
    <Flex
      justifyContent={"space-between"}
      w={"632px"}
      h={"64px"}
      bg={
        "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(0deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), #007AFF;"
      }
      border={"3px solid #007AFF"}
      borderRadius={"16px"}
      px={"24px"}
    >
      <Flex alignItems={"center"} columnGap={"8px"}>
        <Image src={MetamaskIcon} alt={"MetamaskIcon"} />
        <Text fontSize={16} fontWeight={500} color={"#1f2128"}>
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
  status: "Completed" | "Failed" | "Pending";
  timeStamp: number;
  type: "swap" | "wrap" | "unwrap" | "deposit" | "withdraw";
  token: {
    tokenInfo: TokenInfo;
    amount: bigint;
    otherTokenInfo?: TokenInfo;
    otherAmount?: bigint;
  };
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
  const { status } = props;

  const statusColor = useMemo(() => {
    switch (status) {
      case "Failed":
        return "#DD3A44";
      case "Completed":
        return "#03D187";
      default:
        return "#8497DB";
    }
  }, [status]);

  return (
    <DetailWrapper
      style={{ minWidth: "107px", maxWidth: "107px", columnGap: "6px" }}
    >
      <Box
        w={"6px"}
        h={"6px"}
        bgColor={statusColor}
        borderRadius={"16px"}
      ></Box>
      <Text fontSize={11} fontWeight={600}>
        {status}
      </Text>
    </DetailWrapper>
  );
};

const Time = (props: TransactionDetailsProp) => {
  return (
    <DetailWrapper style={{ minWidth: "200px", maxWidth: "200px" }}>
      <Text>{props.timeStamp}</Text>
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
  const { token } = props;
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
        <TokenSymbol w={40} h={40} tokenType={token.tokenInfo["tokenName"]} />
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
      {token.otherTokenInfo && (
        <Flex
          flexDir={"column"}
          rowGap={"12px"}
          w={"92px"}
          alignItems={"center"}
        >
          <TokenSymbol w={40} h={40} tokenType={token.tokenInfo["tokenName"]} />
          <Text>
            {otherTokenAmount} {token.otherTokenInfo?.tokenName}
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
      type: "deposit",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Completed",
      type: "deposit",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Completed",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Pending",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
    {
      status: "Failed",
      type: "swap",
      token: {
        tokenInfo: supportedTokens[0],
        amount: BigInt("1123456780000000000"),
        otherTokenInfo: supportedTokens[1],
        otherAmount: BigInt("1123456780000000000"),
      },
      timeStamp: Date.now() / 1000,
    },
  ];
  return (
    <Flex overflowY={"scroll"}>
      <Flex fontSize={12} fontWeight={400} flexDir={"column"}>
        {dummyData.map((data) => {
          return (
            <Flex h={"92px"} borderBottom={"1px solid #2E313A"}>
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
      <Flex h={"42px"} bgColor={"#0F0F12"} borderRadius={"8px"}>
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
  return (
    <Drawer isOpen={true} placement="right" onClose={() => {}}>
      <DrawerOverlay zIndex={1001} className="modalOverlayDrawer" bg={"none"} />
      <DrawerContent
        pt={"24px"}
        px={"24px"}
        minW={"680px"}
        maxW={"680px"}
        bgColor={"#1F2128"}
        rowGap={"24px"}
      >
        <AccountComponent />
        <HistoryTable />
      </DrawerContent>
    </Drawer>
  );
}
