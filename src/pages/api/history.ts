import type { NextApiRequest, NextApiResponse } from "next";
import { historyData } from "@/staging/components/new-history/__mocks__/history.mock";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return res.status(200).json(historyData);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
