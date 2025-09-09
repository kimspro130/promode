import { NextRequest, NextResponse } from "next/server";

// Simple middleware without authentication
export default function middleware(req: NextRequest) {
  // Allow all routes since we removed authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
