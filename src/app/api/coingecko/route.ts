import fetch from "node-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const tokenName = searchParams.get("tokenName");
  const API_URL = `https://pro-api.coingecko.com/api/v3/coins/markets?ids=${tokenName}&vs_currency=usd&x_cg_pro_api_key=${process.env.COINGECKO_API_KEY}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch the market price");
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
