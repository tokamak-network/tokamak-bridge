"use client";

import {
  SupportedChainId,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { Flex, Box, Text } from "@chakra-ui/layout";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import useConnectedNetwork from "@/hooks/network";
import { useAccount, useSwitchNetwork } from "wagmi";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  SetStateAction,
  Dispatch,
} from "react";
import Select from "react-select";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import { Overlay_Index } from "@/types/style/overlayIndex";
import { convertNetworkName } from "@/utils/network/convertNetworkName";

type ChainName = "MAINNET" | "TITAN" | undefined;

type SelectOption = {
  chainId: number;
  chainName: ChainName;
  networkImage: any;
};

const customStyles = (maxHeight: string) => {
  const { isConnectedToMainNetwork } = useConnectedNetwork();

  return {
    control: (styles: any) => ({
      ...styles,
      width: "100%",
      maxHeight: `${maxHeight} !important`,
      minHeight: `${maxHeight} !important`,
      backgroundColor: "#15161D",
      cursor: "pointer",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
    }),
    menu: (styles: any) => ({
      margin: "0px",
      marginTop: "4px",
      background: "#1F2128",
      minWidth: isConnectedToMainNetwork
        ? "136px !important"
        : "156px !important",
      maxWidth: isConnectedToMainNetwork
        ? "136px !important"
        : "156px !important",
      borderRadius: "6px",
      position: "absolute",
      border: "1px solid #313442",
      padding: "8px",
      zIndex: Overlay_Index.AlwaysTop,
    }),
  };
};

const ValueContainer = (props: {
  selectedOption: SelectOption;
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { selectedOption, isOpen, setIsOpen } = props;

  if (selectedOption.chainId !== 0) {
    return (
      <Flex
        w={"60px"}
        h={"100%"}
        color={"#fff"}
        px={"8px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={14}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Flex columnGap={"6px"} className="test">
          <Box w={"20px"} h={"20px"}>
            <Image
              src={selectedOption.networkImage}
              alt={selectedOption.chainName ? selectedOption.chainName : "all"}
            />
          </Box>
        </Flex>
        <Box w={"10px"} h={"10px"} ml="8px">
          <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
        </Box>
      </Flex>
    );
  }
  return (
    <Flex
      w={"60px"}
      h={"100%"}
      color={"#fff"}
      px={"8px"}
      justifyContent={"space-between"}
      alignItems={"center"}
      fontSize={14}
      onClick={() => setIsOpen(true)}
    >
      <Flex columnGap={"6px"}>
        <Text>All</Text>
      </Flex>
      <Box w={"10px"} h={"10px"} ml="8px">
        <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
      </Box>
    </Flex>
  );
};

export default function NetworkSelector(props: {
  setNetwork: Dispatch<SetStateAction<SelectOption>>;
}) {
  const { setNetwork } = props;
  const { isConnectedToMainNetwork } = useConnectedNetwork();
  const { isError } = useSwitchNetwork();
  const [selectedOption, setSelectedOption] = useState<SelectOption>({
    chainId: 0,
    chainName: undefined,
    networkImage: undefined,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onChange = async (data: SelectOption) => {
    try {
      setSelectedOption(data);
      setNetwork(data);
      //   const value: SupportedChainProperties["chainId"] = Number(data.chainId);
      //   const selectedWork = supportedChain.filter((supportedChain) => {
      //     return supportedChain.chainId === value;
      //   })[0];
    } finally {
      setIsOpen(false);

      if (isError) {
        console.error(`Can't get to switch a network`);
      }
    }
  };

  //for react-select from this line

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

    if (data.chainId === 0) {
      return (
        <Flex flexDir={"column"} rowGap={"12px"} mt={"4px"}>
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
            _hover={{ bgColor: "#313442", borderRadius: "8px" }}
            onClick={() => onChange(data)}
          >
            <Flex columnGap={"6px"}>
              <Text>All</Text>
            </Flex>
          </Flex>
        </Flex>
      );
    }
    return (
      <Flex flexDir={"column"} rowGap={"12px"} mt={"4px"}>
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
          _hover={{ bgColor: "#313442", borderRadius: "8px" }}
          onClick={() => onChange(data)}
        >
          <Flex columnGap={"6px"}>
            <Box w={"20px"} h={"20px"}>
              <Image
                src={data.networkImage}
                alt={data.chainName ? data.chainName : "all"}
              />
            </Box>
            <Text>{convertNetworkName(data.chainName)}</Text>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  const optionsList = supportedChain
    .filter((chainInfo) => {
      if (
        // isConnectedToMainNetwork === true ||
        // isConnectedToMainNetwork === undefined
        true
      ) {
        return [
          SupportedChainId["MAINNET"],
          SupportedChainId["TITAN"],
        ].includes(chainInfo.chainId);
      }
      // return [SupportedChainId["GOERLI"], SupportedChainId["DARIUS"]].includes(
      //   chainInfo.chainId
      // );
    })
    .map((chainInfo) => {
      return {
        chainId: chainInfo.chainId as number,
        chainName: chainInfo.chainName as ChainName,
        networkImage: chainInfo.networkImage as any,
      };
    });

  const all: SelectOption[] = [
    {
      chainId: 0,
      chainName: undefined,
      networkImage: undefined,
    },
  ];

  return (
    <Box ref={wrapperRef}>
      <Select
        options={all.concat(optionsList)}
        menuIsOpen={isOpen}
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
        styles={customStyles("40px")}
        value={selectedOption}
      ></Select>
    </Box>
  );
}
