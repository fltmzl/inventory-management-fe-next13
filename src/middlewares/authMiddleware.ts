import { NextRequest, NextResponse } from "next/server";

export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  let isAuthed = false;

  if (token) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      if (res.ok) {
        const auth: User = await res.json();
        isAuthed = Boolean(auth?.id);
      }
    } catch (error) {
      isAuthed = false;
    }
  }

  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (isAuthed)
      return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!isAuthed)
      return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
