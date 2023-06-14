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
import Select, { Props as SelectProps } from "react-select";
import AccoridonArrowImg from "assets/icons/accordionArrow.svg";
import NetworkCircle from "assets/icons/networkCircle.svg";
import { Overlay_Index } from "@/types/style/overlayIndex";

type SelectOption = SupportedChainProperties & {
  value: SupportedChainProperties["chainId"];
  label: SupportedChainProperties["chainName"];
};

export default function NetworkDropdown(props: {
  inNetwork: boolean;
  width?: string;
  height?: string;
  innerWidth?: string;
}) {
  const { inNetwork, width, height, innerWidth } = props;
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { connectedChainId } = useConnectedNetwork();
  const { switchNetworkAsync, isError } = useSwitchNetwork();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  //for react-select from this line
  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );
  const selectRef = useRef(null);

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      width: width ? width : "200px",
      maxHeight: height ? `${height} !important` : "32px !important",
      minHeight: height ? `${height} !important` : "32px !important",
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
      minWidth: innerWidth ? `${innerWidth} !important` : "216px !important",
      maxWidth: innerWidth ? `${innerWidth}  !important` : "216px !important",
      borderRadius: "6px",
      position: "absolute",
      border: "1px solid #313442",
      padding: "8px",
      zIndex: Overlay_Index.AlwaysTop,
    }),
  };

  const optionsList = supportedChain.map((chainInfo) => {
    return {
      ...chainInfo,
      value: chainInfo.chainId,
      label: chainInfo.chainName,
    };
  });

  const ValueContainer = (props: {
    selectedOption: SelectOption | null;
    isOpen: boolean;
    setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  }) => {
    const { selectedOption, isOpen, setIsOpen } = props;

    if (selectedOption) {
      return (
        <Flex
          w={innerWidth ? innerWidth : "200px"}
          h={height ? height : "32px"}
          color={"#fff"}
          px={"8px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          fontSize={14}
          onClick={() => setIsOpen(!isOpen)}
        >
          <Flex columnGap={"6px"}>
            <Box w={"20px"} h={"20px"}>
              <Image
                src={selectedOption.networkImage}
                alt={selectedOption.chainName}
              />
            </Box>
            <Text>{selectedOption.label}</Text>
          </Flex>
          <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
        </Flex>
      );
    }
    return (
      <Flex
        w={innerWidth ? innerWidth : "200px"}
        h={height ? height : "32px"}
        color={"#fff"}
        px={"8px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={14}
        onClick={() => setIsOpen(true)}
      >
        <Flex columnGap={"6px"}>
          <Box w={"20px"} h={"20px"}>
            <Image src={NetworkCircle} alt={"NetworkCircle"} />
          </Box>
          <Text>Select Network</Text>
        </Flex>
        <Box w={"10px"} h={"10px"}>
          <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} />
        </Box>
      </Flex>
    );
  };

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
        return await switchNetworkAsync?.(selectedWork.chainId);
      }
    } finally {
      setIsOpen(false);

      if (isError) {
        console.error(`Can't get to switch a network`);
      }
    }
  };

  useEffect(() => {
    if (connectedChainId) {
      const connectedNetwork = supportedChain.filter((supportedChain) => {
        return supportedChain.chainId === connectedChainId;
      })[0];

      setSelectedOption({
        ...connectedNetwork,
        value: connectedNetwork.chainId,
        label: connectedNetwork.chainName,
      });

      return setNetwork({ ...network, inNetwork: connectedNetwork });
    }
  }, [connectedChainId]);

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

  const CustomOption = (props: { data: SelectOption }) => {
    const { data } = props;

    if (data.chainName === "TOKAMAK_MAINNET") {
      return (
        <Flex flexDir={"column"} rowGap={"12px"} mt={"4px"}>
          <Flex
            w={innerWidth ? innerWidth : "200px"}
            h={height ? "0px" : "32px"}
            alignItems={"center"}
            justifyContent={"space-around"}
            color={"#757893"}
          >
            <Box w={"49px"} h={"1px"} bgColor={"#757893"} />
            <Text fontSize={12}>Layer 2</Text>
            <Box w={"49px"} h={"1px"} bgColor={"#757893"} />
          </Flex>
          <Flex
            // w={width ? width : "200px"}
            // h={height ? height : "32px"}
            w="392px"
            h="48px"
            color={"#fff"}
            px={"8px"}
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
                <Image src={data.networkImage} alt={data.chainName} />
              </Box>
              <Text>{data.label}</Text>
            </Flex>
            <Box w={"10px"} h={"10px"}>
              {/* <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} /> */}
            </Box>
          </Flex>
        </Flex>
      );
    }

    return (
      <Flex
        w={width ? "384px" : "200px"}
        h={height ? height : "32px"}
        color={"#fff"}
        px={"8px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        fontSize={14}
        cursor={"pointer"}
        bgColor={"#1F2128"}
        borderRadius="6px"
        _hover={{ bgColor: "#313442" }}
        onClick={() => onChange(data)}
      >
        <Flex columnGap={"6px"}>
          <Box w={"20px"} h={"20px"}>
            <Image src={data.networkImage} alt={data.chainName} />
          </Box>
          <Text>{data.label}</Text>
        </Flex>
        <Box w={"10px"} h={"10px"}>
          {/* <Image src={AccoridonArrowImg} alt={"AccoridonArrowImg"} /> */}
        </Box>
      </Flex>
    );
  };

  return (
    <Select
      ref={selectRef}
      options={optionsList}
      menuIsOpen={isOpen}
      onMenuOpen={() => setIsOpen(true)}
      onMenuClose={() => {
        setIsOpen(false);
      }}
      components={{
        Option: CustomOption,
        ValueContainer: () => (
          <ValueContainer
            selectedOption={inNetwork ? selectedOption : selectedOutOption}
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
      styles={customStyles}
      value={inNetwork ? selectedOption : selectedOutOption}
    ></Select>
  );

  // return (
  //   <Select
  //     w={"200px"}
  //     h={"32px"}
  //     bgColor={"#1f2128"}
  //     _first={{ alignItems: "end" }}
  //     onChange={onChange}
  //     value={
  //       inNetwork ? network.inNetwork?.chainId : network.outNetwork?.chainId
  //     }
  //     defaultValue={connectedChainId}
  //   >
  //     {supportedChain.map((chainInfo) => {
  //       return (
  //         <option
  //           style={{ backgroundColor: "#1f2128" }}
  //           value={chainInfo.chainId}
  //           key={chainInfo.chainId}
  //         >
  //           {/* <Flex>
  //             {chainInfo.chainName}
  //             <Image src={chainInfo.networkImage} alt={chainInfo.chainName} />
  //           </Flex> */}
  //           <Box display="flex" alignItems="center">
  //             <Image
  //               src={chainInfo.networkImage}
  //               alt={chainInfo.chainName}
  //               // boxSize="20px"
  //               // marginRight="4px"
  //             />
  //             <Text>{chainInfo.chainName}</Text>
  //           </Box>
  //         </option>
  //       );
  //     })}
  //   </Select>
  // );
}
