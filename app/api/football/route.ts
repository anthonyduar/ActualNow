import { getLiveMatches } from "@/lib/football";
import { NextResponse } from "next/server";

export async function GET() {
  const matches = await getLiveMatches();
  return NextResponse.json(matches);
}
