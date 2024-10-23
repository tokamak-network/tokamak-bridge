import { Box } from "@chakra-ui/react";
import LampIcon from "@/assets/icons/lamp.svg";
import Image from "next/image";
import Link from "next/link";
import { GoogleFormURL } from "@/constant/url";

export default function GetHelp() {
  return (
    <Link href={GoogleFormURL} target="_blank">
      <Image src={LampIcon} alt="Lamp"></Image>
    </Link>
  );
}
