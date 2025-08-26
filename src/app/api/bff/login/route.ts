import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiBase = process.env.NEXT_PUBLIC_API_URL!;
    const apiRes = await fetch(`${apiBase}/api/users/login`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      // server → API: não precisa credentials aqui
    });

    // corpo da API
    const data = await apiRes.json().catch(() => ({}));
    const res = new NextResponse(JSON.stringify(data), { status: apiRes.status });

    // pega o Set-Cookie vindo da API e reescreve para ser cookie do domínio da UI
    const setCookie = apiRes.headers.get("set-cookie");
    if (setCookie) {
      const rewritten = setCookie
        .replace(/Domain=[^;]+;?\s*/gi, "")     // remove Domain=.onrender.com
        .replace(/;\s*SameSite=None/gi, "; SameSite=Lax"); // agora é same-origin
      res.headers.append("Set-Cookie", rewritten);
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { message: "BFF login error", error: String(err) },
      { status: 500 }
    );
  }
}
