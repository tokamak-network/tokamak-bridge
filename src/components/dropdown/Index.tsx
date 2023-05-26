import {
  SupportedChainId,
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { Flex } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/react";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { networkStatus } from "@/recoil/bridgeSwap/atom";
import useConnectedNetwork from "@/hooks/network";
import { useAccount, useSwitchNetwork } from "wagmi";
import { useEffect } from "react";

export default function NetworkDropdown(props: { inNetwork: boolean }) {
  const { inNetwork } = props;
  const [network, setNetwork] = useRecoilState(networkStatus);
  const { connectedChainId } = useConnectedNetwork();
  const { switchNetworkAsync, isError } = useSwitchNetwork();

  const onChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      const value: SupportedChainProperties["chainId"] = Number(
        event.target.value
      );
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
      return setNetwork({ ...network, inNetwork: connectedNetwork });
    }
  }, [connectedChainId]);

  return (
    <Select
      w={"200px"}
      h={"32px"}
      bgColor={"#1f2128"}
      _first={{ alignItems: "end" }}
      onChange={onChange}
      value={
        inNetwork ? network.inNetwork?.chainId : network.outNetwork?.chainId
      }
      defaultValue={connectedChainId}
    >
      {supportedChain.map((chainInfo) => {
        return (
          <option
            style={{ backgroundColor: "#1f2128" }}
            value={chainInfo.chainId}
            key={chainInfo.chainId}
          >
            <>
              {chainInfo.chainName}
              <Image src={chainInfo.networkImage} alt={chainInfo.chainName} />
            </>
            {/* <Flex>
              <Image src={chainInfo.networkImage} alt={chainInfo.chainName} />
            </Flex> */}
          </option>
        );
      })}
    </Select>
  );
}
