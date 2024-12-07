import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authMiddleware } from "./middlewares/authMiddleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // let cookie = request.cookies.get("access_token");
  // const res = await fetch(
  //   process.env.NEXT_PUBLIC_API_BASE_URL + "/auth/profile",
  //   {
  //     headers: {
  //       Authorization: `Bearer ${cookie?.value}`,
  //     },
  //   },
  // );
  // const auth: User = await res.json();
  // const isAuthed = Boolean(auth.id);
  // console.log({ isAuthed });

  // if (request.nextUrl.pathname.startsWith("/auth")) {
  //   console.log("MIDDLEWARE AUTH");
  //   if (isAuthed)
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // if (request.nextUrl.pathname.startsWith("/dashboard")) {
  //   console.log("MIDDLEWARE DASHBOARD");
  //   if (!isAuthed)
  //     return NextResponse.redirect(new URL("/auth/login", request.url));
  // }
  const res = await authMiddleware(request);
  if (res) return res;

  // console.log("middleware");
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
