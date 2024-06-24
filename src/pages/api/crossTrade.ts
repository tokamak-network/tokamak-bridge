import type { NextApiRequest, NextApiResponse } from "next";
import { crossTradeData } from "@/staging/components/cross-trade/components/core/main/__mocks__/crossTrade";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { limit, offset } = req.query;
    const start = parseInt(offset as string) || 0;
    const end = start + (parseInt(limit as string) || 10);

    const paginatedData = crossTradeData.slice(start, end);
    return res.status(200).json(paginatedData);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
