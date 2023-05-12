import { networkStatus } from "@/recoil/global/atom";
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

export default function Dropdown() {
  const [network, setNetworkStatus] = useRecoilState(networkStatus);

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value: SupportedChainProperties["chainId"] = Number(
      event.target.value
    );
    const selectedWork = supportedChain.filter((supportedChain) => {
      return supportedChain.chainId === value;
    });
    setNetworkStatus(selectedWork[0]);
  };

  return (
    <Select
      w={"56px"}
      h={"32px"}
      bgColor={"#1f2128"}
      _first={{ alignItems: "end" }}
      onChange={onChange}
      defaultValue={network?.chainId}
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
