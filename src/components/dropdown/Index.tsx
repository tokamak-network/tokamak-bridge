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
import { useEffect, useState } from "react";
import Select from "react-select";

type SelectOption = SupportedChainProperties & {
  value: SupportedChainProperties["chainId"];
  label: SupportedChainProperties["chainName"];
};

export default function NetworkDropdown(props: { inNetwork: boolean }) {
  const { inNetwork } = props;
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { connectedChainId } = useConnectedNetwork();
  const { switchNetworkAsync, isError } = useSwitchNetwork();

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

  const CustomOption = (props: { data: SupportedChainProperties }) => {
    const { data } = props;
    return (
      <Flex
        w={"100%"}
        bgColor={"#1F2128"}
        cursor={"pointer"}
        _hover={{ bgColor: "#313442" }}
        onClick={() => onChange(data)}
      >
        <Text>{data.chainName}</Text>
      </Flex>
    );
  };

  const customStyles = {
    control: (styles: any) => ({
      ...styles,
      width: "200px",
      maxHeight: "32px !important",
      minHeight: "32px !important",
      backgroundColor: "#1F2128",
      cursor: "pointer",
      color: "#fff",
    }),
  };

  const [selectedOption, setSelectedOption] = useState<SelectOption | null>(
    null
  );

  const optionsList = supportedChain.map((chainInfo) => {
    return {
      ...chainInfo,
      value: chainInfo.chainId,
      label: chainInfo.chainName,
    };
  });

  console.log(network, selectedOption);

  const ValueContainer = () => {
    if (selectedOption) {
      return (
        <Flex
          w={"200px"}
          h={"32px"}
          color={"#fff"}
          px={"8px"}
          justifyContent={"space-between"}
          alignItems={"center"}
          fontSize={14}
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
        </Flex>
      );
    }
    return null;
  };

  return (
    <Select
      options={optionsList}
      components={{
        Option: CustomOption,
        ValueContainer: () => <ValueContainer />,
      }}
      styles={customStyles}
      value={selectedOption}
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
