import { supportedChain } from "@/types/network/supportedNetwork";
import { Flex } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import Image from "next/image";

export default function Dropdown() {
  return (
    // <select w={"56px"} h={"32px"} bgColor={"#1f2128"}>
    <select style={{ width: "56px", height: "32px", backgroundColor: "#000" }}>
      {supportedChain.map((chainInfo) => {
        return (
          <option>
            <Flex>
              <Image src={chainInfo.networkImage} alt={chainInfo.chainName} />
            </Flex>
          </option>
        );
      })}
    </select>
  );
}
