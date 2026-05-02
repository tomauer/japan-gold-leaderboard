import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const apiKey = process.env.EBIRD_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no API key" }, { status: 500 });

  const res = await fetch("https://api.ebird.org/v2/product/lists/JP-13?maxResults=3", {
    headers: { "X-eBirdApiToken": apiKey },
  });
  const data = await res.json();
  return NextResponse.json({ status: res.status, sample: data });
}
