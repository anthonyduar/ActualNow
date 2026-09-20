import { fetchWpNoticias } from "@/lib/wordpress";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetchWpNoticias(
      `search=${encodeURIComponent(q)}&_embed&per_page=12&categories_exclude=77&v=${Date.now()}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      return NextResponse.json([]);
    }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Error searching in API route:", error);
    return NextResponse.json([]);
  }
}
