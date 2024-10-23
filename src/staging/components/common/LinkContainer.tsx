import getBlockExplorerUrl from "@/staging/utils/getBlockExplorerUrl";
import { Link } from "@chakra-ui/react";
import React from "react";

export const LinkContainer = (props: {
  chainId: number;
  address: string;
  component: React.ReactNode;
}) => {
  const { chainId, address, component } = props;
  const blockExplorer = getBlockExplorerUrl(chainId);
  return (
    <Link href={`${blockExplorer}/address/${address}`} isExternal={true}>
      {component}
    </Link>
  );
};
