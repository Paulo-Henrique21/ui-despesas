import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL!;
  // repassa o cookie da UI para a API
  const cookie = req.headers.get("cookie") || "";

  const apiRes = await fetch(`${apiBase}/api/users/profile`, {
    method: "GET",
    headers: { cookie }, // ⭐ envia o token para a API
    cache: "no-store",
  });

  const data = await apiRes.json().catch(() => ({}));

  // não deixe o Next cachear
  const res = new NextResponse(JSON.stringify(data), {
    status: apiRes.status,
    headers: { "Cache-Control": "no-store" },
  });

  return res;
}
