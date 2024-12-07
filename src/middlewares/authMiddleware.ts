import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(request: NextRequest) {
  let cookie = request.cookies.get("access_token");
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${cookie?.value}`,
      },
    },
  );
  const auth: User = await res.json();
  const isAuthed = Boolean(auth.id);
  // console.log({ isAuthed });

  if (request.nextUrl.pathname.startsWith("/auth")) {
    // console.log("MIDDLEWARE AUTH");
    if (isAuthed)
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // console.log("MIDDLEWARE DASHBOARD");
    if (!isAuthed)
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
