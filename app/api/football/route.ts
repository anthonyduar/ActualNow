import { getLiveMatches } from "@/lib/football";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const matches = await getLiveMatches();
  return NextResponse.json(matches, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

