import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // If user is not signed in, redirect to sign in page
  if (!userId && !isPublicRoute(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // If user is signed in and is on the "/", redirect to "/projects"
  if (userId && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
