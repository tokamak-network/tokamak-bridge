"use client";

import {
  SupportedChainId,
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { Flex, Box, Text } from "@chakra-ui/layout";
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
import { useGetMode } from "@/hooks/mode/useGetMode";
import { useInOutTokens } from "@/hooks/token/useInOutTokens";

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
      marginTop: "4px",
      background: "#1F2128",
      minWidth: `${maxWidth} !important`,
      maxWidth: `${maxWidth} !important`,
      borderRadius: "6px",
      position: "absolute",
      border: "1px solid #313442",
      padding: "8px",
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

  if (selectedOption) {
    return (
      <Flex
        w={"100%"}
        h={"100%"}
        color={"#fff"}
        px={"8px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={isPool ? 18 : 14}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex columnGap={"6px"} className="test">
          <Box w={isPool ? "28px" : "20px"} h={isPool ? "28px" : "20px"}>
            <Image
              src={selectedOption.networkImage}
              alt={selectedOption.chainName}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
          <Text>{convertNetworkName(selectedOption.label)}</Text>
        </Flex>
        <Box w={isPool ? "20px" : "10px"} h={isPool ? "20px" : "10px"}>
          <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
        </Box>
      </Flex>
    );
  }
  return (
    <Flex
      w={"100%"}
      h={"100%"}
      color={"#fff"}
      px={"8px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      fontSize={isPool ? 18 : 14}
      onClick={() => setIsOpen(true)}
    >
      <Flex columnGap={"6px"}>
        <Box w={isPool ? "28px" : "20px"} h={isPool ? "28px" : "20px"}>
          <Image
            src={NetworkCircle}
            alt={"NetworkCircle"}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
        <Text>Select Network</Text>
      </Flex>
      <Box w={"10px"} h={"10px"}>
        <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
      </Box>
    </Flex>
  );
};

export default function NetworkDropdown(props: {
  inNetwork: boolean;
  height: string;
  width: string;
  isPool?: boolean;
}) {
  const { inNetwork, height, width, isPool } = props;
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { connectedChainId, isConnectedToMainNetwork } = useConnectedNetwork();
  const { switchNetworkAsync, isError, switchNetwork } = useSwitchNetwork();
  const { isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { subMode } = useGetMode();
  const { initializeTokenPair } = useInOutTokens();

  const onChange = async (data: SupportedChainProperties) => {
    try {
      const value: SupportedChainProperties["chainId"] = Number(data.chainId);
      const selectedWork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === value;
      })[0];

      if (inNetwork === false) {
        return setNetwork({ ...network, outNetwork: selectedWork });
      }
      if (selectedWork.chainId !== connectedChainId) {
        const res = isConnected
          ? await switchNetworkAsync?.(selectedWork.chainId)
          : setNetwork({ ...network, inNetwork: selectedWork });
        if (res && res.id === selectedWork.chainId && isPool && subMode.add) {
          initializeTokenPair();
        }
      }
    } finally {
      setIsOpen(false);
      if (isError) {
        console.error(`Couldn't switch network`);
        console.log(isError);
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
      if (inNetwork && network?.inNetwork?.chainId) {
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
        <Flex flexDir={"column"} rowGap={"12px"} mt={"4px"}>
          {data.isTOP && (
            <Flex
              w={"100%"}
              h={isPool ? "16px" : "12px"}
              alignItems={"center"}
              justifyContent={"space-around"}
              color={"#757893"}
            >
              <Box w={isPool ? "100%" : "45px"} h={"1px"} bgColor={"#757893"} />
              <Text
                minW={isPool ? "60px" : "76px"}
                fontSize={isPool ? 16 : 12}
                mx={isPool ? "40px" : 0}
                textAlign={"center"}
              >
                Layer 2
              </Text>
              <Box w={isPool ? "100%" : "45px"} h={"1px"} bgColor={"#757893"} />
            </Flex>
          )}
          <Flex
            w={"100%"}
            h={isPool ? "48px" : "100%"}
            color={"#fff"}
            px={"8px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            fontSize={isPool ? 18 : 14}
            cursor={"pointer"}
            bgColor={"#1F2128"}
            _hover={{ bgColor: "#313442" }}
            onClick={() => onChange(data)}
          >
            <Flex columnGap={"6px"}>
              <Box w={isPool ? "28px" : "20px"} h={isPool ? "28px" : "20px"}>
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
        h={isPool ? "48px" : "100%"}
        color={"#fff"}
        px={"8px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={isPool ? 18 : 14}
        cursor={"pointer"}
        bgColor={"#1F2128"}
        _hover={{ bgColor: "#313442" }}
        onClick={() => onChange(data)}
        borderRadius={"6px"}
      >
        <Flex columnGap={"6px"}>
          <Box w={isPool ? "28px" : "20px"} h={isPool ? "28px" : "20px"}>
            <Image
              src={data.networkImage}
              alt={data.chainName}
              style={{
                width: isPool ? "28px" : "20px",
                height: isPool ? "28px" : "20px",
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

  return (
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
              selectedOption={inNetwork ? selectedOption : selectedOutOption}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              isPool={isPool}
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
        styles={customStyles(height, width)}
        value={inNetwork ? selectedOption : selectedOutOption}
      ></Select>
    </Box>
  );
}
