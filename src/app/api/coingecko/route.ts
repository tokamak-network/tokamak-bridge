import fetch from "node-fetch";
import { NextRequest, NextResponse } from "next/server";

const isTokamakEcosystemTokenName = (tokenName: string): boolean => {
  if (!tokenName) {
    throw new Error("Token name is required");
  }

  const supportedTokens = ["dooropen", "aura", "lyda", "tonstarter"];
  return supportedTokens.includes(tokenName);
};

const fetchPrice = async (tokenName: string, isEcosystemToken: boolean) => {
  const API_URL = `https://pro-api.coingecko.com/api/v3/coins/markets?ids=${tokenName}&vs_currency=usd&x_cg_pro_api_key=${process.env.COINGECKO_API_KEY}`;

  if (isEcosystemToken) {
    switch (tokenName) {
      case "tonstarter":
        const response = await fetch(
          "https://price.api.tokamak.network/tosprice",
        );
        return response;
      case "dooropen": {
        const response = await fetch(
          "https://price.api.tokamak.network/docprice",
        );
        return response;
      }
      case "aura": {
        const response = await fetch(
          "https://price.api.tokamak.network/auraprice",
        );
        return response;
      }
      case "lyda": {
        const response = await fetch(
          "https://price.api.tokamak.network/lydaprice",
        );
        return response;
      }
    }
  }
  const response = await fetch(API_URL);
  return response;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const tokenName = searchParams.get("tokenName");

  if (!tokenName) {
    throw new Error("Token name is required");
  }

  try {
    const isEcosystemToken = isTokamakEcosystemTokenName(tokenName);
    const response = await fetchPrice(tokenName, isEcosystemToken);

    if (!response.ok) throw new Error("Failed to fetch the market price");

    const data = await response.json();
    return NextResponse.json(
      isEcosystemToken ? [{ current_price: data }] : data,
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
