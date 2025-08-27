import { NextRequest, NextResponse } from "next/server";
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";
  const url = `${API_BASE}/api/users/profile`;

  try {
    const r = await fetch(url, { headers: { cookie }, cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, {
      status: r.status,
      headers: { "cache-control": "no-store" },
    });
  } catch {
    return NextResponse.json(
      { message: "upstream_unreachable" },
      { status: 502 }
    );
  }
}
