import ImageSymbol, { TokenSymbol } from "@/components/image/TokenSymbol";
import { NetworkSymbol } from "../image/NetworkSymbol";
import WARNING_ICON from "assets/icons/pool/unsupportedNetworkWarning.svg";
import { capitalizeFirstChar } from "@/utils/trim/capitalizeChar";

import {
  SupportedChainId,
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { Center, Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import useConnectedNetwork from "@/hooks/network";
import { useAccount, useSwitchNetwork } from "wagmi";
import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import NetworkCircle from "assets/icons/networkCircle.svg";
import { Overlay_Index } from "@/types/style/overlayIndex";
import { convertNetworkName } from "@/utils/network/convertNetworkName";

type SelectOption = SupportedChainProperties & {
  value: SupportedChainProperties["chainId"];
  label: SupportedChainProperties["chainName"];
};

const customStyles = (maxHeight: string, maxWidth: string) => {
  return {
    control: (styles: any) => ({
      ...styles,
      width: "100%",
      maxHeight: `${maxHeight} !important`,
      minHeight: `${maxHeight} !important`,
      backgroundColor: "#1F2128",
      cursor: "pointer",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
    }),
    menu: (styles: any) => ({
      margin: "0px",
      marginTop: "6px",
      background: "#1F2128",
      minWidth: `${maxWidth} !important`,
      maxWidth: `${maxWidth} !important`,
      borderRadius: "6px",
      position: "absolute",
      // border: "1px solid #313442",
      padding: "8px",
      right: "0px",
      zIndex: Overlay_Index.AlwaysTop,
    }),
  };
};

const ValueContainer = (props: {
  selectedOption: SelectOption | null;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  isPool?: boolean;
}) => {
  const { selectedOption, isOpen, setIsOpen, isPool } = props;
  const { connectedChainId, isConnectedToMainNetwork } = useConnectedNetwork();
  const { isConnected } = useAccount();
  if (selectedOption) {
    return (
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={isPool ? 18 : 14}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Center
          className="header-right-common"
          minW={"48px"}
          h={"48px"}
          columnGap={"8px"}
          px={isConnectedToMainNetwork ? "8px" : "12px"}
          _hover={{ bg: "#313442" }}
        >
          <Image
            src={selectedOption.networkImage}
            alt={selectedOption.chainName}
            style={{
              width: "24px",
              height: "24px",
            }}
          />
          {isConnected && !isConnectedToMainNetwork && (
            <Text>{capitalizeFirstChar(selectedOption.chainName)}</Text>
          )}
        </Center>
      </Flex>
    );
  }
  return (
    <Flex
      justifyContent={"space-between"}
      alignItems={"center"}
      fontSize={isPool ? 18 : 14}
      onClick={() => setIsOpen(true)}
    >
      <Center
        className="header-right-common"
        w={"48px"}
        h={"48px"}
        _hover={{ bg: "#313442" }}
      >
        <NetworkSymbol
          network={connectedChainId ?? 1}
          w={24}
          h={24}
          isCircle={true}
        />
      </Center>
    </Flex>
  );
};

export default function Network() {
  // const { inNetwork, height, width, isPool } = props;
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { switchNetworkAsync, isError, switchNetwork } = useSwitchNetwork();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    connectedChainId,
    isConnectedToMainNetwork,
    chainName,
    isSupportedChain,
  } = useConnectedNetwork();
  const { isConnected } = useAccount();

  // const inNetwork = true;
  const onChange = async (data: SupportedChainProperties) => {
    try {
      const value: SupportedChainProperties["chainId"] = Number(data.chainId);
      const selectedWork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === value;
      })[0];
      if (selectedWork.chainId !== connectedChainId) {
        return isConnected
          ? switchNetwork?.(selectedWork.chainId)
          : setNetwork({ ...network, inNetwork: selectedWork });
      }
    } finally {
      setIsOpen(false);

      if (isError) {
        console.error(`Couldn't switch network`);
      }
    }
  };

  //connected to the wallet
  useEffect(() => {
    if (connectedChainId) {
      const connectedNetwork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === connectedChainId;
      })[0];

      if (connectedNetwork) {
        setSelectedOption({
          ...connectedNetwork,
          value: connectedNetwork.chainId,
          label: connectedNetwork.chainName,
        });
        return setNetwork({ ...network, inNetwork: connectedNetwork });
      }
    }
  }, [connectedChainId]);

  //not connected to the wallet
  useEffect(() => {
    if (isConnected === false) {
      if (network?.inNetwork?.chainId) {
        const connectedNetwork = supportedChain.filter((supportedChain) => {
          return supportedChain.chainId === network?.inNetwork?.chainId;
        })[0];

        setSelectedOption({
          ...connectedNetwork,
          value: connectedNetwork.chainId,
          label: connectedNetwork.chainName,
        });
      }
    }
  }, [isConnected, network]);

  //for react-select from this line
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );

  const selectedOutOption = useMemo(() => {
    if (network && network?.outNetwork) {
      const { outNetwork } = network;
      return {
        ...outNetwork,
        value: outNetwork.chainId,
        label: outNetwork.chainName,
      };
    }
    return null;
  }, [network]);

  const wrapperRef = useRef(null);

  //close when click at outside
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

  const CustomOption = (props: { data: SelectOption }) => {
    const { data } = props;

    if (data.layer === "L2") {
      return (
        <Flex flexDir={"column"} rowGap={"12px"}>
          {data.isTOP && (
            <Flex
              w={"100%"}
              h={"12px"}
              alignItems={"center"}
              justifyContent={"space-around"}
              color={"#757893"}
            >
              <Box w={"45px"} h={"1px"} bgColor={"#757893"} />
              <Text minW={"76px"} fontSize={12} mx={0} textAlign={"center"}>
                Layer 2
              </Text>
              <Box w={"45px"} h={"1px"} bgColor={"#757893"} />
            </Flex>
          )}
          <Flex
            w={"100%"}
            h={"32px"}
            color={"#fff"}
            px={"8px"}
            borderRadius={"6px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            fontSize={14}
            cursor={"pointer"}
            bgColor={"#1F2128"}
            _hover={{ bgColor: "#313442" }}
            onClick={() => onChange(data)}
          >
            <Flex columnGap={"6px"}>
              <Box w={"20px"} h={"20px"}>
                <Image
                  src={data.networkImage}
                  alt={data.chainName}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
              <Text>{convertNetworkName(data.label)}</Text>
            </Flex>
            {/* <Box w={"10px"} h={"10px"}>
              <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
            </Box> */}
          </Flex>
        </Flex>
      );
    }

    return (
      <Flex
        w={"100%"}
        h={"32px"}
        color={"#fff"}
        px={"8px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={14}
        cursor={"pointer"}
        bgColor={"#1F2128"}
        _hover={{ bgColor: "#313442" }}
        onClick={() => onChange(data)}
        borderRadius={"6px"}
      >
        <Flex columnGap={"6px"}>
          <Box w={"20px"} h={"20px"}>
            <Image
              src={data.networkImage}
              alt={data.chainName}
              style={{
                width: "20px",
                height: "20px",
              }}
            />
          </Box>
          <Text>{convertNetworkName(data.label)}</Text>
        </Flex>
        {/* <Box w={"10px"} h={"10px"}>
          <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
        </Box> */}
      </Flex>
    );
  };

  const optionsList = supportedChain
    .filter((chainInfo) => {
      if (
        isConnectedToMainNetwork === true ||
        isConnectedToMainNetwork === undefined
      ) {
        return [
          SupportedChainId["MAINNET"],
          SupportedChainId["TITAN"],
        ].includes(chainInfo.chainId);
      }
      return [
        SupportedChainId["SEPOLIA"],
        SupportedChainId["THANOS_SEPOLIA"],
        SupportedChainId["TITAN_SEPOLIA"],
      ].includes(chainInfo.chainId);
    })
    .map((chainInfo) => {
      return {
        ...chainInfo,
        value: chainInfo.chainId,
        label: chainInfo.chainName,
      };
    });

  if (isConnected && !isSupportedChain) {
    return (
      <Flex
        bgColor={"#1F2128"}
        w={"48px"}
        h={"48px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        px={"8px"}
        borderRadius={"8px"}
      >
        <Image
          src={WARNING_ICON}
          alt={"WARNING_ICON"}
          style={{ width: "34px", height: "34px" }}
        />
      </Flex>
    );
  }

  return (
    // <Center className="header-right-common" w={"48px"} h={"48px"} _hover={{bg:'#313442'}}>
    //   <NetworkSymbol
    //     network={connectedChainId ?? 1}
    //     w={24}
    //     h={24}
    //     isCircle={true}
    //   />
    // </Center>
    <Box ref={wrapperRef}>
      <Select
        options={optionsList}
        menuIsOpen={isOpen}
        // onMenuOpen={() => {}}
        // onMenuClose={() => {}}
        // onMenuClose={() => {}}
        components={{
          Option: CustomOption,
          ValueContainer: () => (
            <ValueContainer
              selectedOption={selectedOption}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          ),
          MenuList: (e) => (
            <Flex flexDir={"column"} rowGap={"8px"}>
              {e.children}
            </Flex>
          ),
          IndicatorsContainer: () => null,
        }}
        //@ts-ignore
        styles={customStyles("48px", "179px")}
        value={selectedOption}
      ></Select>
    </Box>
  );
}
