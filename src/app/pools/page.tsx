"use client";

import YourPools from "@/pools/YourPools";
import PoolsMessage from "@/pools/PoolsMessage";
import useMediaView from "@/hooks/mediaView/useMediaView";

export default function Page() {
  const { pcView } = useMediaView();

  return (
    pcView ? <YourPools /> : <PoolsMessage/>
  )
}