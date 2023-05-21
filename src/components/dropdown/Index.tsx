import {
  SupportedChainProperties,
  supportedChain,
} from "@/types/network/supportedNetwork";
import { Flex } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/react";
import Image from "next/image";
import { useRecoilState } from "recoil";
import { Chain } from "viem/dist/types/types/eip1193";
import { useEffect } from "react";
import { networkStatus } from "@/recoil/bridgeSwap/atom";

export default function NetworkDropdown(props: { inNetwork: boolean }) {
  const { inNetwork } = props;
  const [network, setNetwork] = useRecoilState(networkStatus);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: SupportedChainProperties["chainId"] = Number(
      event.target.value
    );
    const selectedWork = supportedChain.filter((supportedChain) => {
      return supportedChain.chainId === value;
    });
    if (inNetwork === true) {
      console.log("true");
      console.log(selectedWork[0]);
      return setNetwork({ ...network, inNetwork: selectedWork[0] });
    }
    return setNetwork({ ...network, outNetwork: selectedWork[0] });
  };

  return (
    <Select
      w={"200px"}
      h={"32px"}
      bgColor={"#1f2128"}
      _first={{ alignItems: "end" }}
      onChange={onChange}
      // defaultValue={network?.chainId}
    >
      {supportedChain.map((chainInfo) => {
        return (
          <option
            style={{ backgroundColor: "#1f2128" }}
            value={chainInfo.chainId}
          >
            <span>
              {chainInfo.chainName}
              <Image src={chainInfo.networkImage} alt={chainInfo.chainName} />
            </span>
            {/* <Flex>
              <Image src={chainInfo.networkImage} alt={chainInfo.chainName} />
            </Flex> */}
          </option>
        );
      })}
    </Select>
  );
}
