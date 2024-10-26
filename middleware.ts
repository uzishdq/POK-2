import { Session } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_API_URL,
  DEFAULT_AUTH,
  DEFAULT_LOGIN_REDIRECT,
  LOGIN_REQUIRED,
  PROTECTED_ROUTE,
  ROUTES,
  authRoutes,
} from "./lib/constan";
import { getToken } from "next-auth/jwt";

export async function middleware(
  request: NextRequest & { auth: Session | null },
) {
  const { nextUrl } = request;

  const session = await getToken({ req: request });

  const isPublicRoute = authRoutes.includes(nextUrl.pathname);
  const isLoginRequired = nextUrl.pathname.startsWith(LOGIN_REQUIRED);
  const isAuthRoute = nextUrl.pathname.startsWith(DEFAULT_LOGIN_REDIRECT);
  const isApiAuth = nextUrl.pathname.startsWith(DEFAULT_AUTH);
  const isApiRoute = nextUrl.pathname.startsWith(DEFAULT_API_URL);
  const isProtectedRoute = nextUrl.pathname.startsWith(PROTECTED_ROUTE);

  if (isPublicRoute) {
    if (session) {
      if (session?.statusUser === "APPROVED") {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      } else if (session?.statusUser === "REJECTED") {
        return NextResponse.redirect(new URL(ROUTES.LOGIN, nextUrl));
      }
    }
    return null;
  }

  if (!session && isAuthRoute) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, nextUrl));
  } else if (!session && isLoginRequired) {
    return NextResponse.redirect(new URL(ROUTES.LOGIN, nextUrl));
  }

  if (isApiAuth) {
    return null;
  } else if (!session && isApiRoute) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isProtectedRoute && session?.role === "USER") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isLoginRequired && session?.statusUser === "APPROVED") {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if (isAuthRoute && session?.statusUser === "PENDING") {
    return NextResponse.redirect(new URL(LOGIN_REQUIRED, nextUrl));
  }

  return null;
}
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
